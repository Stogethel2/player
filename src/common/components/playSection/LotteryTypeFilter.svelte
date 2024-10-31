<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { lotteryTypes } from "./playUtils";

  const dispatch = createEventDispatcher();

  export let initialActiveTypes: string[] = [];

  let activeTypes = initialActiveTypes;

  function toggleLotteryType(typeId: string) {
    const isActive = activeTypes.includes(typeId);
    const action = isActive ? "deactivate" : "activate";

    activeTypes = isActive
      ? activeTypes.filter((id) => id !== typeId)
      : [...activeTypes, typeId];

    const selectedType = lotteryTypes.find((type) => type.id === typeId);
    const inputLength = selectedType
      ? parseInt(selectedType.id.split("-")[0])
      : 0;

    dispatch("typesChanged", {
      activeTypes,
      inputLength,
      selectedType: typeId,
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
    {#each lotteryTypes as type (type.id)}
      <button
        class="p-2 rounded-lg text-xs sm:text-sm transition-colors duration-200 ease-in-out"
        class:active={activeTypes.includes(type.id)}
        on:click={() => toggleLotteryType(type.id)}
        aria-pressed={activeTypes.includes(type.id)}
      >
        {type.label}
      </button>
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
