<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { lotteryTypes } from "./playUtils";

  const dispatch = createEventDispatcher();

  export let initialActiveTypes: string[] = [];
  export let lottoBetTypes: any;

  let activeTypes = initialActiveTypes;

  function toggleLotteryType(lottoBetType: any) {
    if(!lottoBetType.id) return

    const isActive = activeTypes.includes(lottoBetType.id);
    const action = isActive ? "deactivate" : "activate";

    /* Check exist toggle */
    activeTypes = isActive
      ? activeTypes.filter((id) => id !== lottoBetType.id)
      : [...activeTypes, lottoBetType.id];

    const inputLength = lottoBetType.bet_digit;
    dispatch("typesChanged", {
      activeTypes,
      inputLength,
      selectedType: lottoBetType,
      action,
      isActive: !isActive,
      allActiveTypes: activeTypes.map((id) => ({
        id,
        label: lotteryTypes.find((type) => type.id === id)?.label,
      })),
      activeTypesCount: activeTypes.length,
    });
  }
</script>

<div class="p-2">
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
    {#each lottoBetTypes as lottoBetType}
        {#if lottoBetType.id}
        <button
            class="p-2 rounded-lg text-xs sm:text-sm transition-colors duration-200 ease-in-out"
            class:active={activeTypes.includes(lottoBetType.id)}
            on:click={() => toggleLotteryType(lottoBetType)}
            aria-pressed={activeTypes.includes(lottoBetType.id)}
        >
            {lottoBetType.bet_type_name}
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
