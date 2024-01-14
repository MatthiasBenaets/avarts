<script lang="ts">
	import { formatDate } from '$lib/utils.js';
  import { userCookie } from "$lib/stores";
	import type { Exercise } from '$lib/types';

  export let data: Exercise;
  let user = $userCookie.user;

  if (user.id != data.user) {
    window.location.href = "/";
  };
</script>


{#if user.id == data.user}
<div class="px-5 pt-5">
  <div class="flex flex-row justify-between border-b border-neutral-400 pb-5">
    <h1 class="text-3xl text-white font-semibold p-1">Edit Activity</h1>
    {#if data.name}
      <button type="submit" form="update" class="bg-orange-600 px-14 py-2 rounded-md font-semibold text-white hover:bg-orange-700">Save</button>
    {/if}
  </div>
  <div class="flex flex-row">
    <form id="update" action="?/update" method="POST" class="flex flex-row w-2/3" enctype="multipart/form-data">
      <div class="flex flex-col w-7/12 text-white">
        <p class="mt-3 font-semibold">Title</p>
        <input type="text" name="name" bind:value={data.name} class="bg-neutral-800 border border-neutral-500 rounded-md mt-2 p-1"/>
        <p class="mt-3 font-semibold">Description</p>
        <textarea name="description" value={data.description} class="bg-neutral-800 border border-neutral-500 rounded-md text-white w-full placeholder-slate-300 placeholder-opacity-50 placeholder:italic p-1 mt-2" rows="5" placeholder="Activity Notes"></textarea>
      </div>
      <div class="flex flex-col w-5/12 px-3 text-white">
        <p class="mt-3 font-semibold">Sport</p>
        <select name="sport" value={data.sport} class="bg-neutral-800 border border-neutral-500 rounded-md text-white w-full mt-2 p-1">
          <option value="cycling">Cycling</option>
          <option value="running">Running</option>
          <option value="swimming">Swimming</option>
        </select>
      </div>
    </form>
    <div class="flex flex-col w-1/3">
      <div class="flex flex-col bg-neutral-800 mt-4">
        <img src="{data.image}" alt="activity thumbnail"/>
        <table class="w-full text-white">
          <tr>
            <td class="font-semibold px-5 p-1 pt-5">
              Date
            </td>
            <td class="text-sm pt-5">
              {formatDate(data.start_time)}
            </td>
          </tr>
          <tr>
            <td class="font-semibold px-5 p-1">
              Distance
            </td>
            <td>
              {data.tot_distance.toFixed(2)} km
            </td>
          </tr>
          <tr>
            <td class="font-semibold px-5 p-1">
              Time
            </td>
            <td>
              {new Date(data.elap_time * 1000).toISOString().substring(11, 19)}
            </td>
          </tr>
          <tr>
            <td class="font-semibold px-5 p-1 pb-5">
              Elevation Gain
            </td>
            <td class="pb-5">
              {data.tot_elevation * 1000} m
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</div>
{/if}
