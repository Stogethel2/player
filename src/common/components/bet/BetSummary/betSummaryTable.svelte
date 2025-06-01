<script lang="ts">
  import type { BetSummary } from "$lib/interface/bet.types";
  import { betStore } from "$lib/stores/BetStore";
  import { syncBetSummaryWithStore } from "$lib/utils/bet-calculations.utils";

  import BetRow from "./betRow.svelte";
  import TableHeader from "./tableHeader.svelte";
  import { createEventDispatcher } from "svelte";
  import { derived } from "svelte/store";

  export let betSummary: BetSummary;
  const dispatch = createEventDispatcher();

  const currentBetGroups = derived([betStore], ([$betStore]) =>
    syncBetSummaryWithStore(betSummary, $betStore)
  );

  function handleBetDelete(
    event: CustomEvent<{ bet_type_id: string; temp_id: string }>
  ) {
    const { bet_type_id, temp_id } = event.detail;
    betStore.removeBet(bet_type_id, temp_id);
    dispatch("selectionChange", {
      selectedBets: getBetsByTypeId(bet_type_id).filter(
        (bet) => bet.temp_id !== temp_id
      ),
    });
  }

  function handleAmountChange(
    event: CustomEvent<{
      lotto_id: string,
      lotto_name: string,
      bet_type_id: string;
      temp_id: string;
      amount: number;
    }>
  ) {
    const { lotto_id, lotto_name, bet_type_id, temp_id, amount } = event.detail;
    betStore.updateAmount(lotto_id, lotto_name, bet_type_id, temp_id, amount);
    dispatch("selectionChange", {
      selectedBets: getBetsByTypeId(bet_type_id),
    });
  }

  function getBetsByTypeId(bet_type_id: string) {
    return $betStore[bet_type_id] || [];
  }
</script>

<div class="p-2">
  <div
    class="overflow-x-auto overflow-y-auto max-h-[350px] scrollbar-hide hover:scrollbar-default"
  >
    <table class="w-full text-sm text-left text-white border-gold border">
      <TableHeader />
      <tbody>
        {#each $currentBetGroups as group (group.bet_type_id)}
          {#if group.lottoBetType}
            {#each group.betList as bet (bet.temp_id)}
              <BetRow
                {bet}
                bet_type_id={group.bet_type_id}
                betTypeName={group.lottoBetType.bet_type_name}
                showTypeName={group.betList[0]?.temp_id === bet.temp_id}
                on:delete={handleBetDelete}
                on:amountChange={handleAmountChange}
              />
            {/each}
          {/if}
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
