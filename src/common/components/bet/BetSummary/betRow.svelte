<script lang="ts">
  import { Trash2 } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";
  import { betStore } from "$lib/stores/BetStore";
  import type { LotteryBet } from "$lib/interface/bet.types";
  import { onMount, onDestroy } from "svelte";

  export let bet: LotteryBet;
  export let bet_type_id: string;
  export let betTypeName: string;
  export let showTypeName: boolean;

  const dispatch = createEventDispatcher();

  /* Holds the unsubscribe function returned by a subscription. */
  let unsubscribe: (() => void) | null = null;
  let currentAmount = bet.amount ?? 1;
  let currentPayout = bet.payout ?? 0;

  onMount(() => {
    unsubscribe = betStore.subscribe(($store) => {
      const updatedBet = $store[bet_type_id]?.find(
        (b) => b.temp_id === bet.temp_id
      );
      if (
        updatedBet &&
        (updatedBet.amount !== currentAmount ||
          updatedBet.payout !== currentPayout)
      ) {
        currentAmount = updatedBet.amount;
        currentPayout = updatedBet.payout;
      }
    });
  });

  onDestroy(() => {
    /* Unsubscribe from the store when the component is destroyed. */
    unsubscribe?.();
  });

  function handleDelete() {
    dispatch("delete", {
      bet_type_id,
      temp_id: bet.temp_id,
    });
  }

  function handleAmountChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const newAmount = Math.max(1, parseInt(input.value) || 0);

    /* Update the input value to ensure it's at least 1 */
    if (newAmount !== parseInt(input.value)) {
      input.value = newAmount.toString();
    }

    dispatch("amountChange", {
      bet_type_id,
      lotto_id: bet.lotto_id,
      lotto_name: bet.lotto_name,
      temp_id: bet.temp_id,
      amount: newAmount,
    });
  }

  $: winningAmount = currentAmount * currentPayout;
</script>

<tr
  class="transition-colors duration-150 ease-in-out 
         dark:bg-[#1a1a1a] "
  class:bg-red-50={currentAmount < 1}
>
  <td class="px-2 py-4">
    {#if showTypeName}
      <span class="font-medium">{betTypeName}</span>
    {/if}
  </td>
  <td class="px-2 py-4">{bet.number}</td>
  <td class="px-2 py-4">
    <input
      type="number"
      class="input w-20 md:w-40 px-2 py-1"
      value={currentAmount}
      min="1"
      on:input={handleAmountChange}
    />
  </td>
  <td class="px-2 py-4">{currentPayout}</td>
  <td class="px-2 py-4">{winningAmount}</td>
  <td class="px-2 py-4">
    <button
      on:click={handleDelete}
      class="btn text-red-500 hover:text-red-700"
      title="Delete bet"
    >
      <Trash2 size={20} />
    </button>
  </td>
</tr>
