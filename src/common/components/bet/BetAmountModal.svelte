<script lang="ts">
  import { onMount } from "svelte";
  import { derived } from "svelte/store";
  import BetSummaryTable from "./BetSummaryTable.svelte";
  import { betStore } from "./BetStore";
  import type { BetSummary, BetGroupSummary, LotteryBet } from "./BetStore";
  import { betCalculateApi } from "$lib";

  export let accountBalance = 30420.19;
  export let usedBalance = 0;

  let selectedTempIds = new Set<string>();
  let dispatch: (event: string, detail?: any) => void;
  $: betSummary = derived(betStore, calculateBetSummary);

  function calculateBetSummary(
    $store: Record<string, LotteryBet[]>
  ): BetSummary {
    let totalBet = 0;
    let totalAmount = 0;

    const currentBetGroups: BetGroupSummary[] = Object.entries($store).map(
      ([typeId, bets]) => {
        const betList: LotteryBet[] = bets.map((bet) => {
          totalBet += 1;
          totalAmount += bet.amount;
          return { ...bet, payout: 1 };
        });

        return {
          typeId,
          lottoBetType: bets[0]?.lottoBetType || "",
          betList,
          totalAmount: betList.reduce((sum, bet) => sum + bet.amount, 0),
          totalBets: betList.length,
        };
      }
    );

    return {
      betGroups: currentBetGroups,
      totals: { totalBet, totalAmount },
    };
  }

  async function handleSubmit() {
    dispatch("submit", {
      totalAmount: $betSummary.totals.totalAmount,
      usedBalance,
    });
  }

  function handleClose() {
    dispatch("cancel");
  }

  function updateSelectedBetsAmount(amount: number): void {
    const summary = betStore.getSummary();

    summary.betGroups.forEach((group) => {
      group.betList.forEach((bet) => {
        if (selectedTempIds.has(bet.tempId)) {
          betStore.updateAmount(group.typeId, bet.tempId, amount);
        }
      });
    });
  }

  function clearSelectedBets() {
    updateSelectedBetsAmount(0);
  }

  function handleBetSelection(
    event: CustomEvent<{ selectedTempIds: Set<string> }>
  ) {
    selectedTempIds = event.detail.selectedTempIds;
  }

  let calculatedBets: BetSummary;

  onMount(async () => {
    try {
      calculatedBets = await betCalculateApi.getBetCalculate({
        ...$betSummary,
      });
    } catch (error) {
      console.error("Failed to fetch bet calculations:", error);
      calculatedBets = $betSummary;
    }
  });
</script>

<div class="fixed inset-0 bg-black/50 flex items-center justify-center">
  <div class="w-11/12 max-w-2xl bg-white rounded-lg overflow-hidden">
    <header
      class="bg-red-600 text-white px-4 py-2 flex justify-between items-center"
    >
      <h2 class="text-lg font-medium">ใส่ราคา</h2>
      <button class="text-2xl" on:click={handleClose}>&times;</button>
    </header>

    <BetSummaryTable
      on:selectionChange={handleBetSelection}
      summary={calculatedBets}
    />

    <div class="p-4 space-y-4">
      <div class="space-y-2">
        <button
          class="w-full py-2 bg-gray-100 rounded"
          on:click={clearSelectedBets}
        >
          เคลียร์จำนวนเงิน
        </button>

        <div class="grid grid-cols-3 gap-2">
          {#each [5, 10, 20, 50, 100] as amount}
            <button
              class="py-2 bg-gray-100 rounded hover:bg-gray-200"
              on:click={() => updateSelectedBetsAmount(amount)}
            >
              {amount}฿
            </button>
          {/each}
          <button class="py-2 bg-gray-100 rounded hover:bg-gray-200">
            ระบุ
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <label class="block" for="totalAmount">ราคารวม</label>
        <input
          id="totalAmount"
          type="number"
          class="w-full p-2 bg-gray-100 rounded text-right"
          readonly
          value={$betSummary.totals.totalAmount}
        />
      </div>

      <div class="flex justify-between text-sm">
        <div>
          <span class="text-green-600">Credit คงเหลือ</span>
          <span class="block font-bold">{accountBalance.toFixed(2)}</span>
        </div>
        <div>
          <span class="text-red-600">ใช้ Credit ทั้งหมด</span>
          <span class="block font-bold">{usedBalance.toFixed(2)}</span>
        </div>
      </div>

      <div class="flex justify-between gap-4">
        <button
          class="flex-1 py-2 bg-gray-100 rounded hover:bg-gray-200"
          on:click={handleClose}
        >
          ยกเลิกทั้งหมด
        </button>
        <button
          class="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          on:click={handleSubmit}
        >
          ส่งไป
        </button>
      </div>
    </div>
  </div>
</div>
