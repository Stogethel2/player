<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { AlarmClock } from "lucide-svelte";

  interface LottoResult {
    first?: string;
    three_front?: string[];
    three_back?: string[];
    two?: string[];
  }

  interface LotteryData {
    title: string;
    period_date: string;
    headerImageBackground: string;
    icon: string;
    lotto: LottoResult;
    color: string;
  }

  interface LotteryResults {
    date: string;
    data: LotteryData[];
  }

  let results: LotteryResults | null = null;
  let isLoading = true;
  let error: string | null = null;
  let selectedDate: string = new Date().toISOString().split("T")[0];

  onMount(async () => {
    fetchResults();
  });

  function handleDateChange() {
    fetchResults();
  }

  async function fetchResults() {
    try {
      const response = await fetch("/setting/result.json");
      if (!response.ok) {
        throw new Error("Failed to fetch lottery results");
      }
      results = await response.json();
    } catch (err) {
      error = err instanceof Error ? err.message : "An unknown error occurred";
    } finally {
      isLoading = false;
    }
  }

  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("th-TH", options);
  }

  function formatNumbers(numbers: string[]): string {
    return numbers.join(", ");
  }

  function getBackgroundColorClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      red: "bg-red-500",
      pink: "bg-pink-500",
      blue: "bg-indigo-900",
      // Add more color mappings as needed
    };
    return colorMap[color] || "bg-gray-500"; // Default to gray if color is not found
  }
</script>

<div class="lottery-results max-w-sm mx-auto">
  {#if isLoading}
    <div
      class="card w-full overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg my-8"
    >
      <div class="bg-red-500 rounded-t-xl p-4">
        <p class="text-white">กำลังโหลดผลสลากกินแบ่ง...</p>
      </div>
    </div>
  {:else if error}
    <div
      class="card w-full overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg"
    >
      <div class="bg-red-500 rounded-t-xl p-4">
        <p class="text-white">{error}</p>
      </div>
    </div>
  {:else if results}
    <h2 class="text-3xl font-bold text-center my-8 text-red-700 mb-4">
      ผลสลากกินแบ่ง
    </h2>

    <div class="mb-8 flex justify-center items-center">
      <input
        type="date"
        bind:value={selectedDate}
        on:change={handleDateChange}
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
      />
    </div>

    {#each results.data as lottery, index}
      <div
        in:fly={{ y: 20, duration: 300, delay: index * 100 }}
        out:fade={{ duration: 200 }}
        class="card w-full overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg mb-4"
      >
        <div
          class="{getBackgroundColorClass(
            lottery.color
          )} rounded-t-xl relative p-4"
        >
          <img
            src={lottery.headerImageBackground}
            alt=""
            class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
          />
          <div class="relative z-10 flex items-center justify-between">
            <div class="flex items-center flex-grow">
              <img
                src={lottery.icon}
                alt=""
                class="w-8 h-8 rounded-full object-cover mr-3 border-2 border-white shadow-sm flex-shrink-0"
              />
              <h3
                class="text-sm sm:text-base font-bold text-white truncate mr-2"
              >
                {lottery.title}
              </h3>
            </div>
            <div
              class="flex items-center text-xs sm:text-sm text-white bg-black bg-opacity-20 rounded-full px-2 py-1 whitespace-nowrap"
            >
              <AlarmClock size={14} class="mr-1 flex-shrink-0" />
              <span class="truncate">{formatDate(lottery.period_date)}</span>
            </div>
          </div>
        </div>
        <div class="px-2 md:px-4 py-2 bg-white">
          <div class="grid grid-cols-2 gap-4">
            {#if lottery.lotto.first}
              <div class="col-span-2 bg-red-100 p-3 rounded-lg">
                <p class="text-sm font-medium text-black">รางวัลที่ 1</p>
                <p class="text-3xl font-bold text-red-600">
                  {lottery.lotto.first}
                </p>
              </div>
            {/if}

            {#if lottery.lotto.three_front}
              <div class="bg-red-50 p-3 rounded-lg">
                <p class="text-sm font-medium text-black">เลข 3 ตัวหน้า</p>
                <p class="text-2xl font-bold text-red-600">
                  {formatNumbers(lottery.lotto.three_front)}
                </p>
              </div>
            {/if}

            {#if lottery.lotto.three_back}
              <div class="bg-red-50 p-3 rounded-lg">
                <p class="text-sm font-medium text-black">เลข 3 ตัวท้าย</p>
                <p class="text-2xl font-bold text-red-600">
                  {formatNumbers(lottery.lotto.three_back)}
                </p>
              </div>
            {/if}

            {#if lottery.lotto.two}
              <div class=" bg-red-50 p-3 rounded-lg">
                <p class="text-sm font-medium text-black">เลข 2 ตัวท้าย</p>
                {#each lottery.lotto.two as number}
                  <p class="text-2xl font-bold text-red-600">{number}</p>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  {:else}
    <div
      class="card w-full overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg"
    >
      <div class="bg-red-500 rounded-t-xl p-4">
        <p class="text-white">ไม่พบข้อมูลผลสลากกินแบ่ง</p>
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .card {
    @apply bg-white rounded-xl shadow-md;
  }
  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  .blink {
    animation: blink 1.5s infinite;
  }
  .truncate {
    @apply overflow-hidden text-ellipsis;
  }
</style>
