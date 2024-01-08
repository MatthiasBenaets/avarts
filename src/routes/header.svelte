<script lang="ts">
  import { page } from '$app/stores';

  export let data;

  let showMenu = false;
  let currentPage;

  function toggleNavbar() {
    showMenu = !showMenu;
  };

  $: currentPage = $page.url.pathname;
</script>

<nav class="max-w-screen-xl h-12 mx-auto md:flex md:justify-between">
  <div class="flex">
    <div class="flex items-center border-neutral-500 border-e-2 h-full">
      <a href="/">
        <img class="pr-5 text-orange-600 uppercase font-extrabold text-2xl h-5" src="/avarts.svg" alt="Avarts"/>
        <!-- <img src="/avarts.svg" alt="Avarts"/> -->
        <!-- <h1 class="px-2 text-orange-600 uppercase font-extrabold text-2xl">Avarts</h1> -->
      </a>
      <!-- <button class="pr-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="p-2 text-neutral-500 hover:text-neutral-200"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button> -->
    </div>
    {#if data.user}
      <div class="flex items-center pl-4 pr-2 border-neutral-500 border-e-2 h-full {currentPage === '/' ? 'border-b-orange-600 border-b-2' : ''}">
        <a href="/" class="flex items-center group">
          <p class="text-white group-hover:text-orange-500 pr-2 transition-colors duration-300">Dashboard</p>
          <svg class="text-neutral-500 group-hover:text-orange-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </a>
      </div>
      <div class="flex items-center pl-4 pr-2 border-neutral-500 border-e-2 h-full {currentPage === '/upload' ? 'border-b-orange-600 border-b-2' : ''}">
        <a href="/upload" class="flex items-center group">
          <p class="text-white group-hover:text-orange-500 pr-2 transition-colors duration-300">Upload</p>
          <svg class="text-neutral-500 group-hover:text-orange-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </a>
      </div>
      <div class="flex items-center pl-4 pr-2 border-neutral-500 border-e-2 h-full {currentPage === '/routes/new' || currentPage === '/routes' ? 'border-b-orange-600 border-b-2' : ''}">
        <a href="/routes" class="flex items-center group">
          <p class="text-white group-hover:text-orange-500 pr-2 transition-colors duration-300">Routes</p>
          <svg class="text-neutral-500 group-hover:text-orange-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </a>
      </div>
      <!-- <div class="flex items-center pl-4 pr-2 h-full">
        <a href="/" class="flex items-center group">
          <p class="text-white group-hover:text-orange-500 pr-2 transition-colors duration-300">Challenges</p>
          <svg class="text-neutral-500 group-hover:text-orange-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </a>
      </div> -->
    {/if}
  </div>
  {#if data.user}
    <div class="flex">

      <!-- <div class="flex items-center pr-4 border-neutral-500 border-e-2 h-full">
        <a href="/">
          <svg class="text-neutral-500 hover:text-orange-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </a>
      </div> -->
      <div class="flex items-center px-3 border-neutral-500 border-e-2 h-full group">
        <a href="/upload">
          <svg class="text-orange-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
        </a>
      </div>
      <div class="border-neutral-500 border-e-2 group">
        <a href ="/athlete" class="pl-4 pr-2 flex items-center h-full">
          {#if data.user.avatar}
            <img src="http://127.0.0.1:8090/api/files/{data.user.collectionId}/{data.user.id}/{data.user.avatar}" alt="avatar" class="h-8 w-8 object-cover mr-2 rounded-full overflow-hidden">
          {:else}
            <img src="/avatar.svg" alt="avatar" class="h-8 w-8 object-cover mr-2 rounded-full overflow-hidden">
          {/if}
          <svg class="text-neutral-500 group-hover:text-orange-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </a>
      </div>
      <form action="/logout" method="POST" class="flex pl-4">
        <button type="submit" class="text-neutral-500 hover:text-orange-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"/></svg>
      </form>
    </div>
  {/if}
</nav>
