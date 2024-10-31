<script>
  import TriangleAlert from "lucide-svelte/icons/triangle-alert";
  import ChevronsUp from "lucide-svelte/icons/chevrons-up";

  let limitActive = false;
  let limit_data = false;

  function toggleLimitActive() {
    limitActive = !limitActive;
  }
</script>

<div class="my-4">
  <button
    class="text-white inline-flex items-center p-2 bg-teal-500 rounded-t-lg cursor-pointer text-xs sm:text-sm"
    on:click={toggleLimitActive}
  >
    <TriangleAlert
      size={16}
      strokeWidth={3}
      class="mr-2 text-yellow-300 font-bold"
    />
    <p>ToggleMenu_1</p>
    <div class={`rotate-animation ml-2 ${limitActive ? "rotate-180" : ""}`}>
      <ChevronsUp size={16} strokeWidth={3} />
    </div>
  </button>
  <!-- limitNumber container -->
  <div class={`expand-collapse ${limitActive ? "expanded" : "collapsed"}`}>
    <div class="grid grid-cols-3 sm:grid-cols-9 bg-teal-100 rounded-tr-lg">
      <div class="col-span-1 text-teal-700 p-2 text-center text-xs sm:text-sm">
        Type
      </div>
      <div
        class="col-span-1 sm:col-span-4 text-teal-700 p-2 text-center text-xs sm:text-sm"
      >
        Numb
      </div>
      <div
        class="col-span-1 sm:col-span-4 text-teal-700 p-2 text-center text-xs sm:text-sm"
      >
        Numb
      </div>
    </div>
    <div class="border rounded-b-lg">
      {#if limit_data}
        <div class="grid grid-cols-3 sm:grid-cols-9">
          <div class="col-span-1 p-2 text-center text-xs sm:text-sm">Type</div>
          <div
            class="col-span-1 sm:col-span-4 p-2 text-center text-xs sm:text-sm"
          >
            Numb
          </div>
          <div
            class="col-span-1 sm:col-span-4 p-2 text-center text-xs sm:text-sm"
          >
            Numb
          </div>
        </div>
      {:else}
        <div class="p-2 text-center text-xs sm:text-sm">ไม่พบข้อมูล</div>
      {/if}
    </div>
  </div>
</div>

<style>
  .rotate-animation {
    transition: transform 0.3s ease-in-out;
  }

  .expand-collapse {
    overflow: hidden;
    transition: max-height 0.3s;
  }

  .expanded {
    max-height: 100vh;
  }

  .collapsed {
    max-height: 0;
  }
</style>
