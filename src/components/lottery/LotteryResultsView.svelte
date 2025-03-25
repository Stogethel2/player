<script lang="ts">
  import { onMount } from "svelte";
  import type { LotteryResultData } from "$lib/interface/result.types";
  import { resultApi } from "$lib/api/endpoint/result";
  import LotteryResultCard from "./LotteryResultCard.svelte";

  export let showDatePicker: boolean = true;
  export let title: string = "ผลสลากกินแบ่ง";
  export let customFetchFunction: Function | null = null;

  let results: LotteryResultData[] = [];
  let isLoading = true;
  let error: string | null = null;
  let selectedDate: string = new Date().toISOString().split("T")[0];

  onMount(async () => {
    fetchResults();
  });

  function handleDateChange() {
    fetchResults();
  }

  async function fetchResults() {
    isLoading = true;
    try {
      if (customFetchFunction) {
        // Use custom fetch function if provided
        results = await customFetchFunction(selectedDate);
      } else {
        // Use default fetch function
        const response = await resultApi.getResults();
        results = response.data;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "An unknown error occurred";
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="lottery-results max-w-sm mx-auto">
  {#if isLoading}
    <div
      class="card w-full overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg my-8"
    >
      <div class="bg-red-500 rounded-t-xl p-4">
        <p class="text-white">กำลังโหลดผลสลากกินแบ่ง...</p>
      </div>
    </div>
  {:else if error}
    <div
      class="card w-full overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg"
    >
      <div class="bg-red-500 rounded-t-xl p-4">
        <p class="text-white">{error}</p>
      </div>
    </div>
  {:else if results.length > 0}
    <h2 class="text-3xl font-bold text-center my-8 text-red-700 mb-4">
      {title}
    </h2>

    {#if showDatePicker}
      <div class="mb-8 flex justify-center items-center">
        <input
          type="date"
          bind:value={selectedDate}
          on:change={handleDateChange}
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
    {/if}

    {#each results as resultData, index}
      <LotteryResultCard {resultData} {index} />
    {/each}
  {:else}
    <div
      class="card w-full overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg"
    >
      <div class="bg-red-500 rounded-t-xl p-4">
        <p class="text-white">ไม่พบข้อมูลผลสลากกินแบ่ง</p>
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .card {
    @apply bg-white rounded-xl shadow-md;
  }
</style> 