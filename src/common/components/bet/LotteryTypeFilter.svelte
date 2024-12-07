<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { LottoBetType } from "$lib/interface/Lotto.types";

  const dispatch = createEventDispatcher();

  export let selectedBetType: LottoBetType | null = null;
  export let availableBetTypes: LottoBetType[] = [];

  function handleBetTypeClick(betType: LottoBetType) {
    if (!betType.id) return;

    const isCurrentlySelected = selectedBetType?.id === betType.id;

    selectedBetType = isCurrentlySelected 
      ? null 
      : betType;

    dispatch("typesChanged", {
      availableBetTypes,
      digitCount: betType.bet_digit,
      selectedBetType: betType,
      changeType: isCurrentlySelected ? "deactivate" : "activate", 
      isActive: !isCurrentlySelected,
      activeTypesCount: availableBetTypes.length
    });
  }

  function isBetTypeSelected(betTypeId: string): boolean {
    return selectedBetType?.id === betTypeId;
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
