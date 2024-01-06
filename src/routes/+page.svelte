<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import { pb } from '$lib/database';
  import Profile from '$components/profile.svelte'
  import Activity from '$components/activity.svelte'
  import Statistics from '$components/statistics.svelte'
  import type { Post } from '$lib/types';

  export let data;
  let records: Post[] = [];
  let ready: boolean
  let loadingMore: boolean = false;
  let page: number = 0;
  const itemsPerPage: number = 5; // Number of activities loaded

  let register = false;
  function ifRegister(){
    if (register == false) {
      register = true;
    } else {
      register = false;
    }
  }

  let month;
  let year;
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear()
  currentDate.setDate(currentDate.getDate() - 28);
  let formattedDate = currentDate.toISOString().split('T')[0];

  // incrementally load activities
  async function loadMoreActivities() {
    if (!loadingMore) {
      loadingMore = true;
      page += 1;

      const newActivities = await pb.collection('activities').getList(page, itemsPerPage, { filter: `user = "${data.user.id}"`, expand: 'user', sort: '-start_time'});

      records = [...records, ...newActivities.items];

      loadingMore = false;
    }
  }

  onMount(async () => {
    if (data.user) {
      // load initial 5 posts
      await loadMoreActivities();

      // get activities of last 4 weeks
      month = await pb.collection('activities').getFullList({ sort: '-start_time', filter: `start_time > "${formattedDate}"`});

      // get activities from current year
      year = await pb.collection('activities').getFullList({ sort: '-start_time', filter: `start_time >= "${currentYear}-01-01"`});
    }
    ready = true
  })

  // incrementally load activities
  afterUpdate(() => {
    const scrollHandler = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        loadMoreActivities();
      }
    };

    window.addEventListener('scroll', scrollHandler);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  });
</script>

{#if data.user}
  <div class="flex">
    {#if ready}
      <div class="w-1/4 m-5">
        <Profile data={data} records={records} />
      </div>
      <div class="flex flex-col w-1/2 mt-8">
        {#if records.length > 0}
          {#each records as { start_time, name, id, tot_distance, sport, avg_speed, tot_elevation, elap_time, collectionId, img, expand, location }}
            <Activity date={start_time}
                      name={name}
                      id={id}
                      distance={tot_distance}
                      speed={avg_speed}
                      elevation={tot_elevation}
                      time={elap_time}
                      collectionId={collectionId}
                      img={img}
                      sport={sport}
                      user={expand.user}
                      location={location}/>
          {/each}
        {:else}
          <div class="mb-5 bg-neutral-800">
            <div class="flex flex-col m-5">
              <div class="flex">
                <h2 class="text-white text-2xl font-semibold">
                  Upload your first activity
                </h2>
              </div>
              <div class="mt-3">
                <a href="/upload">
                  <button class="p-3 bg-orange-600 text-white font-semibold rounded-md">
                    Upload activity
                  </button>
                </a>
              </div>
            </div>
          </div>
        {/if}
      </div>
        <div class="w-1/4 m-5">
          <Statistics records={records} month={month} year={year}/>
      </div>
    {/if}
  </div>
{:else}
  <div class="flex grow">
    <div class="mx-auto mt-20 h-20">
      <button on:click={ifRegister} class="mb-2 p-1 rounded-xl bg-orange-600 text-white hover:bg-orange-700 w-20">
        {#if !register}
          register
        {:else}
          login
        {/if}
      </button>
      {#if !register}
        <form action="?/login" method="POST" class="flex flex-col items-center w-full">
          <div class="w-full mb-5">
            <label for="username" class="pb-1 text-white">
              <span>username</span>
            </label>
            <input type="text" name="username" class="w-full border p-2 rounded-xl" />
          </div>
          <div class="w-full mb-5">
            <label for="password" class="pb-1 text-white">
              <span>Password</span>
            </label>
            <input type="password" name="password" class="w-full border p-2 rounded-xl" />
          </div>
          <div>
            <!-- submit the form -->
            <button type="submit" class="mx-auto p-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700">Login</button>
          </div>
        </form>
      {:else}
        <form action="?/register" method="POST" class="flex flex-col items-center w-full">
          <!-- if form exist and and email is true -->
          <div class="w-full mb-5">
            <label for="username" class="pb-1 text-white">
              <span>Username</span>
            </label>
            <input type="text" name="username" class="w-full border p-2 rounded-xl" />
          </div>
          <div class="w-full mb-5">
            <label for="name" class="pb-1 text-white">
              <span>Name</span>
            </label>
            <input type="text" name="name" class="w-full border p-2 rounded-xl" />
          </div>
          <div class="w-full mb-5">
            <label for="password" class="pb-1 text-white">
              <span>Password</span>
              </label>
              <input type="password" name="password" class="w-full border p-2 rounded-xl" />
            </div>
            <div class="w-full mb-5">
              <label for="password" class="pb-1 text-white">
                <span>Verify Password</span>
              </label>
              <input type="password" name="passwordConfirm" class="w-full border p-2 rounded-xl" />
            </div>
            <div>
              <!-- submit the form -->
              <button type="submit" class="mx-auto p-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700">Register</button>
            </div>
          </form>
        {/if}
    </div>
  </div>
{/if}

<style>
</style>
