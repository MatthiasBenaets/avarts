<script lang="ts">

  export let records, month, year;
  let currentYear = new Date().getFullYear()

  // get record longest distance
  let maxDistanceActivity = records.reduce((max, records) => {
    return records.tot_distance > max.tot_distance ? records : max;
  }, records[0]);

  // get record with most elevation gain
  let maxElevationActivity = records.reduce((max, records) => {
    return records.tot_elevation > max.tot_elevation ? records : max;
  }, records[0]);

</script>

<div class="mt-12 bg-neutral-800 sticky top-32 left-0">
  <h3 class="pl-6 pt-8 text-xl text-white font-semibold">
    My stats
  </h3>
  <div class="px-5 pt-6 pb-3 border-b border-neutral-500 w-full">
    <ul class="flex flex-wrap text-white w-fit border bg-neutral-800 rounded-md overflow-hidden">
      <li class="p-2 border-e border-neutral-500 hover:bg-neutral-700 hover:text-orange-500">
        <button class="flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
        </button>
      </li>
      <li class="p-2 border-e border-neutral-500 hover:bg-neutral-700 hover:text-orange-500">
        <button class="flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg>
        </button>
      </li>
      <li class="p-2 hover:bg-neutral-700 hover:text-orange-500">
        <button class="flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>
        </button>
      </li>
    </ul>
  </div>
  <div class="m-2 pb-10">
    <table class="w-full text-white text-sm">
      <tbody class="leading-7">
        <tr class="border-b border-neutral-500 leading-10">
          <th class="text-start">
            Last 4 Weeks
          </th>
        </tr>
        <tr class="border-b border-neutral-500">
          <td>
            Activities / Week
          </td>
          <td>
            {month.length / 4}
          </td>
        </tr>
        <tr class="border-b border-neutral-500">
          <td>
            Avg Distance / Week
          </td>
          <td>
            {(month.reduce((sum, month) => sum + month.tot_distance, 0) / 4).toFixed(2)} km
          </td>
        </tr>
        <tr class="border-b border-neutral-500">
          <td>
            Elev Gain / Week
          </td>
          <td>
            {(month.reduce((sum, month) => sum + month.tot_elevation, 0) * 1000 / 4).toFixed(2)} m
          </td>
        </tr>
        <tr class="border-b border-neutral-500">
          <td>
            Avg Time / Week
          </td>
          <td>
            {(month.reduce((sum, month) => sum + month.tot_time, 0) / 60 / 60 / 4).toFixed(2)} h
          </td>
        </tr>
      </tbody>
      <tbody class="leading-7">
        <tr class="border-b border-neutral-500 leading-10">
          <th class="text-start">
            {currentYear}
          </th>
        </tr>
        <tr class="border-b border-neutral-500">
          <td>
            Activities
          </td>
          <td>
            {year.length}
          </td>
        </tr>
        <tr class="border-b border-neutral-500">
          <td>
            Distance
          </td>
          <td>
            {(year.reduce((sum, year) => sum + year.tot_distance, 0)).toFixed(2)} km
          </td>
        </tr>
        <tr class="border-b border-neutral-500">
          <td>
            Elev Gain
          </td>
          <td>
            {(year.reduce((sum, year) => sum + year.tot_elevation, 0) * 1000).toFixed(2)} km
          </td>
        </tr>
        <tr class="border-b border-neutral-500">
          <td>
            Time
          </td>
          <td>
            {(year.reduce((sum, year) => sum + year.tot_time, 0) / 60 / 60).toFixed(2)} h
          </td>
        </tr>
      </tbody>
      <tbody class="leading-7">
        <tr class="border-b border-neutral-500 leading-10 align-bottom">
          <th class="text-start">
            All-Time
          </th>
        </tr>
        <tr class="border-b border-neutral-500">
          <td>
            Activities
          </td>
          <td>
            {records.length}
          </td>
        </tr>
        <tr class="border-b border-neutral-500">
          <td>
            Distance
          </td>
          <td>
            {(records.reduce((sum, records) => sum + records.tot_distance, 0)).toFixed(2)} km
          </td>
        </tr>
        <tr class="border-b border-neutral-500">
          <td>
            Elev Gain
          </td>
          <td>
            {(records.reduce((sum, records) => sum + records.tot_elevation, 0) * 1000).toFixed(2)} m
          </td>
        </tr>
        <tr class="border-b border-neutral-500">
          <td>
            Time
          </td>
          <td>
            {(records.reduce((sum, records) => sum + records.tot_time, 0) / 60 / 60).toFixed(2)} h
          </td>
        </tr>
        <tr class="border-b border-neutral-500">
          <td>
            Longest Ride
          </td>
          <td>
            {maxDistanceActivity.tot_distance.toFixed(2)} km
          </td>
        </tr>
        <tr class="border-b border-neutral-500">
          <td>
            Most Elevation
          </td>
          <td>
            {(maxElevationActivity.tot_elevation * 1000)} m
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
