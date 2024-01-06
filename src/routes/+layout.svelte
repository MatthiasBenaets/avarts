<script lang="ts">
  import "../app.css";
  import Header from "./header.svelte";

  export let data;
</script>

<div class="min-h-screen bg-neutral-700" data-sveltekit-prefetch>
  <div class="bg-neutral-800 border-b-neutral-600 border-b-2 sticky top-0">
    <Header data={data}/>
  </div>
  <main class="max-w-screen md:max-w-7xl mx-auto">
    <slot />
  </main>
  <!-- <Footer /> -->
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&family=Sen&display=swap');
  :global(html) {
    font-family: 'Poppins', sans-serif;
    background-color:  rgb(38 38 38);
  }
  :global(::-webkit-scrollbar) {
    width: 10px;
  }
  :global(::-webkit-scrollbar-track) {
    background: #f1f1f1;
  }
  :global(::-webkit-scrollbar-thumb) {
    background: #888;
  }
  :global(::-webkit-scrollbar-thumb:hover) {
    background: #555;
  }
</style>
