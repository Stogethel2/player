<script lang="ts">
  
  import type { BetSummary } from "$lib/interface/bet.types";
  import { betStore } from "$lib/stores/betStore";
  import BetRow from "./BetRow.svelte";
  import TableHeader from "./TableHeader.svelte";
  import { createEventDispatcher } from "svelte";

  export let betSummary: BetSummary;
  let selectedTempIds = new Set<string>();
  const dispatch = createEventDispatcher();

  $: betGroups = betSummary?.betGroups || [];

  function updateSelectedBets() {
    if (!betSummary) return;
    const selectedBets = collectSelectedBets();
    dispatch("selectionChange", { selectedBets });
  }

  function collectSelectedBets() {
    return Array.from(selectedTempIds)
      .map(findBetInGroups)
      .filter(checkValidBet);
  }

  function findBetInGroups(tempId: string) {
    let result = null;
    betGroups.forEach((group) => {
      /* Find bet with tempId */
      const bet = group.betList.find((bet) => bet.tempId === tempId);
      if (bet) {
        result = {
          betTypeId: group.betTypeId,
          tempId: bet.tempId,
        };
      }
    });
    return result;
  }

  function checkValidBet(
    bet: any
  ): bet is { betTypeId: string; tempId: string } {
    return bet !== null;
  }

  function handleBetDelete(event: CustomEvent) {
    const { betTypeId, tempId } = event.detail;
    betStore.removeBet(betTypeId, tempId);
    updateSelectedBets();
  }

  function handleAmount(event: CustomEvent) {
    const { betTypeId, tempId, amount, payout } = event.detail;
    betStore.updateAmount(betTypeId, tempId, amount);
    updateSelectedBets();
  }
</script>

<div class="p-2">
  <div
    class="overflow-x-auto overflow-y-auto max-h-[350px] scrollbar-hide hover:scrollbar-default"
  >
    <table class="w-full text-sm text-left text-gray-500 border-red-500 border">
      <TableHeader />

      <tbody>
        {#each betGroups as group}
          {#each group.betList as bet, betIndex}
            <BetRow
              {bet}
              betTypeId={group.betTypeId}
              betTypeName={group.lottoBetType.bet_type_name}
              betIndex={betIndex === 0}
              on:delete={handleBetDelete}
              on:onAmountChange={handleAmount}
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
