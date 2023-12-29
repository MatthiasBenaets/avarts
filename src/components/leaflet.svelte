<script lang="ts">
  import { onMount, onDestroy, setContext, createEventDispatcher, tick } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet-routing-machine';
  import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
  import 'leaflet-control-geocoder';
  import 'lrm-graphhopper'

  // import '@raruto/leaflet-elevation';
  // import '@raruto/leaflet-elevation/dist/leaflet-elevation.css'

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
  let elevationControl: any;
  let allowMapInteraction = true;

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
      router: L.Routing.graphHopper('972234b5-1b03-4502-8243-c1d6412c8b91', {
        urlParameters: {
          vehicle: 'bike'
        }
      }),
      showAlternatives: true,
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
          summary: 'inline',
          followMarker: true,
          autofitBounds: false,
          legend: false,
          waypoints: false,
          wptLabels: false,
        }).addTo(map);
      }

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

  function interpolatePoints(routeCoordinates, numPoints) {
    const interpolatedPoints = [];
    for (let i = 0; i < routeCoordinates.length - 1; i++) {
      const start = routeCoordinates[i];
      const end = routeCoordinates[i + 1];
      for (let j = 0; j <= numPoints; j++) {
        const fraction = j / numPoints;
        const lat = start.lat + fraction * (end.lat - start.lat);
        const lng = start.lng + fraction * (end.lng - start.lng);
        interpolatedPoints.push(L.latLng(lat, lng));
      }
    }
    return interpolatedPoints;
  }
</script>

<button class="text-white" on:click={exportToGPX}>Export to GPX</button>
<!-- <div class="w-full h-full" bind:this={mapElement}> -->
<div class="w-full h-full" bind:this={mapElement}>
  {#if map}
    <slot />
  {/if}
</div>

<style>
:global(.elevation-control .area) {
    fill:  #ff9f24 ;
    opacity: 1;
}
:global(.elevation-control .background) {
    background-color: rgb(38 38 38);
}
:global(.elevation-control .axis text, .elevation-control .legend text, .elevation-control .point text) {
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
:global(.height-focus-group .circle-lower .height-focus .leaflet-elevation-pane .leaflet-marker-pane){
  pointer-events: none !important;
}
:global(.leaflet-interactive) {
  opacity: 0.2;
}
:global(.leaflet-marker-icon) {
  opacity: 1 !important;
}
/* :global(.elevation-control .background) { */
:global(.leaflet-bottom) {
  /* max-height: 100px !important; */
  max-width: 40% !important;
  /* bottom: 200px; */
  /* scale: 0.60 */
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
