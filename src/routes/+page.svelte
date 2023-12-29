<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from '$lib/database';
  import Profile from '$components/profile.svelte'
  import Activity from '$components/activity.svelte'
  import Statistics from '$components/statistics.svelte'
  import type { Post } from '$lib/types';

  let records: Post[] = [];
  let ready: boolean

  onMount(async () => {
    ready = true
    records = await pb.collection('activities').getFullList({sort:'-date'})
  })
</script>

<div class="flex mx-auto">
  <div class="w-1/4 m-5">
    <Profile />
  </div>
  <div class="flex flex-col w-1/2 mt-8">
    {#if ready}
      {#each records as { date, name, id }}
        <Activity date={date}
                  name={name}
                  id={id} />
      {/each}
    {/if}
  </div>
  <div class="w-1/4 m-5">
    <Statistics />
  </div>
</div>

<style>
</style>
