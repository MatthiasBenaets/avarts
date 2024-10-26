<script lang="ts">
	import { MapLibre } from 'svelte-maplibre';
	import MapStyle from './MapStyle.svelte';
	import Tiles from '$lib/data/mapTiles.json';
	import type { StyleSpecification } from '@maplibre/maplibre-gl-style-spec';

	let style: StyleSpecification = $state(
		(Tiles as unknown as Record<string, StyleSpecification>).OpenStreetMap
	);
</script>

<MapLibre center={[50, 20]} zoom={7} class="map" standardControls {style}>
	<MapStyle bind:style />
</MapLibre>

<style>
	:global(.map) {
		height: 500px;
	}
</style>
