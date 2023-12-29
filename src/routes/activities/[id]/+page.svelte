<script lang="ts">
	import { formatDate } from "$lib/utils";
	import type { Post } from "$lib/types";
	import Leaflet from "$components/leaflet.svelte";

  export let data: Post;

  // const inititialView = [50.87, 5.26];
</script>

<div class="flex mt-5">
  <div class="w-[15%] mr-5">
    <ul class="text-white border border-neutral-500 bg-neutral-800">
      <a href="/activities/[id]}">
        <li class="p-3 pl-5 text-xl border-b border-neutral-500 border-l-4 border-l-orange-500 hover:bg-neutral-900">
          Overview
        </li>
      </a>
      <a href="/">
        <li class="p-3 pl-5 text-xl border-b border-neutral-500 hover:bg-neutral-900">
          Analysis
        </li>
      </a>
      <a href="/">
        <li class="p-3 pl-5 text-xl hover:bg-neutral-900">
          Laps
        </li>
      </a>
    </ul>
    <ul class="mt-5 flex text-white border border-neutral-500 bg-neutral-800">
      <a href="/" class="w-1/2">
        <li class="p-3 pl-5 border-e border-neutral-500 flex items-center justify-center hover:bg-neutral-900 hover:text-orange-500">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </div>
        </li>
      </a>
      <a href="/" class="w-1/2">
        <li class="p-3 pl-5 flex items-center justify-center hover:bg-neutral-900 hover:text-orange-500">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </div>
        </li>
      </a>
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
            <span>- Ride</span>
          </div>
          <div class="">
            <lu class="h-full flex text-white list-none">
              <button class="w-12 h-full border-s border-neutral-500 hover:text-orange-500 hover:bg-neutral-800">
                <li class="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </li>
              </button>
              <button class="h-full w-12 border-s border-neutral-500 hover:text-orange-500 hover:bg-neutral-800">
                <li class="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                </li>
              </button>
            </lu>
          </div>
        </div>
      </header>
      <div class="flex">
        <div class="flex flex-col w-1/2 border-s border-e border-b border-neutral-500">
          <div class="flex m-5 pb-7 border-b border-neutral-500">
            <div class="">
              <a href="/">
                <img src="https://matthias.benaets.com/avatar.webp" alt="avatar" class="h-24 rounded-full">
              </a>
            </div>
            <div class="p-5 flex flex-col text-white">
              <span>
                {formatDate(data.date)}
              </span>
              <span class="text-3xl font-semibold">
                {data.name}
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
                  <span class="text-3xl">80.45 </span><span class="text-md">km</span><br>
                  <span class="text-sm text-neutral-500">Distance</span>
                </li>
                <li class="pr-5">
                  <span class="text-3xl">2:02:12 </span><span class="text-md">km</span><br>
                  <span class="text-sm text-neutral-500">Moving Time</span>
                </li>
                <li>
                  <span class="text-3xl">344 </span><span class="text-md">m</span><br>
                  <span class="text-sm text-neutral-500">Elevation</span>
                </li>
              </ul>
            </div>
            <div class="pb-5 border-b border-neutral-500">
              <ul class="flex flex-wrap text-white">
                <li class="pr-5">
                  <span class="text-xl">197 </span><span class="text-md">w</span><br>
                  <span class="text-sm text-neutral-500">Weighted Avg<br> Power</span>
                </li>
                <li>
                  <span class="text-xl">1391 </span><span class="text-md">kJ</span><br>
                  <span class="text-sm text-neutral-500">Total Work</span>
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
                  <th class="text-start">Max</th>
                </tr>
                <tr>
                  <td>Speed</td>
                  <td>39.5 km/h</td>
                  <td>60.9 km/h</td>
                </tr>
                <tr>
                  <td>Heart Rate</td>
                  <td>152 bpm</td>
                  <td>192 bpm</td>
                </tr>
                <tr>
                  <td>Cadence</td>
                  <td>77</td>
                  <td>96</td>
                </tr>
                <tr>
                  <td>Power</td>
                  <td>190 W</td>
                  <td>462 W</td>
                </tr>
                <tr>
                  <td>Calories</td>
                  <td>1355</td>
                </tr>
                <tr>
                  <td>Elapsed Time</td>
                  <td>2:02:12</td>
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

    <div class="mt-5 border border-neutral-500 bg-neutral-800">
      <div class="h-[400px] border-b border-neutral-500">
        <!-- <Leaflet view={inititialView} zoom={13}/> -->
        <Leaflet zoom={13}/>
      </div>
      <div class="h-[200px]">
      </div>
    </div>
  </div>
</div>
