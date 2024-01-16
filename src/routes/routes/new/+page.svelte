<script lang="ts">
	import Leaflet from "$components/leafletEdit.svelte";
	import { onMount } from "svelte";
  import type { UserData } from "$lib/types";

  export let data: UserData
  let latitude: number = 40.71;
  let longitude: number = -74;
  let initialView = [latitude, longitude];
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

  $: initialView = [latitude, longitude];
</script>

<div class="absolute h-[88.5%] md:h-[94.5%] w-screen left-0">
  <Leaflet view={initialView} zoom={13} user={data.user} from="new" routeData={null}/>
</div>
