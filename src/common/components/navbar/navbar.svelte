<script lang="ts">
  import CoreNavbar from "./coreNavbar.svelte";
  import Navigation from "../../../routes/navigation.svelte";
  export let name = "088-888-8888";
  export let credits = 10;
  export let currency = "THB";
</script>

<div class="sticky w-full navbar">
  <Navigation />
  <div
    class="w-full"
    style="background: linear-gradient(to top, #dab768, #a77338, #fef7b2, #dab768, #a77338);"
  >
    <div>
      <CoreNavbar {name} {credits} {currency} />
    </div>
  </div>
</div>

<style>
  .navbar {
    z-index: 9999;
  }
</style>
