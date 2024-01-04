<script lang="ts">
  import { onMount, onDestroy, setContext, createEventDispatcher, tick } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet-routing-machine';
  import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
  import 'leaflet-control-geocoder';
  import 'lrm-graphhopper'

  import '@raruto/leaflet-elevation/src/index.js';
  import '@raruto/leaflet-elevation/src/index.css';

  export let bounds: L.LatLngBoundsExpression | undefined = undefined;
  export let view: L.LatLngExpression | undefined = undefined;
  export let zoom: number | undefined = undefined;

  const dispatch = createEventDispatcher();

  let map: L.Map | undefined;
  let mapElement: HTMLElement;

  let waypoints: L.LatLng[] = [];
  let routingControl: L.Routing.Control | undefined;
  let route
  let courseName = ""
  let elevationControl: any;
  let allowMapInteraction = true;

  let distance: number = 0;
  let elevationGain: number = 0;
  let estimatedTime: number = 0;

  onMount(() => {
    if (!bounds && (!view || !zoom)) {
      throw new Error('Must set either bounds, or view and zoom.');
    }

    map = L.map(mapElement)
      .on('zoom', (e: MouseEvent) => dispatch('zoom', e))
      .on('popupopen', async (e) => {
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
      router: L.Routing.graphHopper('972234b5-1b03-4502-8243-c1d6412c8b91', {
        urlParameters: {
          vehicle: 'bike'
        }
      }),
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

    async function getElevationData(coordinates) {
      try {
        const apiUrl = 'https://api.open-elevation.com/api/v1/lookup';

        // Transform coordinates into the required format
        const locations = coordinates.map(coord => ({
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
          const data = await response.json();
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

    routingControl.on('routesfound', async function (e) {
      route = e.routes[0];

      // Get elevation data for each coordinate in the route
      const elevationData = await getElevationData(route.coordinates);

      // Update elevation property for each coordinate in the route
      route.coordinates.forEach((coord, index) => {
        coord.meta = { elevation: elevationData[index] };
      });

      distance = route.summary.totalDistance;
      elevationGain = route.summary.totalAscend;
      estimatedTime = route.summary.totalTime;

      if (!elevationControl) {
        elevationControl = L.control.elevation({
          // CHANGE ME: with your own http server folder (eg. "http://custom-server/public/path/to/leaflet-elevation/src/")
          srcFolder: 'http://unpkg.com/@raruto/leaflet-elevation/src/',
          // theme: 'lime-theme',
          detached: false,
          position: "bottomleft",
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
        }).addTo(map);
      }

      console.log(route)

      // Clear existing data and add the route to the elevation control
      elevationControl.clear();
      // elevationControl.addData(elevationChartData);
      elevationControl.load(generateGPX(route))
    });

  });

  onDestroy(() => {
    map?.remove();
    map = undefined;
  });

  setContext('map', {
    getMap: () => map
  });

  $: if (map) {
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

  function generateGPX(routeData) {
    const gpx = `<?xml version='1.0' encoding='UTF-8'?>
<gpx version="1.1" creator="Matthias Benaets" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>16/12</name>
    <author>
      <name>name of athlete</name>
      <link href="this is the link to the athlete" />
    </author>
    <copyright author="OpenStreetMap contributors">
     <year>2020</year>
     <license>https://www.openstreetmap.org/copyright</license>
    </copyright>
    <link href="link to router" />
  </metadata>
  <trk>
    <name>name of activity</name>
    <type>cycling</type>
    <trkseg>
      ${routeData.coordinates.map((coord, index) =>`<trkpt lat="${coord.lat}" lon="${coord.lng}">
        <ele>${coord.meta.elevation}</ele>
      </trkpt>`).join('\n')}
    </trkseg>
  </trk>
</gpx>
    `;
    return gpx;
  }

  function test() {
    console.log(courseName)
  }

  console.log(route)
</script>

<div class="w-full h-full">
  <div class="w-full h-[90%]" bind:this={mapElement}>
    {#if map}
      <slot />
    {/if}
  </div>
  <div class="flex flex-row w-full h-[10%] bg-neutral-800 border border-neutral-400">
    <div class="flex flex-col justify-center items-center h-full w-[6%] border-e border-neutral-400">
      <span class="text-white text-sm">Type</span>
      <svg class="mt-1 text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
    </div>
    <div class="flex flex-col justify-center h-full w-[15%] border-e border-neutral-400 pl-5">
      <span class="text-white text-sm">Distance</span>
      <span class="text-neutral-400 text-2xl font-semibold">
        {#if distance}{(distance / 1000).toFixed(2)}{:else}0.00{/if} km
      </span>
    </div>
    <div class="flex flex-col justify-center h-full w-[15%] border-e border-neutral-400 pl-5">
      <span class="text-white text-sm">Elevation Gain</span>
      <span class="text-neutral-400 text-2xl font-semibold">
        <!-- 0.6 because of free elevation api not being very accurate -->
        {#if elevationGain}{(elevationGain*0.6).toFixed(2)}{:else}0.00{/if} m
      </span>
    </div>
    <div class="flex flex-col justify-center h-full w-[15%] border-e border-neutral-400 pl-5">
      <span class="text-white text-sm">Est. Moving Time</span>
      <span class="text-neutral-400 text-2xl font-semibold">
        {#if estimatedTime}{(estimatedTime / 60 / 1.7).toFixed(0)}{:else}0{/if} min.
      </span>
    </div>
    <div class="flex flex-row w-[39%]">
      <div class="w-[75.2%]">
        <form class="flex justify-center items-center h-full">
          <div class="flex flex-col">
            <span class="text-white -mt-2 text-sm">Course name:</span>
            <input bind:value={courseName} type="text" class="bg-neutral-700 text-white text-2xl border border-neutral-400 w-full" />
          </div>
        </form>
      </div>
      <div class="flex justify-center items-center h-full w-[25.8%] border-s border-neutral-400" style="{courseName != '' && route != undefined ? '' : 'cursor: not-allowed;'}">
        <button on:click={test} class="text-white w-full h-full text-2xl font-semibold hover:bg-neutral-900 hover:text-orange-600" style="{courseName != '' && route != undefined ? '' : 'pointer-events: none;' }">Save</button>
      </div>
    </div>

    <div class="flex justify-center items-center h-full w-[10%] border-s border-neutral-400">
      <button class="text-white w-full h-full text-2xl font-semibold hover:bg-neutral-900 hover:text-orange-600" on:click={exportToGPX}>Export GPX</button>
    </div>
  </div>
</div>


<style>
:global(.elevation-control .area) {
    fill:  #ff9f24 ;
    opacity: 1;
}
:global(.elevation-control .background) {
    background-color: rgb(38 38 38);
}
:global(.elevation-control, .axis text, .elevation-control, .legend text, .elevation-control, .point text) {
  fill: white;
  font-size: 15px;
  font-weight: 700;
  paint-order: stroke fill;
  stroke: #fff;
  stroke-width: 0px;
}
:global(.elevation-detached.lightblue-theme .area) {
  stroke: orange;
  stroke-width: 3px;
}
/* :global(.height-focus-group, .circle-lower, .height-focus, .leaflet-elevation-pane, .leaflet-marker-pane, .elevation-polyline){ */
/*   pointer-events: none !important; */
/* } */
:global(.leaflet-elevation-pane, .leaflet-marker-pane, .elevation-polyline){
  pointer-events: none !important;
}
/* :global(.leaflet-interactive) { */
/*   opacity: 0.2; */
/* } */
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
:global(.leaflet-routing-container){
  display: none;
}
</style>
