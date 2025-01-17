<script lang="ts">
  import type { Readable, Writable } from "svelte/store";
  import { get } from "svelte/store";
  import { onMount } from "svelte";
  import { betStore } from "$lib/stores/BetStore";
  import { NUMPAD_LAYOUT } from "$lib/utils/play";
  import type { LottoBetType, Lotto } from "$lib/interface/lotto.types";

  export let digitsCount: number = 3;
  export let selectedBetType: string = "";
  export let activeLotteryTypesStore: Writable<LottoBetType>;


  let digits: string[] = [];
  let activeDigitIndex = 0;
  const defaultAmount = 5;
  let digitInputRefs: HTMLInputElement[] = [];

  $: {
    /* Reset input values when digitsCount changes */
    digits = Array(digitsCount).fill("");
    activeDigitIndex = 0;
    setTimeout(() => focusDigitInput(0), 0);
  }
  $: isNumberComplete = digits.every(Boolean);
  $: if (isNumberComplete) {
    submitNumber();
  }

  onMount(() => {
    focusDigitInput(activeDigitIndex);
  });

  function handleDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const digit = input.value.slice(-1);

    if (digit && !isNaN(Number(digit))) {
      digits[index] = digit;
      activeDigitIndex = Math.min(index + 1, digitsCount - 1);
      focusDigitInput(activeDigitIndex);
    } else {
      input.value = digits[index];
    }
  }

  function generateRandomDigit(): string {
    return Math.floor(Math.random() * 10).toString();
  }

  function handleDigitEntry(digit: string): void {
    if (activeDigitIndex < digitsCount) {
      digits[activeDigitIndex] = digit;
      activeDigitIndex = Math.min(activeDigitIndex + 1, digitsCount - 1);
      focusDigitInput(activeDigitIndex);
    }
  }

  function handleKeypadPress(value: (typeof NUMPAD_LAYOUT)[number]): void {
    switch (value) {
      case 'สุ่ม':
        handleDigitEntry(generateRandomDigit());
        break;
      case 'ลบ':
        deleteLastDigit();
        break;
      default:
        if (typeof value === 'number') {
          handleDigitEntry(value.toString());
        }
    }
  }

  function deleteLastDigit(): void {
    if (activeDigitIndex > 0) {
      activeDigitIndex--;
      digits[activeDigitIndex] = "";
      focusDigitInput(activeDigitIndex);
    }
  }

  function submitNumber(): void {
    const betNumber = digits.join("");
    if (selectedBetType) {
      const activeBetType = get(activeLotteryTypesStore);
      betStore.addBet(activeBetType.id, betNumber, activeBetType, defaultAmount);
    }

    resetDigits();
  }

  function resetDigits(): void {
    digits = Array(digitsCount).fill("");
    activeDigitIndex = 0;
    focusDigitInput(activeDigitIndex);
  }

  function focusDigitInput(index: number): void {
    setTimeout(() => {
      digitInputRefs[index]?.focus();
    }, 0);
  }
</script>

<div class="bg-white w-full p-4 rounded flex flex-col items-center">
  <h2 class="text-lg sm:text-xl font-semibold text-center mb-4">
    กรุณาระบุตัวเลข ({digitsCount} หลัก)
  </h2>
  <div class="flex flex-wrap justify-center space-x-2 mb-4">
    {#each digits as digit, index (index)}
      <input
        type="text"
        inputmode="numeric"
        maxlength="1"
        class="w-12 h-12 sm:w-14 sm:h-14 border border-gray-300 rounded text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        bind:value={digits[index]}
        on:input={(event) => handleDigitInput(event, index)}
        bind:this={digitInputRefs[index]}
      />
    {/each}
  </div>
  <div
    class="grid grid-cols-3 gap-2 bg-gray-100 p-3 sm:p-4 rounded-lg w-full max-w-[240px] sm:max-w-[280px]"
  >
    {#each NUMPAD_LAYOUT as value (value)}
      <button
        class="aspect-square w-full border rounded text-base sm:text-lg font-medium transition-colors duration-200"
        class:bg-teal-500={value === "สุ่ม"}
        class:bg-red-500={value === "ลบ"}
        class:bg-white={typeof value === "number"}
        class:text-white={value === "สุ่ม" || value === "ลบ"}
        class:text-gray-700={typeof value === "number"}
        class:hover:bg-teal-600={value === "สุ่ม"}
        class:hover:bg-red-600={value === "ลบ"}
        class:hover:bg-gray-50={typeof value === "number"}
        class:active:bg-gray-100={typeof value === "number"}
        on:click={() => handleKeypadPress(value)}
      >
        {value}
      </button>
    {/each}
  </div>
</div>
