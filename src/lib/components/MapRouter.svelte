<script lang="ts">
	import { Popup, MapEvents, Marker, GeoJSON, LineLayer } from 'svelte-maplibre';
	import maplibregl from 'maplibre-gl';
	import { env } from '$env/dynamic/public';
	import type { MapMouseEvent } from 'maplibre-gl';
	import type { FeatureCollection, LineString } from 'geojson';

	let waypoints: Array<{ lngLat: maplibregl.LngLat }> = $state([]);
	let path: FeatureCollection<LineString> = $state({
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				properties: {},
				geometry: {
					coordinates: [],
					type: 'LineString'
				}
			}
		]
	});

	async function addWaypoint(e: CustomEvent<MapMouseEvent>) {
		waypoints = [...waypoints, { lngLat: e.detail.lngLat }];
		getRoute(waypoints);
	}

	function deleteWaypoint(index: number) {
		waypoints.splice(index, 1);
		path.features[0].geometry.coordinates.splice(index, 1);
		getRoute(waypoints);
	}

	async function getRoute(coordinates: Array<{ lngLat: maplibregl.LngLat }>) {
		if (coordinates.length < 2) {
			return;
		}

		const coordString = coordinates
			.map((coord) => `${coord.lngLat.lng},${coord.lngLat.lat}`)
			.join(';');
		const url = `${env.PUBLIC_ROUTING_ENGINE}/route/v1/bike/${coordString}?overview=full&geometries=geojson`;

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (data.routes && data.routes.length > 0) {
				return (path.features[0].geometry = data.routes[0].geometry);
			} else {
				throw new Error('No routes found');
			}
		} catch (error) {
			console.error('Error fetching route:', error);
		}
	}
</script>

<MapEvents on:click={addWaypoint} />

{#each waypoints as waypoint, index}
	<Marker
		bind:lngLat={waypoint.lngLat}
		draggable
		on:dragend={() => {
			getRoute(waypoints);
		}}
		class="grid aspect-square h-4 w-4 place-items-center rounded-full border border-black bg-white text-black shadow-2xl focus:outline-2 focus:outline-black"
	>
		<span class="-mt-1 h-4 text-[8px]">{index}</span>
		<Popup offset={[0, -10]} openOn="click" closeButton closeOnClickInside>
			<button
				onclick={() => {
					deleteWaypoint(index);
				}}
			>
				Delete
			</button>
		</Popup>
	</Marker>
{/each}

<GeoJSON bind:data={path}>
	<LineLayer
		layout={{ 'line-cap': 'round', 'line-join': 'round' }}
		paint={{
			'line-width': 5,
			'line-color': '#FF9000',
			'line-opacity': 0.8
		}}
	/>
</GeoJSON>
