<script lang="ts">
  import type { Writable } from "svelte/store";
  import { get } from "svelte/store";
  import { onMount } from "svelte";
  import { betStore } from "$lib/stores/BetStore";
  import { NUMPAD_LAYOUT } from "$lib/utils/play-utils";
  import type { LottoBetType } from "$lib/interface/lotto.types";

  export let digitsCount: number = 3;
  export let selectedBetType: string = "";
  export let activeLotteryTypesStore: Writable<LottoBetType | undefined>;
  export let activeLotteryTypesArrayStore:
    | Writable<LottoBetType[]>
    | undefined = undefined;

  let digits: string[] = [];
  let activeDigitIndex = 0;
  let digitInputRefs: HTMLInputElement[] = [];

  const DEFAULT_AMOUNT = 1;

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
      case "สุ่ม":
        handleDigitEntry(generateRandomDigit());
        break;
      case "ลบ":
        deleteLastDigit();
        break;
      default:
        if (typeof value === "number") {
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
      const activeBetTypes = activeLotteryTypesArrayStore
        ? get(activeLotteryTypesArrayStore)
        : [];

      if (activeBetTypes.length > 0) {
        // Add bet for each selected bet type
        activeBetTypes.forEach((betType) => {
          betStore.addBet(betType.id, betNumber, betType, DEFAULT_AMOUNT);
        });
      } else {
        const activeBetType = get(activeLotteryTypesStore);
        if (activeBetType) {
          betStore.addBet(
            activeBetType.id,
            betNumber,
            activeBetType,
            DEFAULT_AMOUNT
          );
        }
      }
    }

    resetDigits();
  }

  function resetDigits(): void {
    digits = Array(digitsCount).fill("");
    activeDigitIndex = 0;
    isNumberComplete = false;
    focusDigitInput(activeDigitIndex);
  }

  function focusDigitInput(index: number): void {
    setTimeout(() => {
      digitInputRefs[index]?.focus();
    }, 0);
  }
</script>

<div class="bg-transparent w-full p-3 rounded flex flex-col items-center">
  <h2 class="text-md sm:text-lg font-semibold text-center mb-4 text-white">
    กรุณาระบุตัวเลข ({digitsCount} หลัก)
  </h2>
  <div class="flex flex-wrap justify-center space-x-2 mb-4">
    {#each digits as digit, index (index)}
      <input
        type="number"
        inputmode="numeric"
        maxlength="1"
        pattern="[0-9]"
        class="input w-12 h-12 sm:w-14 sm:h-14 text-center text-lg mb-2 border-gold no-spinner"
        bind:value={digits[index]}
        on:input={(event) => handleDigitInput(event, index)}
        bind:this={digitInputRefs[index]}
      />
    {/each}
  </div>
  <div
    class="grid grid-cols-3 gap-2 bg-transparent sm:p-4 rounded-lg w-full max-w-[240px] sm:max-w-[280px]"
  >
    {#each NUMPAD_LAYOUT as value (value)}
      <button
        class="btn aspect-square w-full text-base sm:text-lg"
        class:bg-teal-500={value === "สุ่ม"}
        class:bg-red-500={value === "ลบ"}
        class:bg-gray-700={typeof value === "number"}
        class:text-white={value === "สุ่ม" || value === "ลบ"}
        class:active:bg-gray-100={typeof value === "number"}
        on:click={() => handleKeypadPress(value)}
      >
        {value}
      </button>
    {/each}
  </div>
</div>

<style>
  .no-spinner::-webkit-inner-spin-button,
  .no-spinner::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
