<script lang="ts">
  import { History, HandCoins, ChevronUp } from "lucide-svelte";

  type TabType = "history" | "rate";

  let activeTab = $state<TabType>("history");
  let isMenuVisible = $state(true);

  function setActiveTab(tab: TabType) {
    activeTab = tab;
  }

  function toggleMenuVisibility() {
    isMenuVisible = !isMenuVisible;
  }

  let isHistoryActive = $derived(activeTab === "history");
  let isRateActive = $derived(activeTab === "rate");
</script>

<template>
  <div class="my-4">
    <button
      class="text-white inline-flex items-center p-2 bg-teal-500 rounded-t-lg cursor-pointer text-xs sm:text-sm"
      onclick={toggleMenuVisibility}
    >
      <p>ToggleMenu_1</p>
      <div class={`rotate-animation ml-2 ${isMenuVisible ? "rotate-180" : ""}`}>
        <ChevronUp size={16} strokeWidth={3} />
      </div>
    </button>

    {#if isMenuVisible}
      <div
        class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-white border border-teal-300 rounded-b-lg overflow-hidden"
      >
        <div class="flex flex-row header">
          <button
            class="flex items-center justify-center basis-1/2 text-center cursor-pointer p-2 text-sm transition-colors duration-200 ease-in-out"
            class:active={isHistoryActive}
            onclick={() => setActiveTab("history")}
            aria-pressed={isHistoryActive}
          >
            <span class="mr-2">History</span>
            <History
              size={18}
              color={isHistoryActive ? "#facc15" : "#14b8a6"}
            />
          </button>
          <button
            class="flex items-center justify-center basis-1/2 text-center cursor-pointer p-2 text-sm transition-colors duration-200 ease-in-out"
            class:active={isRateActive}
            onclick={() => setActiveTab("rate")}
            aria-pressed={isRateActive}
          >
            <span class="mr-2">Rate</span>
            <HandCoins size={18} color={isRateActive ? "#facc15" : "#14b8a6"} />
          </button>
        </div>

        <div class="p-1">
          {#if isHistoryActive}
            <div class="listHistory">
              <div class="grid grid-cols-5 rounded-tr-lg bg-teal-100">
                <div class="p-2 text-sm text-center text-teal-700">Seq</div>
                <div class="p-2 text-sm text-center text-teal-700">
                  DateTime
                </div>
                <div class="p-2 text-sm text-center text-teal-700">Numb</div>
                <div class="p-2 text-sm text-center text-teal-700">Type</div>
                <div class="p-2 text-sm text-center text-teal-700">Status</div>
              </div>
              <div class="rounded-b-lg border-b border-l border-r">
                <div class="grid grid-cols-5 border-t">
                  <div class="p-1.5 text-sm text-center border-r">1</div>
                  <div class="p-1.5 text-sm text-center border-r">
                    01/07/2024
                  </div>
                  <div class="p-1.5 text-sm text-center border-r">
                    Lorem, ipsum.
                  </div>
                  <div class="p-1.5 text-sm text-center border-r">Lorem.</div>
                  <div class="p-1.5 text-sm text-center">Success</div>
                </div>
              </div>
            </div>
          {:else if isRateActive}
            <div class="listPayRate">
              <div class="grid grid-cols-3 rounded-tr-lg bg-teal-100">
                <div class="p-2 text-sm text-center text-teal-700">Type</div>
                <div class="p-2 text-sm text-center text-teal-700">Reward</div>
                <div class="p-2 text-sm text-center text-teal-700">
                  Discount
                </div>
              </div>
              <div class="rounded-b-lg border-b border-l border-r">
                <div class="grid grid-cols-3 border-t">
                  <div class="p-1.5 text-sm text-center border-r">
                    Lorem, ipsum.
                  </div>
                  <div class="p-1.5 text-sm text-center border-r">
                    50,000.00
                  </div>
                  <div class="p-1.5 text-sm text-center border-r">0%</div>
                </div>
                <div class="grid grid-cols-3 border-t">
                  <div class="p-1.5 text-sm text-center border-r">
                    Lorem, ipsum dolor.
                  </div>
                  <div class="p-1.5 text-sm text-center border-r">
                    25,000.00
                  </div>
                  <div class="p-1.5 text-sm text-center border-r">0%</div>
                </div>
                <div class="grid grid-cols-3 border-t">
                  <div class="p-1.5 text-sm text-center border-r">
                    Lorem, ipsum.
                  </div>
                  <div class="p-1.5 text-sm text-center border-r">5,000.00</div>
                  <div class="p-1.5 text-sm text-center border-r">0%</div>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</template>
