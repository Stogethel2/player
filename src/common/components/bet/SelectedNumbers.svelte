<script lang="ts">
  import { betStore } from "$lib/stores/betStore";
  import { derived } from "svelte/store";
  import { fade } from "svelte/transition";
  import { getTypeClass } from "$lib/utils/play";
  import type { LottoBetType } from "$lib/interface/lotto.types";

  export let availableBetTypes: LottoBetType[] = [];

  const betListSummary = derived(betStore, () => {
    const summary = betStore.getSummary();
    return {
      betGroups: summary.betGroups,
      totalBet: summary.totals.totalBet,
    };
  });

  $: ({ betGroups, totalBet } = $betListSummary);
  $: enableScrolling = totalBet > 10;

  function deleteBet(betTypeId: string, tempId: string) {
    betStore.removeBet(betTypeId, tempId);
  }

  function getBetTypeName(betTypeId: string): string {
    return (
      availableBetTypes.find((type) => type.id === betTypeId)?.bet_type_name ||
      betTypeId
    );
  }
</script>

<div class="h-full rounded pt-2 flex flex-col">
  <h2 class="text-md font-light text-center">รายการแทง</h2>

  <div class="flex-grow overflow-hidden">
    <div class={`h-full p-1 ${enableScrolling ? "overflow-y-auto" : ""}`}>
      {#if totalBet === 0}
        <div
          class="flex flex-col items-center justify-center h-full text-gray-500 text-sm mb-4"
          transition:fade={{ duration: 200 }}
        >
          <p>ไม่มีรายการ</p>
          <p>ที่เลือก</p>
        </div>
      {:else}
        {#each betGroups as { betTypeId, betList } (betTypeId)}
          <div class="mb-4">
            <h3 class="font-semibold mb-2">{getBetTypeName(betTypeId)}</h3>
            {#each betList as bet (bet.tempId)}
              <div
                class="mb-2 last:mb-0 relative flex justify-center"
                transition:fade={{ duration: 200 }}
              >
                <div
                  class={`p-1 text-sm w-full md:w-2/5 flex items-center justify-center rounded-full relative ${getTypeClass(betTypeId)}`}
                >
                  <span class="flex-grow text-center mr-4">{bet.number}</span>
                  <button
                    class="absolute right-1 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center bg-white text-slate-600 bg-opacity-80 hover:bg-opacity-100 rounded-full transition-colors duration-200"
                    on:click={() => deleteBet(betTypeId, bet.tempId)}
                    aria-label={`Remove ${bet.number} from ${getBetTypeName(betTypeId)}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

<style>
  .overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }

  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
    border: transparent;
  }
</style>
