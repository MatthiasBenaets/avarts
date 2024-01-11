<script lang="ts">
  import { pb } from '$lib/database';
	import Leaflet from "$components/leafletView.svelte";
  import { userCookie } from "$lib/stores";

  export let data;
  let remove = false;
  let user = $userCookie.user
  let gpx = `http://127.0.0.1:8090/api/files/${data.collectionId}/${data.id}/${data.gpx}`
  const initialView = [0,0];

  if (user.id != data.user) {
    window.location.href = "/";
  };

  async function deleteRoute(route) {
    await pb.collection('routes').delete(route);
    window.location.href="/routes";
  }
</script>

{#if user.id == data.user}
<div class="flex flex-row text-white mt-5 ml-10">
  <a href="/routes" class="flex flex-row text-orange-600 hover:text-orange-700">
    <svg class="mt-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
    <span class="mr-1">
      My routes
    </span>
  </a>
  <span>
    / {data.title}
  <span/>
  </span>
</div>

<div class="flex flex-row mt-10 ml-10">
  <div class="flex flex-col w-1/4">
    <div class="flex flex-row justify-between">
      <div>
        <h1 class="text-3xl font-semibold text-white capitalize">
          {data.title}
        </h1>
      </div>
      <div>
        {#if remove == false}
        <button on:click={() => remove = true} class="text-neutral-400 hover:text-orange-600">
          <svg class="mt-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
        {:else}
          <div class="flex flex-col pt-1">
            <button on:click={deleteRoute(data.id)} class="text-xs text-neutral-400 border-b border-neutral-400 hover:text-orange-600">YES</button>
            <button on:click={() => remove = false} class="text-xs text-neutral-400 hover:text-orange-600">NO</button>
          </div>
        {/if}
      </div>
    </div>
    <div class="mb-5 mt-3 text-xl text-neutral-400">
      <span class="capitalize">{data.sport}</span>
      <span>Route</span>
    </div>
    <div class="flex flex-row mb-6">
      <a href="http://127.0.0.1:8090/api/files/{data.collectionId}/{data.id}/{data.gpx}" class="bg-orange-600 rounded-md text-neutral-200 hover:bg-orange-700 w-1/2 p-2 mr-1 text-sm">
        <button class="h-full w-full">
          Download Route
        </button>
      </a>
      <a href="/routes/{data.id}/edit" class="bg-neutral-700 rounded-md text-neutral-200 hover:bg-neutral-600 w-1/2 p-2 ml-1 text-sm border border-neutral-400">
        <button class="h-full w-full">
          Edit
        </button>
      </a>
    </div>
    <div class="border-b border-neutral-500 pb-5">
      <table class="w-full table-fixed text-lg text-white">
        <tr>
          <td>
            <div class="mr-3 border-t border-neutral-500 flex flex-row py-2">
              <svg class="mt-1 mr-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              {(data.distance / 1000).toFixed(2)} km
            </div>
          </td>
          <td>
            <div class="border-t border-neutral-500 flex flex-row py-2">
              <!-- 0.6 because of free elevation api not being very accurate -->
              <svg class="mt-1 mr-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/><path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"/></svg>
              {(data.elevation * 0.6).toFixed(2)} m

            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="mr-3 border-t border-neutral-500 flex flex-row py-2">
              <!-- slow estimated time, this make it ~30km/h -->
              <svg class="mt-1 mr-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {(data.time / 60 / 1.7).toFixed(2)} min.
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="flex flex-col text-white">
      <div class="uppercase text-xs pt-2">
        CREATED BY
      </div>
      <div class="flex flex-row justify-between">
        <div class="flex flex-col pt-2">
          <span>{data.expand.user.name}</span>
          <span class="text-neutral-400">{data.created.split(" ")[0]}</span>
        </div>
        <div>
          {#if data.expand.user.avatar}
            <img class="w-16 h-16 rounded-full object-cover" src="http://127.0.0.1:8090/api/files/{data.expand.user.collectionId}/{data.expand.user.id}/{data.expand.user.avatar}" alt="avatar"/>
          {:else}
            <img class="w-16 h-16 rounded-full object-cover" src="/avatar.svg" alt="avatar"/>

          {/if}
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-col w-3/4 ml-20">
    <div class="">
      <h1 class="text-2xl text-white mb-3">
        Route and Elevation
      </h1>
    </div>
    <div class="w-full h-[450px]">
      <Leaflet view={initialView} zoom={13} gpx={gpx} from="route"/>
    </div>
  </div>
</div>
{/if}

<style>
:global(.background){
  background-color: rgb(50 50 50) !important;
  transform: scaleY(0.8);
  margin-top: -2rem;
}
</style>
