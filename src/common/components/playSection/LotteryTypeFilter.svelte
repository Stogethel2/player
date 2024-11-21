<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { lotteryTypes } from "./playUtils";
  import type { BetType } from "./Lotto.types";

  const dispatch = createEventDispatcher();

  export let selectedBetTypes: BetType | null = null;
  export let availableBetTypes: BetType[] = [];


  function handleBetTypeClick(betType: any) {
    if (!betType.id) return;

    const isSelected = selectedBetTypes?.id === betType.id;
    const changeType = isSelected ? "deactivate" : "activate";

    console.log(availableBetTypes)

    /* Check exist toggle */
    availableBetTypes = isSelected
      ? availableBetTypes.filter((id) => id !== betType.id)
      : [...availableBetTypes, betType.id];

    const digitCount = betType.bet_digit;
    dispatch("typesChanged", {
      availableBetTypes,
      digitCount,
      selectedBetType: betType,
      changeType,
      isActive: !isSelected,
      activeTypesCount: availableBetTypes.length,
    });
  }

  function isBetTypeSelected(betTypeId: string): boolean {
    return selectedBetTypes?.id === betTypeId;
  }
</script>

<div class="p-2">
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
    {#each availableBetTypes as betType}
      {#if betType.id}
        <button
          class="p-2 rounded-lg text-xs sm:text-sm transition-colors duration-200 ease-in-out"
          class:active={isBetTypeSelected(betType.id)}
          on:click={() => handleBetTypeClick(betType)}
          aria-pressed={isBetTypeSelected(betType.id)}
        >
          {betType.bet_type_name}
        </button>
      {/if}
    {/each}
  </div>
</div>

<style lang="postcss">
  button {
    @apply bg-gray-200 text-gray-800 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
  }
  button.active {
    @apply font-semibold text-white;
  }
  button.active[aria-pressed="true"] {
    @apply bg-red-600;
  }
  button.active[aria-pressed="true"]:nth-child(n + 5) {
    @apply bg-yellow-600;
  }
</style>
