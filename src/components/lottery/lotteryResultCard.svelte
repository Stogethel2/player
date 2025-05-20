<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { AlarmClock } from "lucide-svelte";
  import type { LotteryResultData } from "$lib/interface/result.types";
  import { getResultsByType, getBackgroundColorClass, formatLotteryDate } from "$lib/utils/lottery-result.utils";


  export let resultData: LotteryResultData;
  export let index: number = 0;
</script>

{#if resultData}
  {@const resultsByType = getResultsByType(resultData.results)}
  {@const bgColorClass = getBackgroundColorClass(resultData.round.lotto_name)}
  <div
    in:fly={{ y: 20, duration: 300, delay: index * 100 }}
    out:fade={{ duration: 200 }}
    class="card w-full overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg mb-4"
  >
    <div class="{bgColorClass} rounded-t-xl relative p-4">
      <div class="relative z-10 flex items-center justify-between">
        <div class="flex items-center flex-grow">
          <h3 class="text-sm sm:text-base font-bold text-white truncate mr-2">
            {resultData.round.lotto_name}
          </h3>
        </div>
        <div
          class="flex items-center text-xs sm:text-sm text-white bg-black bg-opacity-20 rounded-full px-2 py-1 whitespace-nowrap"
        >
          <AlarmClock size={14} class="mr-1 flex-shrink-0" />
          <span class="truncate">{formatLotteryDate(resultData.round.round_date)}</span>
        </div>
      </div>
    </div>
    <div class="px-2 md:px-4 py-2 bg-white">
      <div class="grid grid-cols-2 gap-4">
        {#if resultsByType.three_top}
          <div class="col-span-2 bg-red-100 p-3 rounded-lg">
            <p class="text-sm font-medium text-black">3 ตัวบน</p>
            <p class="text-3xl font-bold text-red-600">
              {resultsByType.three_top}
            </p>
          </div>
        {/if}

        {#if resultsByType.three_bottom}
          <div class="bg-red-50 p-3 rounded-lg">
            <p class="text-sm font-medium text-black">3 ตัวล่าง</p>
            <p class="text-2xl font-bold text-red-600">
              {resultsByType.three_bottom}
            </p>
          </div>
        {/if}

        {#if resultsByType.two_top}
          <div class="bg-red-50 p-3 rounded-lg">
            <p class="text-sm font-medium text-black">2 ตัวบน</p>
            <p class="text-2xl font-bold text-red-600">
              {resultsByType.two_top}
            </p>
          </div>
        {/if}

        {#if resultsByType.two_bottom}
          <div class="bg-red-50 p-3 rounded-lg">
            <p class="text-sm font-medium text-black">2 ตัวล่าง</p>
            <p class="text-2xl font-bold text-red-600">
              {resultsByType.two_bottom}
            </p>
          </div>
        {/if}

        {#if resultsByType.tod}
          <div class="bg-red-50 p-3 rounded-lg">
            <p class="text-sm font-medium text-black">3 ตัวโต๊ด</p>
            <p class="text-2xl font-bold text-red-600">
              {resultsByType.tod}
            </p>
          </div>
        {/if}

        {#if resultsByType.run_top}
          <div class="bg-red-50 p-3 rounded-lg">
            <p class="text-sm font-medium text-black">วิ่งบน</p>
            <p class="text-2xl font-bold text-red-600">
              {resultsByType.run_top}
            </p>
          </div>
        {/if}

        {#if resultsByType.run_bottom}
          <div class="bg-red-50 p-3 rounded-lg">
            <p class="text-sm font-medium text-black">วิ่งล่าง</p>
            <p class="text-2xl font-bold text-red-600">
              {resultsByType.run_bottom}
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  .card {
    @apply bg-white rounded-xl shadow-md;
  }
  .truncate {
    @apply overflow-hidden text-ellipsis;
  }
</style> 