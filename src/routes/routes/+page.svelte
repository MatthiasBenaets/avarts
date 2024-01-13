<script lang="ts">
	import { onMount } from "svelte";
  import { pb } from '$lib/database';

  export let data;
  let ready;
  let routes = [];

  onMount(async () => {
    if (data.user) {
      // get all activities for feed
      routes = await pb.collection('routes').getFullList(
        { sort: '-created'},
        { filter: `user = "${data.user.id}"`, expand: "user" },
      )
    }
    ready = true;
  });
</script>


<div class="px-5 py-5">
  <h1 class="text-3xl text-white font-semibold">My Routes</h1>
  <a href="/routes/new">
    <button class="bg-orange-600 text-white px-5 p-2 rounded-md mt-5 mb-3 hover:bg-orange-700">Create New Route</button>
  </a>
</div>

{#each routes as route, index}
  {#if index % 4 === 0}
    <div class="flex flex-row w-full">
      {#each routes.slice(index, index + 4) as { title, distance, elevation, time, updated, sport, collectionId, id, img, gpx }}
        <div class="w-[23.5%] flex flex-col bg-neutral-800 border border-neutral-400 mb-5 ml-5">
          <div class="h-[200px] bg-neutral-600 overflow-hidden">
            <a href="/routes/{id}">
              <img class="h-full w-full object-cover" src='http://127.0.0.1:8090/api/files/{collectionId}/{id}/{img}' alt="route">
            </a>
          </div>
          <div class="text-xs p-5 w-full flex flex-row justify-between">
            <span class="text-neutral-400">{updated.split(' ')[0]}</span>
            <div class="flex flex-row">
              <button class="ml-2 text-white">
                <a href="/routes/{id}/edit">
                  <svg class="hover:text-orange-600" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </a>
              </button>
              <button class="ml-2 text-white">
                <a href="http://127.0.0.1:8090/api/files/{collectionId}/{id}/{gpx}">
                  <svg class="hover:text-orange-600" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                </a>
              </button>
            </div>
          </div>
          <div class="text-lg font-semibold pl-5">
            <a href="/routes/{id}">
              <span class="text-white hover:text-orange-600">{title}</span>
            </a>
          </div>
          <div class="flex flex-row text-neutral-400 p-5">
            <div class="flex flex-row w-1/3">
              {#if sport == "cycling"}
                <svg class="mt-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
              {:else if sport == "running"}
                <svg class="mt-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg>
              {:else if sport == "swimming"}
                <svg class="mt-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>
              {/if}
              <span class="mt-1 pl-2 text-xs">{(distance / 1000).toFixed(2)} km</span>
            </div>
            <div class="flex flex-row w-1/3">
              <svg class="mt-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span class="mt-1 pl-2 text-xs">{(time / 60).toFixed(0)} min</span>
            </div>
            <div class="flex flex-row w-1/3">
              <svg class="mt-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/><path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"/></svg>
              <!-- 0.6 because of free elevation api not being very accurate -->
              <span class="mt-1 pl-2 text-xs">{(elevation * 0.6).toFixed(0)} m</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
{/each}
