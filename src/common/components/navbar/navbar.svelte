<script lang="ts">
  import CoreNavbar from "./coreNavbar.svelte";
  import Navigation from "../../../routes/navigation.svelte";
  export let name = "088-888-8888";
  export let credits = 10;
  export let currency = "THB";
</script>

<div class="sticky w-full navbar">
  <Navigation />
  <div class="bg-gradient-to-r from-red-700 to-red-900 w-full">
    <div class="">
      <CoreNavbar {name} {credits} {currency} />
    </div>
  </div>
</div>

<style>
  .navbar {
    z-index: 9999;
  }
</style>
