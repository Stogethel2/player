<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { LottoBetType, Lotto } from "$lib/interface/lotto.types";
  import { groupBetType, unGroupBetType, type GroupedBetTypes } from "$lib/utils/group-bet-type.util";

  const dispatch = createEventDispatcher();

  export let selectedBetType: LottoBetType | null = null;
  export let availableBetTypes: LottoBetType[] = [];
  let selectedDigitGroup: number | null = null;

  function handleBetTypeClick(betType: LottoBetType) {
    if (!betType.id) return;

    const isCurrentlySelected = selectedBetType?.id === betType.id;

    selectedBetType = isCurrentlySelected ? null : betType;

    dispatch("typesChanged", {
      availableBetTypes,
      digitCount: betType.bet_digit,
      selectedBetType: betType,
      changeType: isCurrentlySelected ? "deactivate" : "activate",
      isActive: !isCurrentlySelected,
      activeTypesCount: availableBetTypes.length,
    });
  }

  function handleDigitGroupClick(digitGroup: number) {
    selectedDigitGroup = digitGroup;
  }

  console.log("availableBetTypes", groupBetType(availableBetTypes));
  // availableBetTypes = unGroupBetType(groupBetType(availableBetTypes));
  const groupedBetTypes: GroupedBetTypes[] = groupBetType(availableBetTypes);
  console.log("groupedBetTypes", groupedBetTypes);

  function isBetTypeSelected(bet_type_id: string): boolean {
    return selectedBetType?.id === bet_type_id;
  }
</script>

<div class="py-2">
  <p>เลือกรูปแบบ</p>
  <div class="grid grid-cols-3 gap-2">
    {#each groupedBetTypes as groupedBetType}
      {#if groupedBetType.digitGroup}
        <button
          class="btn-gradient p-2 rounded-lg text-md sm:text-md transition-colors duration-200 ease-in-out"
          class:active={isBetTypeSelected(groupedBetType.betTypes[0].id)}
          on:click={() => handleDigitGroupClick(groupedBetType.digitGroup)}
          aria-pressed={isBetTypeSelected(groupedBetType.betTypes[0].id)}
        >
          {groupedBetType.groupName}
        </button>
      {/if}
    {/each}
  </div>

  {#if selectedDigitGroup}
  <div class="mt-4">
    <p>เลือกประเภท *เลือกได้มากกว่า 1 ตัวเลือก</p>
    <div class="grid grid-cols-3 gap-2">
      {#each groupedBetTypes.find(g => g.digitGroup === selectedDigitGroup)?.betTypes ?? [] as betType}
        {#if betType.is_active}
          <button
            class="btn-gradient p-2 rounded-lg text-md sm:text-md transition-colors duration-200 ease-in-out"
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
  {/if}
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
  /* button.active[aria-pressed="true"]:nth-child(n + 5) {
    @apply bg-yellow-600;
  } */
</style>
