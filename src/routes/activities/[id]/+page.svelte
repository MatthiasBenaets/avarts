<script lang="ts">
	import { formatDate } from "$lib/utils";
	import type { Post } from "$lib/types";
	import Leaflet from "$components/leafletView.svelte";
  import { pb } from "$lib/database";
  import { userCookie } from "$lib/stores";

  let user = $userCookie.user

  export let data: Post;

  let gpx = data.url
  let confirm = false;
  const initialView = [0,0];

  async function remove() {
    await pb.collection('activities').delete(data.id);
    window.location.href="/";
  }
</script>

<div class="flex mt-5">
  <div class="w-[15%] mr-5">
    <ul class="text-white border border-neutral-500 bg-neutral-800">
      <a href="/activities/{data.id}">
        <li class="p-3 pl-5 text-xl border-b border-neutral-500 border-l-4 border-l-orange-500 hover:bg-neutral-900">
          Overview
        </li>
      </a>
      <!-- <a href="/">
        <li class="p-3 pl-5 text-xl border-b border-neutral-500 hover:bg-neutral-900">
          Analysis
        </li>
      </a>
      <a href="/">
        <li class="p-3 pl-5 text-xl hover:bg-neutral-900">
          Laps
        </li>
      </a> -->
    </ul>
    <ul class="mt-5 flex text-white border border-neutral-500 bg-neutral-800">
      <!-- <a href="/" class="w-1/2"> -->
      {#if data.expand.user.id == user.id}
        <a href="/activities/{data.id}/edit" class="w-full">
          <li class="p-3 pl-5 border-e border-neutral-500 flex items-center justify-center hover:bg-neutral-900 hover:text-orange-500">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            </div>
          </li>
        </a>
      {/if}
      <!-- <a href="/" class="w-1/2">
        <li class="p-3 pl-5 flex items-center justify-center hover:bg-neutral-900 hover:text-orange-500">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </div>
        </li>
      </a> -->
    </ul>
  </div>
  <div class="w-[85%]">
    <div class="bg-neutral-800">
      <header class="bg-neutral-900 border border-neutral-500">
        <div class="flex justify-between">
          <div class="p-3 pl-5 text-xl text-white font-semibold">
            <a href="/" class="hover:text-orange-500">
              {data.expand.user.name}
            </a>
            {#if data.sport == "cycling"}
              <span>- Ride</span>
            {:else if data.sport == "running"}
              <span>- Run</span>
            {:else if data.sport == "swimming"}
              <span>- Swim</span>
            {/if}
          </div>
          <div class="">
            <lu class="h-full flex text-white list-none">
              {#if data.expand.user.id == user.id}
                {#if confirm == false}
                  <button class="w-12 h-full border-s border-neutral-500 hover:text-orange-500 hover:bg-neutral-800" on:click={() => confirm = true}>
                    <li class="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </li>
                  </button>
                {:else}
                  <li class="flex items-center justify-center">
                    <p class="font-semibold pr-2">Delete ?
                  </li>
                  <button class="w-12 h-full border-s border-neutral-500 hover:text-orange-500 hover:bg-neutral-800" on:click={remove}>
                    <li class="flex items-center justify-center">
                      YES
                    </li>
                  </button>
                  <button class="w-12 h-full border-s border-neutral-500 hover:text-orange-500 hover:bg-neutral-800" on:click={() => confirm = false}>
                    <li class="flex items-center justify-center">
                      NO
                    </li>
                  </button>
                {/if}
              {/if}
              <!-- <button class="h-full w-12 border-s border-neutral-500 hover:text-orange-500 hover:bg-neutral-800">
                <li class="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                </li>
              </button> -->
            </lu>
          </div>
        </div>
      </header>
      <div class="flex">
        <div class="flex flex-col w-1/2 border-s border-e border-b border-neutral-500">
          <div class="flex m-5 pb-7 border-b border-neutral-500">
            <div class="w-[20%]">
              <a href="/">
                {#if data.expand.user.avatar}
                  <img src="http://127.0.0.1:8090/api/files/{data.expand.user.collectionId}/{data.expand.user.id}/{data.expand.user.avatar}" alt="avatar" class="h-24 rounded-full">
                {:else}
                  <img src="/avatar.svg" alt="avatar" class="h-24 rounded-full">
                {/if}
              </a>
            </div>
            <div class="pl-5 flex flex-col text-white w-[80%]" style="{data.description ? 'padding-top: 0.25rem;' : 'padding-top: 1.25rem;'}">
              <span>
                {formatDate(data.start_time)}
              </span>
              <span class="text-3xl font-semibold">
                {data.name}
              </span>
              <span class="pt-3 text-neutral-400">
                {data.description}
              </span>
            </div>
          </div>
          <div class="mx-5 mt-2 mb-5 flex">
            <textarea class="bg-neutral-800 border border-neutral-500 rounded-md text-white w-full placeholder-slate-300 placeholder-opacity-50 placeholder:italic" rows="1" placeholder="Activity Notes"></textarea>
            <button class="ms-2 p-1 text-white text-xs border border-neutral-500 rounded-md">Comment</button>
          </div>
        </div>
        <div class="flex flex-col w-1/2 border-e border-b border-neutral-500">
          <div class="p-5">
            <div class="pb-5">
              <ul class="flex flex-wrap text-white">
                <li class="pr-5">
                  <span class="text-3xl">{(data.tot_distance).toFixed(2)}</span><span class="text-md">km</span><br>
                  <span class="text-sm text-neutral-500">Distance</span>
                </li>
                <li class="pr-5">
                  <span class="text-3xl">{new Date(data.elap_time * 1000).toISOString().substring(11, 19)}</span><br>
                  <span class="text-sm text-neutral-500">Moving Time</span>
                </li>
                <li>
                  <span class="text-3xl">{data.tot_elevation * 1000}</span><span class="text-md">m</span><br>
                  <span class="text-sm text-neutral-500">Elevation</span>
                </li>
              </ul>
            </div>
            <div class="pb-5 border-b border-neutral-500">
              <ul class="flex flex-wrap text-white">
                <li class="pr-5">
                  {#if data.norm_power}
                    <span class="text-xl">{data.norm_power} </span><span class="text-md">w</span><br>
                    <span class="text-sm text-neutral-500">Weighted Avg<br> Power</span>
                  {/if}
                </li>
                <li>
                  {#if data.tot_calories}
                    <span class="text-xl">{data.tot_calories} </span><span class="text-md">kJ</span><br>
                    <span class="text-sm text-neutral-500">Total Work</span>
                  {/if}
                </li>
              </ul>
            </div>
          </div>
          <div class="mx-5 mb-5">
            <div class="pb-5 border-b border-neutral-500">
            <table class="w-4/5 text-white text-sm">
              <tbody>
                <tr>
                  <th></th>
                  <th class="text-start">Avg</th>
                  {#if data.max_speed || data.max_hr || data.max_cadence || data.max_power}
                    <th class="text-start">Max</th>
                  {/if}
                </tr>
                <tr>
                  <td>Speed</td>
                  {#if data.avg_speed}
                    <td>{(data.avg_speed).toFixed(2)} km/h</td>
                  {/if}
                  {#if data.max_speed}
                    <td>{(data.max_speed).toFixed(2)} km/h</td>
                  {/if}
                </tr>
                {#if data.avg_hr || data.max_hr }
                  <tr>
                    <td>Heart Rate</td>
                    <td>{data.avg_hr} bpm</td>
                    <td>{data.max_hr} bpm</td>
                  </tr>
                {/if}
                {#if data.avg_cadence || data.max_cadence}
                  <tr>
                    <td>Cadence</td>
                    <td>{data.avg_cadence}</td>
                    <td>{data.max_cadence}</td>
                  </tr>
                {/if}
                {#if data.avg_power || data.max_power}
                  <tr>
                    <td>Power</td>
                    <td>{data.avg_power} W</td>
                    <td>{data.max_power} W</td>
                  </tr>
                {/if}
                {#if data.tot_calories}
                  <tr>
                    <td>Calories</td>
                    <td>{data.tot_calories}</td>
                  </tr>
                {/if}
                <tr>
                  <td>Elapsed Time</td>
                  {#if data.tot_time}
                    <td>{new Date(data.tot_time * 1000).toISOString().substring(11, 19)}</td>
                  {:else}
                    <td>{new Date(data.elap_time * 1000).toISOString().substring(11, 19)}</td>
                  {/if}
                </tr>
              </tbody>
            </table>
            </div>
          </div>
          <div class="mx-5 mb-5 flex justify-between text-white">
            <div class="w-1/2">
              GPS
            </div>
            <div class="w-1/2">
              Bike: x
            </div>
          </div>
        </div>
      </div>
    </div>

    {#if data.gpx}
      <div class="mt-5 border border-neutral-500 bg-neutral-800">
        <div class="h-[400px] border-b border-neutral-500">
          <Leaflet view={initialView} zoom={13} gpx={gpx} from="activity"/>
        </div>
        <div class="h-[330px]">
        </div>
      </div>
    {/if}
  </div>
</div>
