<script lang="ts">
	import { Control, ControlGroup } from 'svelte-maplibre';
	import type { StyleSpecification } from '@maplibre/maplibre-gl-style-spec';
	import Tiles from '$lib/data/mapTiles.json';

	let { style = $bindable() }: { style: StyleSpecification } = $props();
</script>

<Control class="flex w-full flex-col gap-y-2">
	<ControlGroup>
		<select bind:value={style} class="w-full bg-transparent p-1 px-2">
			{#each Object.entries(Tiles) as [key, test]}
				<option value={test}>{key}</option>
			{/each}
		</select>
	</ControlGroup>
</Control>

<style>
	:global(.maplibregl-ctrl-group button) {
		width: 100%;
	}
</style>
