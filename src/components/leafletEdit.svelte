<script lang="ts">
  import { onMount, onDestroy, setContext, createEventDispatcher, tick } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { env } from '$env/dynamic/public';
  import { pb } from '$lib/database';
  import { userCookie } from '$lib/stores';
  import 'leaflet-routing-machine';
  import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
  import 'leaflet-control-geocoder';
  import 'lrm-graphhopper'

  import '@raruto/leaflet-elevation/src/index.js';
  import '@raruto/leaflet-elevation/src/index.css';

  import 'leaflet-simple-map-screenshoter';
  import * as imageConversion from 'image-conversion';

  import type { User, Route, Routes, Course, Coordinates, ElevationResponse, Activities, Waypoints } from '$lib/types';

  export let bounds: L.LatLngBoundsExpression | undefined = undefined;
  export let view: L.LatLngExpression | undefined = undefined;
  export let zoom: number | undefined = undefined;
  export let user: User;
  export let from: string;
  export let routeData: Course;

  const dispatch = createEventDispatcher();

  let map: L.Map | undefined;
  let mapElement: HTMLElement;

  let waypoints: L.LatLng[] = [];
  let routingControl: L.Routing.Control | undefined;
  let route: Route
  let courseName: string = ""
  let elevationControl: L.elevationControl | undefined;
  let allowMapInteraction = true;
  let resetButtonContainer: HTMLElement | null = null;
  let visibleNav: boolean = true;

  let distance: number = 0;
  let elevationGain: number = 0;
  // let estimatedTime: number = 0;

  let type: string = "cycling";
  let mode: string = "bike";
  let activities: Activities;

  let formData: any;

  let simpleMapScreenshoter: L.simpleMapScreenshoter | undefined;
  let screenshotBlob: Blob
  let screenshotOptions = {
    cropImageByInnerWH: true,
    hidden: true,
    preventDownload: true,
    hideElementsWithSelectors: ['.leaflet-control-container', '.leaflet-marker-icon', '.leaflet-edgescale-pane'],
    mimeType: 'image/png',
  }

  let graphApi;
  let averageSpeed = 0;

  onMount(async() => {
    graphApi = env.PUBLIC_GRAPHHOPPER_API
    if (!graphApi)  {
      const { PUBLIC_GRAPHHOPPER_API } = await import ('$env/static/public')
      graphApi = PUBLIC_GRAPHHOPPER_API;
    }

    if (!bounds && (!view || !zoom)) {
      throw new Error('Must set either bounds, or view and zoom.');
    }

    map = L.map(mapElement)
      .on('zoom', (e: MouseEvent) => dispatch('zoom', e))
      .on('popupopen', async (e: L.map) => {
        await tick();
        e.popup.update();
      })
      .on('click', handleMapClick);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    routingControl = L.Routing.control({
      routeWhileDragging: true,
      geocoder: L.Control.Geocoder.nominatim(),
      // users might need to provider their own.
      router: env.PUBLIC_OSRM_URL ?
        L.Routing.osrmv1({
          serviceUrl: env.PUBLIC_OSRM_URL,
          urlParameters: {
            vehicle: mode,
          }
        })
      : env.PUBLIC_GRAPHHOPPER_URL ?
        L.Routing.graphHopper(undefined, {
          serviceUrl: env.PUBLIC_GRAPHHOPPER_URL,
          urlParameters: {
            profile: mode,
          }
        })
      : env.PUBLIC_GRAPHHOPPER_API ?
        L.Routing.graphHopper(graphApi, {
          urlParameters: {
            profile: mode,
          }
        })
      : null,
      showAlternatives: true,
      lineOptions: {
        styles: [{ color: 'orange', opacity: 0.2, weight: 10 }]
      },
      createMarker: function (i: number, waypoint: any, n: number) {
        let iconUrl = '/waypoint.png';

        // Use different icon for the first waypoint
        if (i === 0) {
          iconUrl = '/start.png'; // Change 'start.png' to the path of your start marker icon
        }

        // Use different icon for the last waypoint
        if (i === n - 1) {
          iconUrl = '/finish.png'; // Change 'end.png' to the path of your end marker icon
        }
        const marker = L.marker(waypoint.latLng, {
          draggable: true,
          icon: L.icon({
            iconUrl: iconUrl,
            iconSize: [18, 18],
          })
        });
        return marker;
      }
    }).addTo(map);

    simpleMapScreenshoter = L.simpleMapScreenshoter(screenshotOptions).addTo(map);

    async function getElevationData(coordinates: Coordinates) {
      try {
        const apiUrl = 'https://api.open-elevation.com/api/v1/lookup';

        // Transform coordinates into the required format
        const locations: ElevationResponse = coordinates.map(coord => ({
          latitude: coord.lat,
          longitude: coord.lng
        }));

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ locations }),
        });

        if (response.ok) {
          const data: ElevationResponse = await response.json();
          return data.results.map(result => result.elevation);
        } else {
          console.error('Open-Elevation API Error:', response.status, response.statusText);
          throw new Error('Failed to fetch elevation data');
        }
      } catch (error) {
        console.error('Error in getElevationData:', error);
        throw error;
      }
    }

    routingControl.on('waypointschanged', handleWaypointsChanged);

    routingControl.on('routesfound', async function (e: Routes) {
      route = e.routes[0];

      // Get elevation data for each coordinate in the route
      const elevationData = await getElevationData(route.coordinates);

      // Update elevation property for each coordinate in the route
      route.coordinates.forEach((coord: Coordinates, index: number) => {
        coord.meta = { elevation: elevationData[index] };
      });

      distance = route.summary.totalDistance;
      elevationGain = route.summary.totalAscend;
      // estimatedTime = route.summary.totalTime;

      if (!elevationControl) {
        elevationControl = L.control.elevation({
          // CHANGE ME: with your own http server folder (eg. "http://custom-server/public/path/to/leaflet-elevation/src/")
          srcFolder: 'https://unpkg.com/@raruto/leaflet-elevation/src/',
          // theme: 'lime-theme',
          detached: false,
          position: "bottomright",
          slope: "summary",
          altitude: true,
          time: false,
          // summary: 'inline',
          summary: false,
          followMarker: true,
          autofitBounds: false,
          legend: false,
          waypoints: false,
          wptLabels: false,
          // closeBtn: false,
        }).addTo(map);
      }

      // Clear existing data and add the route to the elevation control
      elevationControl.clear();
      // elevationControl.addData(elevationChartData);
      elevationControl.load(generateGPX(route))
    });

    // If there is a route (from edit), load it
    if (routeData) {
      // Different json for graphhopper/osrm
      if (routeData.builder.actualWaypoints) {
        waypoints = routeData.builder.actualWaypoints.map((waypoint: Waypoints) => waypoint.latLng);
      } else if (routeData.builder.inputWaypoints) {
        waypoints = routeData.builder.inputWaypoints.map((waypoint: Waypoints) => waypoint.latLng);
      }

      routingControl?.setWaypoints(waypoints);

      // Trigger route calculation
      route = routeData.builder
      routingControl?.route();

      courseName = routeData.title;

      activities = await pb.collection('activities').getList(1, 10, {filter: `user = "${$userCookie.user.id}" && sport = "${routeData.sport}"`, sort: '-start_time'});
    } else {
      activities = await pb.collection('activities').getList(1, 10, {filter: `user = "${$userCookie.user.id}" && sport = "${type}"`, sort: '-start_time'});
    };

    for (var i=0; i < activities.items.length; i++){
      averageSpeed += activities.items[i].avg_speed
    }
    averageSpeed = averageSpeed / activities.items.length

    fixButton()

    // Generate a reset button inside the leaflet routing menu
    const leafletRoutingDiv = document.querySelector('.leaflet-routing-container');

    if (leafletRoutingDiv) {
      // Create a container for the reset button
      resetButtonContainer = document.createElement('div');
      resetButtonContainer.classList.add('absolute', 'bottom-3', 'left-[6px]', 'z-50');

      // Create the reset button
      const resetButton = document.createElement('button');
      resetButton.textContent = 'Reset Route';
      resetButton.classList.add('text-sm', 'font-semibold', 'border', 'rounded-[4px]', 'py-[1px]', 'px-1', 'mr-3', 'hover:bg-neutral-700');
      resetButton.addEventListener('click', resetRoute);

      const toggleHide = document.createElement('button');
      toggleHide.classList.add('text-sm', 'font-semibold', 'border', 'rounded-[4px]', 'py-[1px]', 'px-1', 'hover:bg-neutral-700');
      toggleHide.textContent = 'Hide Menu';
      toggleHide.addEventListener('click', toggleNav);

      // Append the reset button to the container
      resetButtonContainer.appendChild(resetButton);
      resetButtonContainer.appendChild(toggleHide);

      // Append the container to the "leaflet-routing" div
      leafletRoutingDiv.appendChild(resetButtonContainer);
    }
  });

  onDestroy(() => {
    map?.remove();
    map = undefined;
  });

  setContext('map', {
    getMap: () => map
  });

  $: if (map && from == "new") {
    if (bounds) {
      map.fitBounds(bounds);
    } else if (view && zoom) {
      map.setView(view, zoom);
    }
  }

  function handleMapClick(event: L.LeafletMouseEvent) {
    if (allowMapInteraction) {
      const { lat, lng } = event.latlng;
      const waypoint = L.latLng(lat, lng);

      waypoints.push(waypoint);
      // adds a null entry on first click for some reason, so filter null out.
      waypoints = waypoints.filter(element => element !== null);

      routingControl?.setWaypoints(waypoints);

      allowMapInteraction = false;
      setTimeout(() => {
        allowMapInteraction = true;
      }, 1000);
    }
    fixButton()
  }

  function handleWaypointsChanged() {
    const newWaypoints = routingControl?.getWaypoints().map((waypoint) => waypoint.latLng);
    if (newWaypoints) {
      waypoints = newWaypoints;
    }
  }

  function exportToGPX() {
    if (route) {
      const gpxData = generateGPX(route);
      const blob = new Blob([gpxData], { type: 'application/gpx+xml' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'route.gpx';
      link.click();
    } else {
      console.error('No route available to export.');
    }
  }

  function generateGPX(routeData: Route) {
    const gpx = `<?xml version='1.0' encoding='UTF-8'?>
<gpx version="1.1" creator="${user.name}" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${courseName}</name>
    <author>
      <name>${user.name}</name>
      <link href="${user.id}" />
    </author>
    <copyright author="OpenStreetMap contributors">
     // <year>2020</year>
     <license>https://www.openstreetmap.org/copyright</license>
    </copyright>
    <link href="link to router" />
  </metadata>
  <trk>
    <name>${courseName}</name>
    <type>${type}</type>
    <trkseg>
      ${routeData.coordinates.map((coord: Coordinates, index: number) =>`<trkpt lat="${coord.lat}" lon="${coord.lng}">
        <ele>${coord.meta.elevation}</ele>
      </trkpt>`).join('\n')}
    </trkseg>
  </trk>
</gpx>
    `;
    return gpx;
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();

    const gpx = generateGPX(route)
    await createScreenshot()

    const formElement = event.target as HTMLFormElement;
    formData = new FormData(formElement);

    formData.append('user', user.id);
    formData.append('gpx', new Blob([gpx], { type: 'application/gpx+xml' }), 'activity.gpx')
    formData.append('distance', distance);
    formData.append('elevation', elevationGain);
    // formData.append('time', estimatedTime);
    formData.append('time', ((distance/1000)/(averageSpeed) * 60 * 60).toFixed(0));
    formData.append('sport', type);
    formData.append('img', screenshotBlob, 'route.jpeg')
    formData.append('builder', JSON.stringify(route))

    let response
    try {
      response = await fetch('/create', {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      return console.error(error);
    };

    if (response.ok) {
      let link = await response.json()
      setTimeout(window.location.href = `/routes/${link}`,2000)
    }
  }

  async function handleUpdate(event: Event) {
    event.preventDefault();

    const gpx = generateGPX(route)
    await createScreenshot()

    const formElement = event.target as HTMLFormElement;
    formData = new FormData(formElement);

    formData.append('gpx', new Blob([gpx], { type: 'application/gpx+xml' }), 'activity.gpx')
    formData.append('distance', distance);
    formData.append('elevation', elevationGain);
    // formData.append('time', estimatedTime);
    formData.append('time', ((distance/1000)/(averageSpeed) * 60 * 60).toFixed(0));
    formData.append('sport', type);
    formData.append('img', screenshotBlob, 'route.jpeg')
    formData.append('builder', JSON.stringify(route))
    formData.append('id', routeData.id)

    let response
    try {
      response = await fetch('/update', {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      return console.error(error);
    };

    if (response.ok) {
      let link = await response.json()
      setTimeout(window.location.href = `/routes/${link}`,2000)
    }
  }

  export async function createScreenshot(){
    const format = 'blob';
    const overridedPluginOptions = {
      mimeType: 'image/jpeg',
    };

    if (map && route) {
      const routeBounds = L.latLngBounds(route.coordinates);
      map.fitBounds(routeBounds.pad(0.1)); // Adjust padding as needed
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      screenshotBlob = await simpleMapScreenshoter.takeScreen(format, overridedPluginOptions);
      screenshotBlob = await imageConversion.compressAccurately(screenshotBlob,100);
    } catch (error) {
      console.error('Error creating screenshot:', error);
    }
  }

  function resetRoute() {
    waypoints = [];
    routingControl?.setWaypoints([]);
    elevationControl?.clear();
  }

  const handleClick = async() => {
    switch (type) {
      case 'cycling':
        type = 'running';
        mode = 'foot';
        break;
      case 'running':
        type = 'cycling';
        mode = 'bike'
        break;
      // case 'swimming':
      //   type = 'cycling';
      //   break;
      default:
        type = 'cycling';
    }

    // switch routing method and update route
    if (env.PUBLIC_GRAPHHOPPER_URL) {
      routingControl.options.router.options.urlParameters.profile = mode;
    } else {
      routingControl.options.router.options.urlParameters.vehicle = mode;
    }
    routingControl.route();

    activities = await pb.collection('activities').getList(1, 10, {filter: `user = "${$userCookie.user.id}" && sport = "${type}"`, sort: '-start_time'});
    averageSpeed = 0;
    for (var i=0; i < activities.items.length; i++){
      averageSpeed += activities.items[i].avg_speed
    }
    averageSpeed = averageSpeed / activities.items.length
  };

  function fixButton() {
    // Routing machine button is just a span that is click-through.
    // This should fix the issue that when removing a waypoint it also click the map.
    // Works but sometimes still happens
    const interactiveSpans = document.querySelectorAll('.leaflet-routing-remove-waypoint');
    const interactiveLinks = document.querySelectorAll('.elevation-toggle-icon');
    interactiveSpans.forEach(function (interactiveSpan) {
        interactiveSpan.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    });
    interactiveLinks.forEach(function (interactiveLink) {
        interactiveLink.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    });
  }

  function toggleNav() {
    let elements = document.getElementsByClassName("leaflet-routing-container") as HTMLCollectionOf<HTMLElement>;
    let button = document.getElementById("showNav")!;
    for (var i = 0; i < elements.length; i++) {
      if (visibleNav) {
        elements[i].style.display = 'none';
        button.style.display = "inline";
        visibleNav = false;
      } else {
        elements[i].style.display = 'inline';
        button.style.display = "none";
        visibleNav = true;
      }
    }
  }
</script>

<div class="w-full h-full">
  <button on:click={() => toggleNav()} id="showNav" style="display: none;" class="absolute top-[10px] right-[15px] z-50 w-[36px] h-[36px] bg-neutral-800 rounded-[4px] text-white flex items-center">
    <svg class="w-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path class="stroke-neutral-400 stroke-2" d="M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.1-.1.2-.1.3 0 .6.4 1 1 1h18c.6 0 1-.4 1-1 0-.1 0-.2-.1-.3l-2-6a1 1 0 0 0-.9-.7h-3.835"/><path class="fill-orange-500" d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0"/><circle class="fill-neutral-800" cx="12" cy="8" r="2"/></svg>
  </button>
  <div class="w-full h-[90%]" bind:this={mapElement}>
    {#if map}
      <slot />
    {/if}
  </div>
  <div class="flex flex-row w-full h-[10%] bg-neutral-800 border border-neutral-400">
    <button on:click={handleClick} class="h-full w-[6%] border-e border-neutral-400 group">
      <div class="flex flex-col h-full justify-center items-center  group-hover:bg-neutral-900">
        <span class="text-white text-xs md:text-sm">Type</span>
        {#if type == "cycling"}
          <svg class="mt-1 text-neutral-400 group-hover:text-orange-600" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
        {:else if type == "running"}
          <svg class="mt-1 text-neutral-400 group-hover:text-orange-600" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg>
        {/if}
      </div>
    </button>
    <div class="flex flex-col justify-center h-full w-[15%] border-e border-neutral-400 pl-1 md:pl-5">
      <span class="text-white text-xs md:text-sm">Distance</span>
      <span class="text-neutral-400 text-sm md:text-2xl font-semibold">
        {#if distance}{(distance / 1000).toFixed(2)}{:else}0.00{/if} km
      </span>
    </div>
    <div class="flex flex-col justify-center h-full w-[15%] border-e border-neutral-400 pl-1 md:pl-5">
      <span class="text-white text-xs md:text-sm">Elevation Gain</span>
      <span class="text-neutral-400 text-sm md:text-2xl font-semibold">
        <!-- 0.6 because of free elevation api not being very accurate -->
        {#if elevationGain}{(elevationGain*0.6).toFixed(2)}{:else}0.00{/if} m
      </span>
    </div>
    <div class="flex flex-col justify-center h-full w-[15%] border-e border-neutral-400 pl-1 md:pl-5">
      <span class="text-white text-xs md:text-sm">Est. Moving Time</span>
      <span class="text-neutral-400 text-sm md:text-2xl font-semibold">
        {#if averageSpeed}{((distance/1000)/(averageSpeed) * 60).toFixed(0)}{/if} min.
      </span>
    </div>
    <div class="flex flex-row w-[39%]">
      <div class="w-[75.2%]">
        {#if from == "new"}
          <form id="input" method="POST" on:submit={handleSubmit} class="flex justify-center items-center h-full">
            <div class="flex flex-col">
              <span class="text-white -mt-2 text-sm">Course name:</span>
              <input bind:value={courseName} type="text" name="title" class="bg-neutral-700 text-white text-md md:text-2xl border border-neutral-400 w-full" />
            </div>
          </form>
        {:else if from == "edit"}
          <form id="input" method="POST" on:submit={handleUpdate} class="flex justify-center items-center h-full">
            <div class="flex flex-col">
              <span class="text-white -mt-2 text-sm">Course name:</span>
              <input bind:value={courseName} type="text" name="title" class="bg-neutral-700 text-white text-md md:text-2xl border border-neutral-400 w-full" />
            </div>
          </form>
        {/if}
      </div>
      <div class="flex justify-center items-center h-full w-[25.8%] border-s border-neutral-400" style="{courseName != '' && route != undefined ? '' : 'cursor: not-allowed;'}">
        <button type="submit" form="input" class="text-white w-full h-full text-md md:text-2xl font-semibold hover:bg-neutral-900 hover:text-orange-600" style="{courseName != '' && route != undefined ? '' : 'pointer-events: none;' }">Save</button>
      </div>
    </div>

    <div class="flex justify-center items-center h-full w-[10%] border-s border-neutral-400">
      <button class="text-white w-full h-full text-md md:text-2xl font-semibold hover:bg-neutral-900 hover:text-orange-600" on:click={exportToGPX}>Export GPX</button>
    </div>
  </div>
</div>


<style>
/* fix screenshot tailwind grid */
:global(.leaflet-tile) {
  border-style: none !important;
}
:global(.elevation-control .area) {
    fill:  #ff9f24 ;
    opacity: 1;
}
:global(.elevation-control .background) {
    background-color: rgb(38 38 38);
}
:global(.tick text, .axis text) {
  font-size: 15px;
  fill: white !important;
  color: white !important;
  stroke-width: 0px !important;
}
:global(.elevation-detached.lightblue-theme .area) {
  stroke: orange;
  stroke-width: 3px;
}
:global(.leaflet-elevation-pane, .leaflet-marker-pane, .elevation-polyline){
  pointer-events: none !important;
}
:global(.leaflet-marker-icon) {
  opacity: 0;
}
:global(img.leaflet-marker-draggable) {
  opacity: 1 !important;
}
:global(.dist-marker) {
  opacity: 1 !important;
  font-size: 0.75rem;
  text-align: center;
  font-weight: 800;
  color: #fff;
  background: #000;
  border: 2px solid #777;
  width: 1.3rem !important;
  height: 1.3rem !important;
  margin-left: -10px !important;
  margin-top: -10px !important;
}
:global(.leaflet-bottom) {
  max-width: 40% !important;
}
:global(.background) {
  height: 100%;
}
:global(.grid){
  opacity: 0;
}
:global(.leaflet-routing-container) {
  background-color: rgb(38 38 38);
  color: white;
  border-radius: 7px;
}
:global(.leaflet-routing-geocoders) {
  border-bottom: none;
}
:global(.leaflet-routing-geocoder input) {
  background-color: rgb(38 38 38);
  padding: 2px;
  border-radius: 5px;
}
:global(.leaflet-routing-add-waypoint) {
  background-color: rgb(38 38 38) !important;
  color: white;
  padding-inline: 5px;
  margin-top: 3px !important;
  width: 25px;
  height: 25px;
}
:global(.leaflet-routing-add-waypoint:hover) {
  background-color: rgb(64 64 64) !important;
}
:global(.leaflet-routing-remove-waypoint::after) {
  position: absolute;
  display: block;
  width: 25px;
  height: 26px;
  right: 0px;
  top: 2px;
  bottom: 0;
  font-size: 18px;
  font-weight: bold;
  content: "\00d7";
  text-align: center;
  cursor: pointer;
  color: white !important;
  background: rgb(38 38 38) !important;
  padding-top: 3px;
  padding-left: 5px;
  line-height: 1;
  border-width: 1px;
  border-color: white;
  border-radius: 4px;
}
:global(.leaflet-routing-remove-waypoint:hover::after) {
  background-color: rgb(64 64 64) !important;
}
:global(.leaflet-routing-alternatives-container) {
  display: none;
}
:global(.elevation-toggle-icon::before) {
  background: rgb(38 38 38) !important;
  color: white;
  border-width: 1px;
  border-color: white;
  border-radius: 4px;
}

:global(.elevation-toggle-icon, .leaflet-control-zoom, .leaflet-bar a) {
  background: rgb(38 38 38) !important;
  color: white;
}
:global(.lightblue-theme) {
  --ele-area: rgb(251 146 60);
  --ele-line: rgb(251 146 60);
}
:global(.leaflet-control-attribution) {
  background: rgb(38 38 38) !important;
  color: white;
}
:global(.leaflet-control-attribution svg) {
  display: none !important;
}
</style>
