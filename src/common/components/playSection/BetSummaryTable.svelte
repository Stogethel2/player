<script lang="ts">
  import { LotteryBetStore } from "./BetStore";
  import type { BetSummary, LotteryBet } from "./BetStore";
  import { Trash2 } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";

  export let summary: BetSummary;
  let selectedBetIds = new Set<string>();
  let isAllSelected = false;
  const dispatch = createEventDispatcher();

  function handleAmountChange(typeId: string, number: string, event: Event) {
    const amount = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(amount)) {
      LotteryBetStore.updateAmount(typeId, number, amount);
    }
  }

  function handleBetDelete(typeId: string, number: string) {
    LotteryBetStore.removeBet(typeId, number);
    selectedBetIds.delete(`${typeId}|${number}`);
    selectedBetIds = selectedBetIds;
    notifySelectionChange();
  }

  function toggleBetSelection(betId: string) {
    selectedBetIds.has(betId)
      ? selectedBetIds.delete(betId)
      : selectedBetIds.add(betId);
    selectedBetIds = selectedBetIds;
    updateSelectAllState();
    notifySelectionChange();
  }

  function toggleSelectAll() {
    isAllSelected = !isAllSelected;
    if (isAllSelected) {
      summary.groups.forEach((group) => {
        group.entries.forEach((bet) => {
          selectedBetIds.add(bet.id);
        });
      });
    } else {
      selectedBetIds.clear();
    }
    selectedBetIds = selectedBetIds;
    notifySelectionChange();
  }

  function updateSelectAllState() {
    const totalBets = summary.groups.reduce(
      (sum, group) => sum + group.entries.length,
      0
    );
    isAllSelected = selectedBetIds.size === totalBets;
  }

  function notifySelectionChange() {
    dispatch("selectionChange", { selectedBetIds });
  }
</script>

{#if summary}
  <div class="p-2">
    <div
      class="overflow-x-auto overflow-y-auto max-h-[350px] scrollbar-hide hover:scrollbar-default"
    >
      <table
        class="w-full text-sm text-left text-gray-500 border-red-500 border"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-red-100 border-red-500 border-b sticky top-0 z-10"
        >
          <tr>
            <th scope="col" class="px-2 py-3">
              <input
                type="checkbox"
                checked={isAllSelected}
                on:change={toggleSelectAll}
                class="form-checkbox h-5 w-5 text-red-600"
              />
            </th>
            <th scope="col" class="px-2 py-3">เลข</th>
            <th scope="col" class="px-2 py-3">จำนวนเงิน</th>
            <th scope="col" class="px-2 py-3">อัตราจ่าย</th>
            <th scope="col" class="px-2 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {#each summary.groups as { typeId, entries }}
            {#each entries as bet}
              <tr
                class="transition-colors duration-150 ease-in-out cursor-pointer"
                class:bg-gray-200={selectedBetIds.has(bet.id)}
                on:click={() => toggleBetSelection(bet.id)}
              >
                <td class="px-2 py-4">
                  <input
                    type="checkbox"
                    checked={selectedBetIds.has(bet.id)}
                    on:change={() => toggleBetSelection(bet.id)}
                    on:click|stopPropagation
                    class="form-checkbox h-5 w-5 text-red-600 mt-1"
                  />
                </td>
                <td class="px-2 py-4">{bet.number}</td>
                <td class="px-2 py-4">
                  <input
                    type="number"
                    class="w-20 md:w-40 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                    value={bet.amount}
                    on:input={(e) => handleAmountChange(typeId, bet.number, e)}
                    on:click|stopPropagation
                  />
                </td>
                <td class="px-2 py-4">{bet.payout}</td>
                <td class="px-2 py-4">
                  <button
                    on:click|stopPropagation={() =>
                      handleBetDelete(typeId, bet.number)}
                    class="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            {/each}
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}

<style>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide:hover::-webkit-scrollbar {
    display: initial;
  }
</style>
