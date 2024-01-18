<script lang="ts">
  import { env } from "$env/dynamic/public";
  import type { UserData, Exercises } from "$lib/types";

  export let data: UserData, records: Exercises;

  let url: string;
  if (env.PUBLIC_DB_URL) {
    url = env.PUBLIC_DB_URL
  } else {
    url = "http://127.0.0.1:8090"
  }
</script>

<div class="flex flex-col sticky top-20 left-0">
  <div class="mt-12 bg-neutral-800">
    <a href="/" class="pointer-events-none">
      {#if data.user.avatar}
        <img src="{url}/api/files/{data.user.collectionId}/{data.user.id}/{data.user.avatar}" alt="avatar" class="h-24 w-24 object-cover rounded-full mx-auto -m-12 pointer-events-auto">
      {:else}
        <img src="/avatar.svg" alt="avatar" class="h-24 w-24 object-cover rounded-full mx-auto -m-12 pointer-events-auto">

      {/if}
    </a>
    <h3 class="mt-16 text-2xl font-bold text-white text-center hover:text-orange-500">
      <a href="/">
        {data.user.name}
      </a>
    </h3>
    <div class="pb-4 border-b border-neutral-500">
      <ul class="flex flex-wrap mt-5">
        <a href="/" class="w-1/3 mx-auto text-center">
          <li class="flex flex-col border-e border-neutral-500 group">
            <span class="text-neutral-500">Following</span>
            <span class="text-xl text-white group-hover:text-orange-500">
              0
            </span>
          </li>
        </a>

        <a href="/" class=" w-1/3 mx-auto text-center">
          <li class="flex flex-col border-e border-neutral-500 group">
            <span class="text-neutral-500">Followers</span>
            <span class="text-xl text-white group-hover:text-orange-500">
              0
            </span>
          </li>
        </a>

        <a href="/" class="w-1/3 mx-auto text-center">
          <li class="flex flex-col group">
            <span class="text-neutral-500">Activities</span>
            <span class="text-xl text-white group-hover:text-orange-500">
                {records.length}
            </span>
          </li>
        </a>
      </ul>
    </div>
    <div class="flex flex-col mt-8 px-4 text-white">
      <span class="mb-2 text-sm">Latest activity</span>
      <div class="pb-5 border-b border-neutral-500">
        {#if records.length > 0}
          <span class="text-md font-semibold hover:text-orange-500"><a href="/activities/{records[0].id}">{records[0].name} <span class="text-sm font-normal">- {new Date(records[0].start_time).toISOString().split('T')[0]}</span></a></span>
        {/if}
      </div>
    </div>
    <div class="my-4 px-4">
      <a href="/routes" class="flex justify-between group">
        <span class="text-white group-hover:text-orange-500">
          Your Routes
        </span>
        <svg class="text-white group-hover:text-orange-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </a>
    </div>
  </div>
</div>
