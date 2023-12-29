<script lang="ts">
	import Leaflet from "$components/leaflet.svelte";
	import { onMount } from "svelte";

  let latitude = 40.71;
  let longitude = -74;
  let inititialView = [latitude, longitude];
  let error = null;

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          error = null;
        },
        (err) => {
          error = `Error: ${err.message}`;
        }
      );
    } else {
      error = "Geolocation is not supported by this browser.";
    }
  };

  onMount(() => {
    getLocation();
  })

  $: inititialView = [latitude, longitude];
</script>

<!-- <div class="absolute h-[94.5%] w-screen left-0"> -->
<div class="absolute h-[90%] w-screen left-0">
  <Leaflet view={inititialView} zoom={13}/>
</div>
