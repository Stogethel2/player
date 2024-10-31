<script lang="ts">
  import { onMount, afterUpdate } from "svelte";
  import { LotteryBetStore } from "./LotteryBetStore";
  import type { Writable } from "svelte/store";
  import { get } from "svelte/store";
  import { NUMPAD_LAYOUT } from "./playUtils";

  export let inputLength: number = 3;
  export let lotteryType: string = "";
  export let activeLotteryTypesStore: Writable<string[]>;

  let inputValues: string[] = [];
  let currentIndex = 0;
  let inputRefs: HTMLInputElement[] = [];

  $: {
    /* Reset input values when inputLength changes */
    inputValues = Array(inputLength).fill("");
    currentIndex = 0;
    /* Focus on the first input after a short delay to ensure DOM update */
    setTimeout(() => focusInput(0), 0);
  }

  $: isComplete = inputValues.every(Boolean);

  $: if (isComplete) {
    handleSubmit();
  }

  onMount(() => {
    focusInput(currentIndex);
  });

  afterUpdate(() => {
    /* Ensure currentIndex is within bounds หลังจาก inputLength changes */
    if (currentIndex >= inputLength) {
      currentIndex = inputLength - 1;
      focusInput(currentIndex);
    }
  });

  function handleInput(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    const value = target.value.slice(-1);

    if (value && !isNaN(Number(value))) {
      inputValues[index] = value;
      currentIndex = Math.min(index + 1, inputLength - 1);
      focusInput(currentIndex);
    } else {
      target.value = inputValues[index];
    }
  }

  function handleNumpadClick(value: (typeof NUMPAD_LAYOUT)[number]): void {
    if (typeof value === "number" || value === "Rand") {
      if (currentIndex < inputLength) {
        const newValue =
          value === "Rand"
            ? Math.floor(Math.random() * 10).toString()
            : value.toString();
        inputValues[currentIndex] = newValue;
        currentIndex = Math.min(currentIndex + 1, inputLength - 1);
        focusInput(currentIndex);
      }
    } else if (value === "Del") {
      clearInput();
    }
  }

  function clearInput(): void {
    if (currentIndex > 0) {
      currentIndex--;
      inputValues[currentIndex] = "";
      focusInput(currentIndex);
    }
  }

  function handleSubmit(): void {
    const number = inputValues.join("");
    if (lotteryType && !LotteryBetStore.checkBetEntryExists(number, lotteryType)) {
      const activeTypes = get(activeLotteryTypesStore);
      const currentPrefix = lotteryType.split("-")[0];

      activeTypes
        .filter((type) => type.startsWith(currentPrefix))
        .forEach((type) => {
          LotteryBetStore.addBetEntry(type, number);
        });
    }
    resetInputs();
  }

  function resetInputs(): void {
    inputValues = Array(inputLength).fill("");
    currentIndex = 0;
    focusInput(currentIndex);
  }

  function focusInput(index: number): void {
    setTimeout(() => {
      inputRefs[index]?.focus();
    }, 0);
  }
</script>

<div class="bg-white w-full p-4 rounded flex flex-col items-center">
  <h2 class="text-lg sm:text-xl font-semibold text-center mb-4">
    กรุณาระบุตัวเลข ({inputLength} หลัก)
  </h2>
  <div class="flex flex-wrap justify-center space-x-2 mb-4">
    {#each inputValues as value, index (index)}
      <input
        type="text"
        inputmode="numeric"
        maxlength="1"
        class="w-12 h-12 sm:w-14 sm:h-14 border border-gray-300 rounded text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        bind:value={inputValues[index]}
        on:input={(event) => handleInput(event, index)}
        bind:this={inputRefs[index]}
      />
    {/each}
  </div>
  <div
    class="grid grid-cols-3 gap-2 bg-gray-100 p-3 sm:p-4 rounded-lg w-full max-w-[240px] sm:max-w-[280px]"
  >
    {#each NUMPAD_LAYOUT as value (value)}
      <button
        class="aspect-square w-full border rounded text-base sm:text-lg font-medium transition-colors duration-200"
        class:bg-teal-500={value === "Rand"}
        class:bg-red-500={value === "Del"}
        class:bg-white={typeof value === "number"}
        class:text-white={value === "Rand" || value === "Del"}
        class:text-gray-700={typeof value === "number"}
        class:hover:bg-teal-600={value === "Rand"}
        class:hover:bg-red-600={value === "Del"}
        class:hover:bg-gray-50={typeof value === "number"}
        class:active:bg-gray-100={typeof value === "number"}
        on:click={() => handleNumpadClick(value)}
      >
        {value}
      </button>
    {/each}
  </div>
</div>
