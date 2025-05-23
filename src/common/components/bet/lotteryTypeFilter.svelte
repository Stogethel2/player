<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { LottoBetType } from "$lib/interface/lotto.types";
  import {
    groupBetType,
    type GroupedBetTypes,
  } from "$lib/utils/group-bet-type.util";

  const dispatch = createEventDispatcher();

  export let selectedBetType: LottoBetType | null = null;
  export let availableBetTypes: LottoBetType[] = [];
  let selectedDigitGroup: number | null = null;
  let selectedBetTypes: LottoBetType[] = [];

  function handleBetTypeClick(betType: LottoBetType) {
    if (!betType.id) return;

    const isCurrentlySelected = selectedBetTypes.some(
      (selected) => selected.id === betType.id
    );

    if (isCurrentlySelected) {
      selectedBetTypes = selectedBetTypes.filter(
        (selected) => selected.id !== betType.id
      );
    } else {
      selectedBetTypes = [...selectedBetTypes, betType];
    }

    selectedBetType = selectedBetTypes.length > 0 ? selectedBetTypes[0] : null;

    dispatch("typesChanged", {
      availableBetTypes,
      digitCount: betType.bet_digit,
      selectedBetType: betType,
      selectedBetTypes,
      changeType: isCurrentlySelected ? "deactivate" : "activate",
      isActive: !isCurrentlySelected,
      activeTypesCount: selectedBetTypes.length,
    });
  }

  function handleDigitGroupClick(digitGroup: number) {
    if (selectedDigitGroup !== digitGroup) {
      selectedBetTypes = [];
      selectedBetType = null;
      
      dispatch("typesChanged", {
        availableBetTypes,
        digitCount: 0,
        selectedBetType: null,
        selectedBetTypes: [],
        changeType: "clear",
        isActive: false,
        activeTypesCount: 0,
      });
    }
    selectedDigitGroup = digitGroup;
  }

  const groupedBetTypes: GroupedBetTypes[] = groupBetType(availableBetTypes);

  console.log(groupedBetTypes);

  function isDigitGroupSelected(digitGroup: number): boolean {
    return selectedDigitGroup === digitGroup;
  }
</script>

<div class="py-2">
  <p class="text-xs py-2">เลือกรูปแบบ</p>
  <div class="grid grid-cols-3 gap-2">
    {#each groupedBetTypes as groupedBetType}
      {#if groupedBetType.digitGroup}
        <button
          class="btn btn-gradient p-2 rounded-lg text-md sm:text-md transition-colors duration-200 ease-in-out"
          class:active={isDigitGroupSelected(groupedBetType.digitGroup)}
          on:click={() => handleDigitGroupClick(groupedBetType.digitGroup)}
          aria-pressed={isDigitGroupSelected(groupedBetType.digitGroup)}
        >
          {groupedBetType.groupName}
        </button>
      {/if}
    {/each}
  </div>

  {#if selectedDigitGroup}
    <div class="mt-4">
      <p class="text-xs py-2">เลือกประเภท *เลือกได้มากกว่า 1 ตัวเลือก</p>
      <div class="grid grid-cols-3 gap-2">
        {#each groupedBetTypes.find((g) => g.digitGroup === selectedDigitGroup)?.betTypes ?? [] as betType}
          {#if betType.is_active}
            <button
              class="btn-gradient p-2 rounded-lg text-md sm:text-md transition-colors duration-200 ease-in-out"
              class:active={selectedBetTypes.findIndex(
                (selected) => selected.id === betType.id
              ) >= 0}
              on:click={() => handleBetTypeClick(betType)}
            >
              {betType.bet_type_name}
            </button>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</div>