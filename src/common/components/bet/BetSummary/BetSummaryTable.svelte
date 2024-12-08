<script lang="ts">
  import type { BetSummary } from "$lib/interface/bet.types";
  import { betStore } from "$lib/stores/betStore";
  import { syncBetSummaryWithStore } from "$lib/utils/betCalculations";
  import BetRow from "./BetRow.svelte";
  import TableHeader from "./TableHeader.svelte";
  import { createEventDispatcher } from "svelte";
  import { derived } from "svelte/store";

  export let betSummary: BetSummary;
  const dispatch = createEventDispatcher();

  const currentBetGroups = derived([betStore], ([$betStore]) =>
    syncBetSummaryWithStore(betSummary, $betStore)
  );

  function handleBetDelete(
    event: CustomEvent<{ betTypeId: string; tempId: string }>
  ) {
    const { betTypeId, tempId } = event.detail;
    betStore.removeBet(betTypeId, tempId);
    dispatch("selectionChange", {
      selectedBets: getBetsByTypeId(betTypeId).filter(
        (bet) => bet.tempId !== tempId
      ),
    });
  }

  function handleAmountChange(
    event: CustomEvent<{
      betTypeId: string;
      tempId: string;
      amount: number;
    }>
  ) {
    const { betTypeId, tempId, amount } = event.detail;
    betStore.updateAmount(betTypeId, tempId, amount);
    dispatch("selectionChange", {
      selectedBets: getBetsByTypeId(betTypeId),
    });
  }

  function getBetsByTypeId(betTypeId: string) {
    return $betStore[betTypeId] || [];
  }
</script>

<div class="p-2">
  <div
    class="overflow-x-auto overflow-y-auto max-h-[350px] scrollbar-hide hover:scrollbar-default"
  >
    <table class="w-full text-sm text-left text-gray-500 border-red-500 border">
      <TableHeader />
      <tbody>
        {#each $currentBetGroups as group (group.betTypeId)}
          {#each group.betList as bet (bet.tempId)}
            <BetRow
              {bet}
              betTypeId={group.betTypeId}
              betTypeName={group.lottoBetType.bet_type_name}
              showTypeName={group.betList[0]?.tempId === bet.tempId}
              on:delete={handleBetDelete}
              on:amountChange={handleAmountChange}
            />
          {/each}
        {/each}
      </tbody>
    </table>
  </div>
</div>

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
