<script lang="ts">
  import { onMount, onDestroy, setContext, createEventDispatcher, tick } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  import '@raruto/leaflet-elevation/src/index.js';
  import '@raruto/leaflet-elevation/src/index.css';

  export let bounds: L.LatLngBoundsExpression | undefined = undefined;
  export let view: L.LatLngExpression | undefined = undefined;
  export let zoom: number | undefined = undefined;
  export let gpx, from: string;

  const dispatch = createEventDispatcher();

  let map: L.Map | undefined;
  let mapElement: HTMLElement;

  let route
  let elevationControl: any;

  onMount(() => {
    if (!bounds && (!view || !zoom)) {
      throw new Error('Must set either bounds, or view and zoom.');
    }

    map = L.map(mapElement)
      .on('zoom', (e: MouseEvent) => dispatch('zoom', e))
      .on('popupopen', async (e) => {
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
      }).addTo(map);
    } else if (from =="activity") {
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

  });

  $: if (gpx) {
    if (from == "upload") {
      elevationControl.load(gpx);
    } else if (from == "activity") {
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
</script>

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
/* :global(.height-focus-group .circle-lower .height-focus .leaflet-elevation-pane .leaflet-marker-pane){ */
/*   pointer-events: none !important; */
/* } */
:global(.leaflet-interactive) {
  opacity: 0.2;
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
:global(.leaflet-routing-container .leaflet-marker-icon){
  display: none !important;
  opacity: 0 !important;
}
</style>
