<script lang="ts">
  import { LotteryBetStore } from "./LotteryBetStore";
  import type { TotalList, BetEntry } from "./LotteryBetStore";
  import { Trash2 } from "lucide-svelte";
  import { lotteryTypes } from "./playUtils";
  import { createEventDispatcher } from "svelte";

  export let totalList: TotalList;
  let selectedRows = new Set<string>();
  const dispatch = createEventDispatcher();

  let isAllSelected = false;

  function updateBetAmount(type: string, number: string, event: Event) {
    const amount = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(amount)) {
      LotteryBetStore.updateBetAmount(type, number, amount);
    }
  }

  function deleteBet(type: string, number: string) {
    LotteryBetStore.removeBetEntry(type, number);
    selectedRows.delete(`${type}|${number}`);
    selectedRows = selectedRows;
    dispatchSelectedRows();
  }

  function toggleRowSelection(betId: string) {
    selectedRows.has(betId)
      ? selectedRows.delete(betId)
      : selectedRows.add(betId);
    selectedRows = selectedRows;
    updateAllSelectedState();
    dispatchSelectedRows();
  }

  function getTypeBet(type: string): string {
    return lotteryTypes.find((lt) => lt.id === type)?.label ?? type;
  }

  function dispatchSelectedRows() {
    dispatch("selectionChange", { selectedRows });
  }

  function toggleAllRows() {
    isAllSelected = !isAllSelected;
    if (isAllSelected) {
      totalList.betGroup.forEach((group) => {
        group.entry.forEach((entry) => {
          selectedRows.add(entry.betId);
        });
      });
    } else {
      selectedRows.clear();
    }
    selectedRows = selectedRows;
    dispatchSelectedRows();
  }

  function updateAllSelectedState() {
    const totalBets = totalList.betGroup.reduce(
      (sum, group) => sum + group.entry.length,
      0
    );
    isAllSelected = selectedRows.size === totalBets;
  }
</script>

{#if totalList.betGroup.length > 0}
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
                on:change={toggleAllRows}
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
          {#each totalList.betGroup as { type, entry }}
            {#each entry as bet, index}
              <tr
                class="transition-colors duration-150 ease-in-out cursor-pointer"
                class:bg-gray-200={selectedRows.has(bet.betId)}
                on:click={() => toggleRowSelection(bet.betId)}
              >
                <td class="px-2 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(bet.betId)}
                    on:change={() => toggleRowSelection(bet.betId)}
                    on:click|stopPropagation
                    class="form-checkbox h-5 w-5 text-red-600 mt-1"
                  />
                </td>
                <th
                  scope="row"
                  class="px-2 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {#if index === 0}
                    {getTypeBet(type)}
                  {/if}
                </th>
                <td class="px-2 py-4">{bet.betNo}</td>
                <td class="px-2 py-4">
                  <input
                    type="number"
                    class="w-20 md:w-40 px-2 py-1 border rounded my-input focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                    value={bet.amount}
                    on:input={(e) => updateBetAmount(type, bet.betNo, e)}
                    on:click|stopPropagation
                  />
                </td>
                <td class="px-2 py-4">{bet.amount * 1}</td>
                <td class="px-2 py-4">
                  <button
                    on:click|stopPropagation={() => deleteBet(type, bet.betNo)}
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
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .scrollbar-hide:hover::-webkit-scrollbar {
    display: initial;
  }
</style>
