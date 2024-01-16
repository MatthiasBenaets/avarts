<script lang="ts">
  import { onMount, onDestroy, setContext, createEventDispatcher, tick } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  import '@raruto/leaflet-elevation/src/index.js';
  import '@raruto/leaflet-elevation/src/index.css';

  import 'leaflet-simple-map-screenshoter';

  export let bounds: L.LatLngBoundsExpression | undefined = undefined;
  export let view: L.LatLngExpression | undefined = undefined;
  export let zoom: number | undefined = undefined;
  export let gpx: string , from: string;

  const dispatch = createEventDispatcher();

  let map: L.Map | undefined;
  let mapElement: HTMLElement;

  let elevationControl: L.elevationControl | undefined;

  let simpleMapScreenshoter: L.simpleMapScreenshoter | undefined;
  let screenshotOptions = {
    cropImageByInnerWH: true,
    hidden: true,
    preventDownload: true,
    hideElementsWithSelectors: ['.leaflet-control-container'],
    mimeType: 'image/png',
  }

  onMount(() => {
    if (!bounds && (!view || !zoom)) {
      throw new Error('Must set either bounds, or view and zoom.');
    }

    map = L.map(mapElement)
      .on('zoom', (e: MouseEvent) => dispatch('zoom', e))
      .on('popupopen', async (e: L.map) => {
        await tick();
        e.popup.update();
      });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    if (from == "upload") {
      elevationControl = L.control.elevation({
        srcFolder: 'http://unpkg.com/@raruto/leaflet-elevation/src/',
        detached: false,
        position: "bottomleft",
        collapsed: true,
        slope: "summary",
        altitude: true,
        time: false,
        summary: false,
        followMarker: true,
        autofitBounds: true,
        legend: false,
        waypoints: false,
        wptLabels: false,
        downloadLink: false,
        distanceMarkers: false,
        edgeScale: false,
      }).addTo(map);
    } else if (from == "activity") {
      elevationControl = L.control.elevation({
        srcFolder: 'http://unpkg.com/@raruto/leaflet-elevation/src/',
        // detached: true,
        // position: "bottomleft",
        slope: "summary",
        altitude: true,
        time: true,
        speed: true,
        summary: false,
        followMarker: true,
        autofitBounds: true,
        legend: true,
        waypoints: false,
        wptLabels: false,
        downloadLink: false,
        closeBtn: false,
      }).addTo(map);
    } else if (from == "route") {
      elevationControl = L.control.elevation({
        srcFolder: 'http://unpkg.com/@raruto/leaflet-elevation/src/',
        // detached: true,
        // position: "bottomleft",
        slope: "summary",
        altitude: true,
        time: false,
        summary: false,
        followMarker: true,
        autofitBounds: true,
        legend: false,
        waypoints: false,
        wptLabels: false,
        downloadLink: false,
        closeBtn: false,
      }).addTo(map);
    }

    simpleMapScreenshoter = L.simpleMapScreenshoter(screenshotOptions).addTo(map);

  });

  $: if (gpx) {
    if (from == "upload") {
      elevationControl.load(gpx);
    } else if (from == "activity" || from == "route") {
      onMount(() => {
        elevationControl.load(gpx);
      });
    }
  }

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

  export async function createScreenshot(){
    const format = 'blob';
    const overridedPluginOptions = {
      mimeType: 'image/png'
    };

    simpleMapScreenshoter.takeScreen(format, overridedPluginOptions).then(blob => {
      // Handle the screenshot blob here (e.g., save or display it)

      // Example: Display the screenshot in a new window/tab
      // const imageUrl = URL.createObjectURL(blob);
      // window.open(imageUrl, '_blank');
      dispatch('screenshotTaken', blob);
    }).catch(e => {
      console.error(e);
    });
  }
</script>

<div class="view w-full h-full" bind:this={mapElement}>
  {#if map}
    <slot />
  {/if}
</div>

<style>
  /* fix screenshot tailwind grid */
:global(.leaflet-tile) {
  border-style: none !important;
}
:global(.grid){
  opacity: 0;
}
:global(.elevation-control .area) {
  fill:  #ff9f24 ;
  opacity: 1;
}
:global(.elevation-control .background) {
  background-color: rgb(38 38 38);
}
:global(.view .leaflet-map-pane .leaflet-marker-pane) {
  opacity: 0;
}
:global(.tick text, .axis text) {
  font-size: 12px;
  fill: white !important;
  color: white !important;
  stroke-width: 0px !important;
}
:global(.elevation-detached.lightblue-theme .area) {
  stroke: orange;
  stroke-width: 3px;
}
:global(.leaflet-bottom) {
  max-width: 40% !important;
}
:global(.background) {
  height: 100%;
}
</style>
