<script lang="ts">
  import {
    ChevronRight,
    ChevronLeft,
    CircleAlert,
    CircleHelp,
  } from "lucide-svelte";
  import BetAmountModal from "./BetAmountModal.svelte";
  import SelectedNumbers from "./selected-numbers.svelte";
  import NumberPad from "./NumberPad.svelte";
  import LotteryTypeFilter from "./LotteryTypeFilter.svelte";
  import LotteryOptionFilter from "./lot-optional-filter.svelte";
  import { LotteryBetStore } from "./LotteryBetStore";
  import { goto } from "$app/navigation";
  import { writable } from "svelte/store";
  import { handleLotteryTypesChanged, togglePlayMode } from "./playUtils";

  let isCustomPlay = true;
  let showPriceModal = false;
  let currentLotteryType = "";
  let currentInputLength = 3; // Default input length

  let activeLotteryTypes: string[] = [];
  let activeLotteryOptions: string[] = [];

  const activeLotteryTypesStore = writable(activeLotteryTypes);

  function onLotteryTypesChanged(event: CustomEvent) {
    const result = handleLotteryTypesChanged(event, activeLotteryTypesStore);
    currentLotteryType = result.currentLotteryType;
    currentInputLength = result.currentInputLength;
    activeLotteryTypes = event.detail.activeTypes;
  }

  function handleLotteryOptionsChanged(event: CustomEvent) {
    activeLotteryOptions = event.detail.activeLotteryTypes;
  }

  function togglePlayModeWrapper(mode: "custom" | "selector") {
    isCustomPlay = togglePlayMode(isCustomPlay, mode);
  }

  function openPriceModal() {
    showPriceModal = true;
  }

  function closePriceModal() {
    showPriceModal = false;
  }

  function navigateToHome() {
    goto("/");
  }
</script>

<div class="flex justify-center px-4 sm:px-6 lg:px-8">
  <div class="bg-white shadow-lg rounded-lg my-4 w-full max-w-7xl">
    <!-- Navigation -->
    <button
      class="bg-gradient-to-r from-red-900 to-red-700 rounded-t-md mb-4 p-2 w-full"
      on:click={navigateToHome}
    >
      <div class="text-amber-300 font-bold text-sm flex items-center">
        <ChevronLeft size={20} strokeWidth={3} class="mr-2" />
        <p>Page 1 / Header-title</p>
      </div>
    </button>

    <!-- Header -->
    <div class="p-2">
      <div class="flex flex-col sm:flex-row justify-between border-b pb-4">
        <div class="flex flex-wrap items-center mb-2 sm:mb-0">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADkSURBVHgB7ditDQJBEIbhbyb82JOAQpOQ3FksGDBoJBRAIKEECqCDU/ijAuiAKwGJPAEJIG7YtdgRjJingje72U1mCEHeSfttolwIKQQJ/oxAxVvq7fJe3ijGtZiuFsJ+VB+RjJtEB4NxURJvlQmYwygBUoZtifVANHrTMSyjx/MlMMz8FXuglgdq0Wa9N/2KaTiY+Tej4YFaHqjlgVoeqOWBWo3xZATLfCbR8kAtD9Si82pneyY5djP/ZjQ4LIQrGMYkKGGWnEKgLE2eYmhiwYYXYdXPtWShtoAFISwc2iU2xbYvg0pBsBYLLg4AAAAASUVORK5CYII="
            alt=""
            class="w-8 h-8"
          />
          <p class="text-xl sm:text-2xl font-bold mx-2 sm:mx-4">Header-title</p>
          <div
            class="flex items-center bg-amber-300 p-1 sm:p-1.5 text-xs sm:text-sm rounded-full mx-1 sm:mx-2"
          >
            <div>
              <CircleAlert size={16} />
            </div>
            <div class="mx-1">01.07.2024</div>
          </div>
          <p class="text-xs sm:text-sm blink">DateTime Set</p>
        </div>
        <div class="flex items-center text-gray-500 mt-4">
          <CircleHelp size={16} />
          <p class="text-xs sm:text-sm mx-1">Rules</p>
          <ChevronRight size={16} />
        </div>
      </div>

      <!-- Lottery Type Filter -->
      <LotteryTypeFilter
        initialActiveTypes={activeLotteryTypes}
        on:typesChanged={onLotteryTypesChanged}
      />

      <!-- Lottery Option Filter -->
      <!-- <LotteryOptionFilter
        initialActiveTags={activeLotteryOptions}
        on:tagsChanged={handleLotteryOptionsChanged}
      /> -->

      <!-- Play Mode Tabs -->
      <div class="flex border-l relative justify-start mt-4">
        <button
          class="flex items-center justify-center text-center cursor-pointer py-2 px-3 sm:px-4 text-xs sm:text-sm border-r border-t relative border-b {isCustomPlay
            ? 'border-b-white'
            : ''}"
          on:click={() => togglePlayModeWrapper("custom")}
        >
          <div
            class="absolute bg-teal-600 h-1 -top-1 {isCustomPlay
              ? 'block'
              : 'hidden'}"
            style="width: calc(100% + 2px);"
          ></div>
          <p>กดเลขเอง</p>
        </button>
  
      </div>

      <!-- Play Area -->
      {#if activeLotteryTypes.length > 0}
        <div class="p-2 flex w-full">
          <div class="select-list w-2/6 border-r">
            <SelectedNumbers />
          </div>
          <div class="numpad w-4/6 flex flex-col items-center">
            <NumberPad
              inputLength={currentInputLength}
              lotteryType={currentLotteryType}
              {activeLotteryTypesStore}
            />
          </div>
        </div>

        <div class="flex justify-center items-center mt-4 space-x-1 mb-6">
          <button
            on:click={LotteryBetStore.clear}
            class="bg-red-500 text-white px-6 sm:px-8 py-2 rounded-lg text-sm sm:text-base"
          >
            ลบทั้งหมด
          </button>
          <button
            on:click={openPriceModal}
            class="bg-green-500 text-white px-6 sm:px-8 py-2 rounded-lg text-sm sm:text-base"
          >
            ใส่ราคา
          </button>
        </div>
      {:else}
        <div class="p-8 text-center text-xs sm:text-sm text-gray-500">
          <p class="text-xl font-semibold mb-2">เงื่อนไขการแทง</p>
          <p class="text-lg">แทงขั้นต่ำ : 1.00</p>
          <p class="text-lg">แทงสูงสุดต่อครั้ง : 2000 / โพย</p>
        </div>
      {/if}
    </div>
  </div>
</div>

{#if showPriceModal}
  <BetAmountModal on:submit={closePriceModal} on:cancel={closePriceModal} />
{/if}

<style lang="postcss">
  @keyframes blink {
    0%,
    100% {
      @apply text-gray-500;
    }
    50% {
      color: red;
    }
  }

  .blink {
    @apply font-bold;
    animation: blink 1s infinite;
  }
</style>
