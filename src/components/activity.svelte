<script lang="ts">
	import { formatDate } from "$lib/utils";

  export let date: string, name: string, id: string, distance: string, speed: string, elevation: string, time: string;
</script>

<div class="mb-5 bg-neutral-800">
  <div class="flex flex-col m-5">
    <div class="flex">
      <div class="w-[15%]">
        <a href="/">
          <img src="https://matthias.benaets.com/avatar.webp" alt="avatar" class="h-16 rounded-full">
        </a>
      </div>
      <div class="flex flex-col text-white pt-2">
        <span class="font-semibold hover:text-orange-500">
          <a href="/">
            Matthias Benaets
          </a>
        </span>
        <span>{formatDate(date)} · Alken, Belgium</span>
      </div>
    </div>
    <div class="flex text-white mt-4">
      <div class="w-[15%]">
        <svg class="ml-4" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
      </div>
      <div class="">
        <span class="text-2xl font-semibold hover:text-orange-500">
          <a href="/activities/{id}">
            {name}
          </a>
        </span>
      </div>
    </div>
    <div class="pb-4 w-[88%]">
      <ul class="flex flex-wrap mt-5">
        <li class="flex flex-col w-1/4 pl-4 border-e border-neutral-500">
          <span class="text-neutral-500">Distance</span>
          <span class="text-xl text-white">{distance}<span>&nbspkm</span></span>
        </li>
        <li class="flex flex-col w-1/4 pl-4 border-e border-neutral-500">
          <span class="text-neutral-500">Speed</span>
          <span class="text-xl text-white">{speed}<span>&nbspkm/h</span></span>
        </li>
        <li class="flex flex-col w-1/4 pl-4 border-e border-neutral-500">
          <span class="text-neutral-500">Elev Gain</span>
          <span class="text-xl text-white">{elevation}<span>m</span></span>
        </li>
        <li class="flex flex-col w-1/4 pl-4">
          <span class="text-neutral-500">Time</span>
          <span class="text-xl text-white">{time}</span>
        </li>
      </ul>
    </div>
    <div class="h-[300px] bg-green-700">
      <a href="/">
        <div class="h-full">
        <div>
      </a>
    </div>
  </div>
</div>
