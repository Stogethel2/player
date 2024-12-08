<script lang="ts">
  import { derived } from "svelte/store";
  import { createEventDispatcher, onMount } from "svelte";
  import { betCalculateApi } from "$lib/api/endpoint/betCalculate";
  import BetSummaryTable from "./BetSummary/BetSummaryTable.svelte";

  import { calculateBetSummary } from "$lib/utils/betCalculations";
  import type {
    BetGroupSummary,
    BetSummary,
    BetTypeGroup,
  } from "$lib/interface/bet.types";
  import { betStore } from "$lib/stores/betStore";

  export const QUICK_BET_AMOUNTS = [5, 10, 20, 50, 100] as const;
  export const BET_CONFIG = {
    MIN_BET: 1.0,
    MAX_BET: 2000,
  } as const;
  export let availableBalance = 30420.19;

  let betCalculationResult: BetSummary;
  let isLoading = true;

  const dispatch = createEventDispatcher();

  /* Get bet summary from store */
  $: currentBetSummary = derived(betStore, calculateBetSummary);

  function handleSubmitBet() {
    console.log('Current Bet Summary:', $currentBetSummary);
  }

  function handleCloseModal() {
    dispatch("cancel");
  }

  function handleQuickBetAmount(amount: number): void {
    updateBetsInStore($currentBetSummary.betGroups, amount);
  }

  function handleClearBetAmounts(): void {
    handleQuickBetAmount(0);
  }

  /* Update bets in store */
  function updateBetsInStore(
    betGroups: BetGroupSummary[],
    amount: number
  ): void {
    betGroups.forEach((betGroup) => {
      betGroup.betList.forEach((betItem) => {
        if (betItem.tempId !== undefined) {
          betStore.updateAmount(betGroup.betTypeId, betItem.tempId, amount);
        }
      });
    });
  }

  async function fetchBetCalculations(): Promise<void> {
    try {
      const result = await betCalculateApi.getBetCalculate($currentBetSummary);
      betCalculationResult = result;
      syncCalculationsWithStore(result);
    } catch (error) {
      console.error("Failed to fetch bet calculations:", error);
      betCalculationResult = $currentBetSummary;
    } finally {
      isLoading = false;
    }
  }

  function syncCalculationsWithStore(calculations: BetSummary): void {
    const betTypeGroup: BetTypeGroup = {};
    calculations.betGroups.forEach((betGroup) => {
      betTypeGroup[betGroup.betTypeId] = betGroup.betList.map((bet) => ({
        ...bet,
        lottoBetType: betGroup.lottoBetType,
      }));
    });
    betStore.syncBetData(betTypeGroup);
  }

  onMount(fetchBetCalculations);
</script>

<div class="fixed inset-0 bg-black/50 flex items-center justify-center">
  <div class="w-11/12 max-w-2xl bg-white rounded-lg overflow-hidden">
    <!-- Header -->
    <header
      class="bg-red-600 text-white px-4 py-2 flex justify-between items-center"
    >
      <h2 class="text-lg font-medium">ใส่ราคา</h2>
      <button
        class="text-2xl hover:opacity-80 transition-opacity"
        on:click={handleCloseModal}
      >
        &times;
      </button>
    </header>

    <!-- Table -->
    {#if isLoading}
      <div class="flex justify-center items-center h-32">
        <div
          class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"
        ></div>
      </div>
    {:else}
      <BetSummaryTable betSummary={betCalculationResult} />
    {/if}

    <!-- Quick Actions -->
    <div class="p-4 space-y-4">
      <div class="space-y-2">
        <button
          class="w-full py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          on:click={handleClearBetAmounts}
        >
          เคลียร์จำนวนเงิน
        </button>

        <div class="grid grid-cols-3 gap-2">
          {#each QUICK_BET_AMOUNTS as amount}
            <button
              class="py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              on:click={() => handleQuickBetAmount(amount)}
            >
              {amount}฿
            </button>
          {/each}
          <button
            class="py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            ระบุ
          </button>
        </div>
      </div>

      <!-- Total Amount -->
      <div class="space-y-2">
        <label class="block" for="totalAmount">ราคารวม</label>
        <input
          id="totalAmount"
          type="number"
          class="w-full p-2 bg-gray-100 rounded text-right"
          readonly
          value={$currentBetSummary.totals.totalAmount}
        />
      </div>

      <!-- Balance Information -->
      <div class="flex justify-between text-sm">
        <div>
          <span class="text-green-600">Credit คงเหลือ</span>
          <span class="block font-bold">{availableBalance}</span>
        </div>
        <div>
          <span class="text-red-600">ใช้ Credit ทั้งหมด</span>
          <span class="block font-bold text-right">{$currentBetSummary.totals.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between gap-4">
        <button
          class="flex-1 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          on:click={handleCloseModal}
        >
          ยกเลิกทั้งหมด
        </button>
        <button
          class="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          on:click={handleSubmitBet}
        >
          ส่งไป
        </button>
      </div>
    </div>
  </div>
</div>
