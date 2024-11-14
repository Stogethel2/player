<script lang="ts">
    import OptionNavbar from "./option_navbar.svelte";
    import CoreNavbar from "./core_navbar.svelte";
    export let name = "088-888-8888"
    let credits = 10
</script>

<div class="sticky w-full navbar">
    <div class="bg-white shadow-md w-full">
        <div class="">
            <OptionNavbar />
        </div>
    </div>
    <div class="bg-gradient-to-r from-red-700 to-red-900 w-full">
        <div class="">
            <CoreNavbar name={name} credits={credits} />
        </div>
    </div>
</div>

<style>
    .navbar {
      z-index: 9999;
    }
  </style>