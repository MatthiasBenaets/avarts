<script lang="ts">
  // export let data;
  let showMenu = false;

  function toggleNavbar() {
    showMenu = !showMenu;
  };
</script>

<nav class="max-w-screen-xl h-12 mx-auto md:flex md:justify-between">
  <div class="flex">
    <div class="flex items-center border-neutral-500 border-e-2 h-full">
      <a href="/">
        <h1 class="px-2 text-orange-600 uppercase font-extrabold text-2xl">Avarts</h1>
      </a>
      <button class="pr-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="p-2 text-neutral-500 hover:text-neutral-200"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>
    </div>
    <div class="flex items-center pl-4 pr-2 border-neutral-500 border-e-2 h-full">
      <a href="/" class="flex items-center group">
        <p class="text-white group-hover:text-orange-500 pr-2 transition-colors duration-300">Dashboard</p>
        <svg class="text-neutral-500 group-hover:text-orange-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </a>
    </div>
    <div class="flex items-center pl-4 pr-2 border-neutral-500 border-e-2 h-full">
      <a href="/upload" class="flex items-center group">
        <p class="text-white group-hover:text-orange-500 pr-2 transition-colors duration-300">Upload</p>
        <svg class="text-neutral-500 group-hover:text-orange-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </a>
    </div>
    <div class="flex items-center pl-4 pr-2 border-neutral-500 border-e-2 h-full">
      <a href="/routes/new" class="flex items-center group">
        <p class="text-white group-hover:text-orange-500 pr-2 transition-colors duration-300">Create</p>
        <svg class="text-neutral-500 group-hover:text-orange-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </a>
    </div>
    <!-- <div class="flex items-center pl-4 pr-2 h-full">
      <a href="/" class="flex items-center group">
        <p class="text-white group-hover:text-orange-500 pr-2 transition-colors duration-300">Challenges</p>
        <svg class="text-neutral-500 group-hover:text-orange-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </a>
    </div> -->
  </div>
  <div class="flex">
    <div class="flex items-center pr-4 border-neutral-500 border-e-2 h-full group">
      <a href="/">
        <svg class="text-neutral-500 hover:text-orange-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
      </a>
    </div>
    <div class="flex items-center pl-4 pr-2 border-neutral-500 border-e-2 h-full group">
      <img src="https://matthias.benaets.com/avatar.webp" alt="avatar" class="h-8 mr-2 rounded-full overflow-hidden">
      <svg class="text-neutral-500 hover:text-orange-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
    </div>
    <div class="flex items-center px-3 border-neutral-500 border-e-2 h-full group">
      <a href="/upload">
        <svg class="text-orange-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
      </a>
    </div>
    <form action="/logout" method="POST" class="flex pl-4">
      <button type="submit" class="text-white hover:text-orange-500">Logout</button>
    </form>
  </div>
</nav>
