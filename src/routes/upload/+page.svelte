<script lang="ts">
  // @ts-nocheck
  import FitParser from "fit-file-parser";
  import { formatDate, formatTime } from "$lib/utils"
	import Leaflet from "$components/leafletView.svelte";

  export let data;
  let fileContent = null;
  let parsedData = null;
  let gpx = null;
  let process = false;
  let screenshotBlob
  let leafletView
  let formData = new FormData()
  let activity = ""
  let location = ""

  const initialView = [0, 0];

  const handleFileChange = (event) => {
    process = true;
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      fileContent = new Uint8Array(reader.result);
      convertFile();
    };

    reader.readAsArrayBuffer(file);
  };

  const convertFile = () => {
    const fitParser = new FitParser({
      force: true,
      speedUnit: "km/h",
      lengthUnit: "km",
      temperatureUnit: "celcius",
      elapsedRecordField: true,
      mode: "cascade",
    });

    fitParser.parse(fileContent, (error, data) => {
      process = false;
      if (error) {
        console.error(error);
      } else {
        parsedData = data;
        gpx = generateGPX(parsedData)
      }
    });
    setTimeout(getScreen, 2000)
    setTitle()
    getLocation()
  };

  async function getLocation() {
    try {
      // 1 000 000 requests/month. Don't abuse please
      const apiUrl = `https://geocode.maps.co/reverse?lat=${parsedData.activity.sessions[0].start_position_lat}&lon=${parsedData.activity.sessions[0].start_position_long}&api_key=6595ca1312f47773878382wbie28477`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      location = `${data.address.town}, ${data.address.country}`;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  function getScreen(){
    leafletView.createScreenshot();
  }

  function setTitle(){
    let type = "";
    let date = "";
    switch (parsedData.activity.sessions[0].sport) {
      case 'cycling':
        type = "Ride"
        break;
      case 'running':
        type = "Run"
        break;
      case 'swimming':
        type = "Swim"
        break;
      default:
        break;
    }
    date = formatDate(new Date(parsedData.activity.sessions[0].start_time))
    activity = type + " - " + date;
  }

  function generateGPX(routeData) {
    const gpx = `<?xml version='1.0' encoding='UTF-8'?>
<gpx version="1.1" creator="Matthias Benaets" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>16/12</name>
    <author>
      <name>name of athlete</name>
      <link href="this is the link to the athlete" />
    </author>
    <copyright author="OpenStreetMap contributors">
     <year>2020</year>
     <license>https://www.openstreetmap.org/copyright</license>
    </copyright>
    <link href="link to router" />
  </metadata>
  <trk>
    <name>name of activity</name>
    <type>cycling</type>
    <trkseg>
      ${routeData.activity.sessions[0].laps[0].records
        .filter(coord => coord !== undefined && coord.position_lat !== undefined && coord.position_long !== undefined)
        .map((coord, index) =>`<trkpt lat="${coord.position_lat}" lon="${coord.position_long}">
        <ele>${coord.enhanced_altitude * 1000}</ele>
      </trkpt>`).join('\n')}
    </trkseg>
  </trk>
</gpx>
    `;
    return gpx;
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();

    const formElement = event.target as HTMLFormElement;
    formData = new FormData(formElement);

    formData.append('user', data.user.id)
    if (parsedData.activity.sessions[0].avg_speed != undefined) {
      formData.append('avg_speed', parsedData.activity.sessions[0].avg_speed)
    } else {
      formData.append('avg_speed', (parsedData.activity.sessions[0].enhanced_avg_speed).toFixed(2))
    }
    formData.append('avg_cadence', parsedData.activity.sessions[0].avg_cadence)
    formData.append('avg_power', parsedData.activity.sessions[0].avg_power)
    if (parsedData.activity.sessions[0].max_speed != undefined) {
      formData.append('max_speed', parsedData.activity.sessions[0].max_speed)
    } else {
      formData.append('max_speed', parsedData.activity.sessions[0].enhanced_max_speed)
    }
    formData.append('max_cadence', parsedData.activity.sessions[0].max_cadence)
    formData.append('max_power', parsedData.activity.sessions[0].max_power)
    formData.append('norm_power', parsedData.activity.sessions[0].normalized_power)
    formData.append('avg_hr', parsedData.activity.sessions[0].avg_heart_rate)
    formData.append('max_hr', parsedData.activity.sessions[0].max_heart_rate)
    formData.append('sport', parsedData.activity.sessions[0].sport)
    formData.append('tot_elevation', parsedData.activity.sessions[0].total_ascent)
    formData.append('tot_calories', parsedData.activity.sessions[0].total_calories)
    formData.append('tot_distance', parsedData.activity.sessions[0].total_distance)
    formData.append('start_time', formatTime(parsedData.activity.sessions[0].start_time))
    formData.append('elap_time', parsedData.activity.sessions[0].total_elapsed_time)
    formData.append('tot_time', parsedData.activity.sessions[0].total_timer_time)
    formData.append('tss', parsedData.activity.sessions[0].training_stress_score)
    formData.append('gpx', new Blob([gpx], { type: 'application/gpx+xml' }), 'activity.gpx')
    formData.append('img', screenshotBlob, 'activity.jpg');
    formData.append('location', location)

    // create post or if error received, show error
    let response
    try {
      response = await fetch('?/create', {
        method: 'POST',
        body: formData,
      });

      // if (response.ok) {
        // window.location.href = '/blog';
      // } else if (response.status === 400) {
        // message = true;
      // } else {
        // console.error(response);
      // };
    } catch (error) {
      return console.error(error);
    };
    let link = await response.json()
    setTimeout(() => window.location.href = `/activities/${link.data.substr(2,15)}`,500)
    // window.location.href = `/activities/${link.data.substr(2,15)}`;
  };

  const handleScreenshot = (event) => {
    screenshotBlob = event.detail;
  };
</script>

<div class="px-5 pt-5">
  <h1 class="text-5xl text-white font-semibold">Upload Your Activity</h1>
  <div class="flex flex-row">
    <div class="flex flex-col my-5 w-1/2">
      <input type="file" name="fit" form="activity" accept=".fit" on:change={handleFileChange} class="text-white"/>
      {#if process}
        <p class="text-white">Processing file, please wait...</p>
      {/if}
      {#if parsedData}
        <form id="activity" method="POST" on:submit={handleSubmit}>
          <div class="flex flex-col text-white pt-4">
            <table>
              <tr>
                <td>
                  <span>Activity Name:</span>
                </td>
                <td>
                  <input bind:value={activity} type="text" name="name" class="bg-neutral-800 border border-neutral-500 rounded-md text-white w-full placeholder-slate-300 placeholder-opacity-50 placeholder:italic" placeholder="Required" />
                </td>
              </tr>
              <tr>
                <td>
                  <span>Description:</span>
                </td>
                <td>
                  <textarea name="description" class="bg-neutral-800 border border-neutral-500 rounded-md text-white w-full placeholder-slate-300 placeholder-opacity-50 placeholder:italic" rows="1" placeholder="Activity Notes"></textarea>
                </td>
              </tr>
            </table>
          </div>
        </form>
      {/if}
    </div>
    {#if screenshotBlob}
      <div class="flex items-center justify-center w-1/2">
        <button type="submit" form="activity" class="text-xl rounded-xl bg-orange-500 text-white hover:bg-orange-600 w-1/2 h-1/2">Upload</button>
      </div>
    {/if}
  </div>
</div>

<div class="flex flex-row p-5">
  {#if parsedData}
    <div class="w-1/3">
      <table class=" text-white text-sm">
        <tr>
          <td>
            <span>Sport Type:</span>
          </td>
          <td class="pl-2">
            <span>{parsedData.activity.sessions[0].sport}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>Start Time:</span>
          </td>
          <td class="pl-2">
            <span>{formatTime(parsedData.activity.sessions[0].start_time)}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>Total Elapsed Time:</span>
          </td>
          <td class="pl-2">
            <span>{new Date(parsedData.activity.sessions[0].total_elapsed_time * 1000).toISOString().substring(11, 19)}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>Total Time:</span>
          </td>
          <td class="pl-2">
            <span>{new Date(parsedData.activity.sessions[0].total_timer_time * 1000).toISOString().substring(11, 19)}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>Total Distance:</span>
          </td>
          <td class="pl-2">
            <span>{parsedData.activity.sessions[0].total_distance.toFixed(2)} km</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>Total Ascent:</span>
          </td>
          <td class="pl-2">
            <span>{parsedData.activity.sessions[0].total_ascent * 1000} m</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>Total Calories:</span>
          </td>
          <td class="pl-2">
            <span>{parsedData.activity.sessions[0].total_calories} calories</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>Average Speed:</span>
          </td>
          <td class="pl-2">
          {#if parsedData.activity.sessions[0].avg_speed != undefined}
            <span>{parsedData.activity.sessions[0].avg_speed.toFixed(2)} km/h</span>
          {:else}
            <span>{parsedData.activity.sessions[0].enhanced_avg_speed.toFixed(2)} km/h</span>
          {/if}
          </td>
        </tr>
        <tr>
          <td>
            <span>Average Cadence:</span>
          </td>
          <td class="pl-2">
            <span>{parsedData.activity.sessions[0].avg_cadence} rpm</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>Average Heart Rate:</span>
          </td>
          <td class="pl-2">
            <span>{parsedData.activity.sessions[0].avg_heart_rate} bpm</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>Average Power:</span>
          </td>
          <td class="pl-2">
            <span>{parsedData.activity.sessions[0].avg_power} W</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>Max Speed:</span>
          </td>
          <td class="pl-2">
            {#if parsedData.activity.sessions[0].max_speed != undefined}
            <span>{parsedData.activity.sessions[0].max_speed.toFixed(2)} km/h</span>
            {:else}
              <span>{parsedData.activity.sessions[0].enhanced_max_speed.toFixed(2)} km/h</span>
            {/if}
          </td>
        </tr>
        <tr>
          <td>
            <span>Max Cadence:</span>
          </td>
          <td class="pl-2">
            <span>{parsedData.activity.sessions[0].max_cadence} rpm</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>Max Heart Rate:</span>
          </td>
          <td class="pl-2">
            <span>{parsedData.activity.sessions[0].max_heart_rate} bpm</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>Max Power:</span>
          </td>
          <td class="pl-2">
            <span>{parsedData.activity.sessions[0].max_power} W</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>Normalized Power:</span>
          </td>
          <td class="pl-2">
            <span>{parsedData.activity.sessions[0].normalized_power} W</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>TSS:</span>
          </td>
          <td class="pl-2">
            <span>{parsedData.activity.sessions[0].training_stress_score}</span>
          </td>
        </tr>
      </table>
    </div>
  {/if}
  <div class="w-2/3">
    <div class="h-[400px]" style="{parsedData ? '' : 'opacity: 0; pointer-events: none;'}">
      <Leaflet bind:this={leafletView}  view={initialView} zoom={13} gpx={gpx} from="upload" on:screenshotTaken={handleScreenshot}/>
    </div>
  </div>
</div>
<!-- <pre>{JSON.stringify(parsedData, null, 2)}</pre> -->

<style>
</style>
