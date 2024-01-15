<script lang="ts">
	import { formatDate } from "$lib/utils";
  import type { User } from "$lib/types";

  export let date: Date, name: string, id: string, distance: number, speed: number, elevation: number, time: number, collectionId: string, img: string, sport: string, user: User, location: string;
</script>

<div class="mb-5 bg-neutral-800">
  <div class="flex flex-col m-5">
    <div class="flex">
      <div class="w-[15%]">
        <a href="/">
          {#if user.avatar}
            <img src="http://127.0.0.1:8090/api/files/{user.collectionId}/{user.id}/{user.avatar}" alt="avatar" class="h-16 w-16 object-cover rounded-full aspect-square">
          {:else}
            <img src="/avatar.svg" alt="avatar" class="h-16 w-16 object-cover rounded-full">
          {/if}
        </a>
      </div>
      <div class="flex flex-col text-white pt-2 md:w-[85%]">
        <span class="font-semibold hover:text-orange-500">
          <a href="/">
            {user.name}
          </a>
        </span>
        <span class="flex flex-col md:flex-row">
          <span>{formatDate(date)}</span> <span>{#if location}<span class="hidden md:inline">&nbsp· </span>{location}{/if}</span>
        </span>
      </div>
    </div>
    <div class="flex text-white mt-4">
      <div class="w-[15%]">
        {#if sport == "cycling"}
          <svg class="ml-4" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
        {:else if sport == "running"}
          <svg class="ml-4" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg>
        {:else if sport == "swimming"}
          <svg class="ml-4" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>
        {/if}
      </div>
      <div class="w-[85%]">
        <span class="text-2xl font-semibold hover:text-orange-500">
          <a href="/activities/{id}" class="break-words">
            {name}
          </a>
        </span>
      </div>
    </div>
    <div class="pb-4 w-[95%]">
      <ul class="flex flex-wrap mt-5">
        <li class="flex flex-col w-1/2 md:w-1/4 pl-4 border-e border-neutral-500">
          <span class="text-neutral-500">Distance</span>
          <span class="text-xl text-white">{distance.toFixed(2)}<span class="text-sm">&nbspkm</span></span>
        </li>
        <li class="flex flex-col w-1/2 md:w-1/4 pl-4 md:border-e md:border-neutral-500">
          <span class="text-neutral-500">Speed</span>
          <span class="text-xl text-white">{speed}<span class="text-sm">&nbspkm/h</span></span>
        </li>
        <li class="hidden md:flex flex-col w-1/4 pl-4 border-e border-neutral-500">
          <span class="text-neutral-500">Elev Gain</span>
          <span class="text-xl text-white">{elevation*1000}<span class="text-sm">m</span></span>
        </li>
        <li class="hidden md:flex flex-col w-1/4 pl-4">
          <span class="text-neutral-500">Time</span>
          <span class="text-xl text-white">{new Date(time * 1000).toISOString().substring(11, 19)}</span>
        </li>
      </ul>
    </div>
    {#if img}
      <div>
        <a href="/activities/{id}">
        <div class="h-full">
        <img src="http://127.0.0.1:8090/api/files/{collectionId}/{id}/{img}" alt="">
          <div>
        </a>
      </div>
    {/if}
  </div>
</div>
