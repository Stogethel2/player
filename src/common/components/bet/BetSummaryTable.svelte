<script lang="ts">
  import { betStore } from "$lib/stores/BetStore";
  import { Trash2 } from "lucide-svelte";
  import type { BetSummary } from "$lib/stores/BetStore";

  export let summary: BetSummary | undefined;

  let selectedTempIds = new Set<string>();
  let isAllSelected = false;
  let dispatch: (event: string, detail?: unknown) => void;

  function handleAmountChange(typeId: string, tempId: string, event: Event) {
    const amount = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(amount)) {
      betStore.updateAmount(typeId, tempId, amount);
    }
  }

  function handleBetDelete(typeId: string, tempId: string) {
    betStore.removeBet(typeId, tempId);
    unselectBet(tempId);
    notifySelectionChange();
  }

  function toggleBetSelection(tempId: string) {
    if (selectedTempIds.has(tempId)) {
      selectedTempIds.delete(tempId);
    } else {
      selectedTempIds.add(tempId);
    }

    selectedTempIds = new Set(selectedTempIds);
    updateSelectAllState();
    notifySelectionChange();
  }

  function unselectBet(tempId: string) {
    if (selectedTempIds.has(tempId)) {
      selectedTempIds.delete(tempId);
      selectedTempIds = new Set(selectedTempIds);
      updateSelectAllState();
    }
  }

  function isBetSelected(tempId: string): boolean {
    return selectedTempIds.has(tempId);
  }

  function toggleSelectAll() {
    isAllSelected = !isAllSelected;

    if (isAllSelected && summary) {
      /* Select all bets */
      summary.betGroups.forEach((group) => {
        group.betList.forEach((bet) => {
          selectedTempIds.add(bet.tempId);
        });
      });
    } else {
      selectedTempIds.clear();
    }

    selectedTempIds = new Set(selectedTempIds);
    notifySelectionChange();
  }

  function updateSelectAllState() {
    const totalBets =
      summary?.betGroups.reduce(
        (sum, group) => sum + group.betList.length,
        0
      ) ?? 0;
    isAllSelected = totalBets > 0 && selectedTempIds.size === totalBets;
  }

  function notifySelectionChange() {
    if (!summary) return;

    const selectedBets = Array.from(selectedTempIds)
      .map((tempId) => {
        for (const group of summary.betGroups) {
          const bet = group.betList.find((entry) => entry.tempId === tempId);
          if (bet) {
            return {
              typeId: group.typeId,
              tempId: bet.tempId,
            };
          }
        }
        return null;
      })
      .filter((bet): bet is { typeId: string; tempId: string } => bet !== null);

    dispatch("selectionChange", { selectedBets });
  }
</script>

{#if summary && summary.betGroups?.length > 0}
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
            <th scope="col" class="px-2 py-3">ประเภท</th>
            <th scope="col" class="px-2 py-3">เลข</th>
            <th scope="col" class="px-2 py-3">จำนวนเงิน</th>
            <th scope="col" class="px-2 py-3">อัตราจ่าย</th>
            <th scope="col" class="px-2 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {#each summary.betGroups as { typeId, lottoBetType, betList }}
            {#each betList as bet, betIndex}
              <tr
                class="transition-colors duration-150 ease-in-out cursor-pointer"
                class:bg-gray-200={isBetSelected(bet.tempId)}
                on:click={() => toggleBetSelection(bet.tempId)}
              >
                <td class="px-2 py-4">
                  <input
                    type="checkbox"
                    checked={isBetSelected(bet.tempId)}
                    on:change={() => toggleBetSelection(bet.tempId)}
                    on:click|stopPropagation
                    class="form-checkbox h-5 w-5 text-red-600 mt-1"
                  />
                </td>
                <td class="px-2 py-4">
                  {#if betIndex === 0}
                    {lottoBetType.bet_type_name}
                  {/if}
                </td>
                <td class="px-2 py-4">{bet.number}</td>
                <td class="px-2 py-4">
                  <input
                    type="number"
                    class="w-20 md:w-40 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                    value={bet.amount}
                    on:input={(e) => handleAmountChange(typeId, bet.tempId, e)}
                    on:click|stopPropagation
                  />
                </td>
                <td class="px-2 py-4">{bet.payout || "-"}</td>
                <td class="px-2 py-4">
                  <button
                    on:click|stopPropagation={() =>
                      handleBetDelete(typeId, bet.tempId)}
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
{:else}
  <div class="p-8 text-center text-gray-500">
    <p class="text-lg">ไม่มีรายการเดิมพัน</p>
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
