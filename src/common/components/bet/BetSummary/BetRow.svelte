<script lang="ts">
  import { Trash2 } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";
  import { betStore } from "$lib/stores/betStore";
  import type { LotteryBet } from "$lib/interface/bet.types";

  export let bet: LotteryBet;
  export let betTypeId: string;
  export let betTypeName: string;
  export let betIndex: boolean;

  const dispatch = createEventDispatcher();

  /* Get current bet from store and recalculate when store updates */
  $: currentBet =
    $betStore[betTypeId]?.find((b: LotteryBet) => b.tempId === bet.tempId) ||
    bet;

  function handleDelete() {
    dispatch("delete", { betTypeId, tempId: bet.tempId });
  }

  function handleAmount(event: Event) {
    const newAmount: number = parseInt(
      (event.target as HTMLInputElement).value
    );

    betStore.updateAmount(betTypeId, bet.tempId, newAmount);
    dispatch("onAmountChange", {
      betTypeId,
      tempId: bet.tempId,
      amount: newAmount,
    });
  }
</script>

<tr class="transition-colors duration-150 ease-in-out">
  <td class="px-2 py-4">
    {#if betIndex}
      {betTypeName}
    {/if}
  </td>
  <td class="px-2 py-4">{currentBet.number}</td>
  <td class="px-2 py-4">
    <input
      type="number"
      class="w-20 md:w-40 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
      value={currentBet.amount}
      min="1"
      on:input={handleAmount}
    />
  </td>
  <td class="px-2 py-4">{currentBet.amount * currentBet.payout}</td>
  <td class="px-2 py-4">
    <button on:click={handleDelete} class="text-red-500 hover:text-red-700">
      <Trash2 size={20} />
    </button>
  </td>
</tr>
