<script lang="ts">
  import { onMount } from "svelte";
  import type { LotteryResultData } from "$lib/interface/result.types";
  import { resultApi } from "$lib/api/endpoint/result";
  import LotteryResultCard from "./lotteryResultCard.svelte";

  export let title: string = "ผลสลากกินแบ่ง";

  let results: LotteryResultData[] = [];
  let isLoading = false;
  let error: string | null = null;
  let selectedDate = new Date().toISOString().split("T")[0];

  async function fetchResults() {
    isLoading = true;
    error = null;
    try {
      const response = await resultApi.getResults(selectedDate);
      results = response.data;
    } catch (err) {
      error = err instanceof Error ? err.message : "ไม่พบข้อมูลผลสลากกินแบ่ง";
    } finally {
      isLoading = false;
    }
  }

  onMount(fetchResults);
</script>

<div class="lottery-results max-w-sm mx-auto">
  <h2 class="text-3xl font-bold text-center my-8 text-red-700 mb-4">
    {title}
  </h2>

  <div class="mb-8">
    <input
      type="date"
      bind:value={selectedDate}
      on:change={fetchResults}
      class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
    />
  </div>

  {#if isLoading}
    <div class="card">
      <div class="bg-red-500 rounded-t-xl p-4">
        <p class="text-white">กำลังโหลด...</p>
      </div>
    </div>
  {:else if error}
    <div class="card">
      <div class="bg-red-500 rounded-t-xl p-4">
        <p class="text-white">{error}</p>
      </div>
    </div>
  {:else if results.length === 0}
    <div class="card">
      <div class="bg-red-500 rounded-t-xl p-4">
        <p class="text-white">ไม่พบข้อมูลผล</p>
      </div>
    </div>
  {:else}
    {#each results as resultData, index}
      <LotteryResultCard {resultData} {index} />
    {/each}
  {/if}
</div>

<style lang="postcss">
  .card {
    @apply bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg;
  }
</style>
