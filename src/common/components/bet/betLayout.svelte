<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { writable, derived } from "svelte/store";
  import { goto } from "$app/navigation";
  import type { LottoRound, LottoBetType } from "$lib/interface/lotto.types";
  import type { Order } from "$lib/interface/order.types";
  import { betStore } from "$lib/stores/BetStore";

  /* Utils */
  import { togglePlayMode } from "$lib/utils/play-utils";
  import {
    calculateTimeLeft,
    formatDateTime,
  } from "$lib/utils/date-time.utils";
  import { lottoRoundApi } from "$lib";
  import { userAuth } from "$lib/utils/user-auth.utils";

  import { ChevronLeft, CircleAlert } from "lucide-svelte";

  /* Components */
  import BetAmountModal from "./betAmountModal.svelte";
  import LottoRulesModal from "./lottoRulesModal.svelte";
  import LottoNumberBlock from "./lottoNumberBlockModal.svelte";
  import LotteryTypeFilter from "./lotteryTypeFilter.svelte";
  import NumberPad from "./numberPad.svelte";
  import PaymentSummary from "./confirmPayment.svelte";
  import SelectedNumbers from "./selectedNumbers.svelte";

  /* Countdown state */
  let timerIntervalTarget: ReturnType<typeof setInterval>;

  /* Main state */
  let isLoading = true;
  let initializationError: string | null = null;
  let selectedPlayMode = true;
  let showBetModal = false;
  let showLottoRuleModal = false;
  let showLottoNumberBlock = false;
  let showPaymentSummary = false;
  let order: Order | null = null;
  let lotteryRound: LottoRound | null = null;

  let end_bet_min = 0;
  let dateRun: string = "";

  const selectedBetTypeStore = writable<LottoBetType | undefined>(undefined);
  const selectedBetTypesStore = writable<LottoBetType[]>([]);
  const selectedBetType = derived(
    selectedBetTypeStore,
    ($selectedBetTypeStore) => $selectedBetTypeStore?.bet_type || ""
  );
  const selectedDigitsCount = derived(
    selectedBetTypeStore,
    ($selectedBetTypeStore) => $selectedBetTypeStore?.bet_digit || 3
  );


  onMount(async () => {
    isLoading = true;
    initializationError = null;
    try {
      userAuth();

      const urlParams = new URLSearchParams(window.location.search);
      const lottoId = urlParams.get("lottoId");

      if (!lottoId) {
        initializationError = "ไม่พบรหัสรอบหวย (Lotto ID not found).";
        isLoading = false;
        return;
      }

      const roundData = await lottoRoundApi.getLottoRoundById(lottoId);
      if (!roundData) {
        initializationError = `ไม่สามารถโหลดข้อมูลรอบหวยสำหรับ ID: ${lottoId} (Could not load lottery round data).`;
        isLoading = false;
        return;
      }
      lotteryRound = roundData;
      end_bet_min = lotteryRound.lotto.default_close_bet_minutes;
      let targetDate = lotteryRound.round_date;

      if (lotteryRound && end_bet_min >= 0) {
        timerIntervalTarget = setInterval(() => {
          dateRun = calculateTimeLeft(targetDate, end_bet_min).formattedText;
        }, 1000);
      }
    } catch (error) {
      console.error("Error during component initialization:", error);
      initializationError =
        "เกิดข้อผิดพลาดในการโหลดข้อมูล (An error occurred while loading data).";
    } finally {
      isLoading = false;
    }
  });

  onDestroy(() => {
    clearInterval(timerIntervalTarget);
  });

  function handleBetTypeChange(event: CustomEvent) {
    const selectedBetType = event.detail.selectedBetType as LottoBetType;
    const selectedBetTypes = event.detail.selectedBetTypes as LottoBetType[];

    selectedBetTypesStore.set(selectedBetTypes);

    if (event.detail.isActive) {
      selectedBetTypeStore.set(selectedBetType);
    } else {
      if (selectedBetTypes.length > 0) {
        selectedBetTypeStore.set(selectedBetTypes[0]);
      } else {
        selectedBetTypeStore.update(() => undefined);
      }
    }
  }

  function handlePaymentCancel() {
    showPaymentSummary = false;
  }

  function setPlayMode(mode: "custom" | "selector") {
    selectedPlayMode = togglePlayMode(selectedPlayMode, mode);
  }

  function openLottoRuleModal() {
    showLottoRuleModal = true;
  }

  function closeLottoRuleModal() {
    showLottoRuleModal = false;
  }

  function openLottoNumberBlockModal() {
    showLottoNumberBlock = true;
  }

  function closeLottoNumberBlockModal() {
    showLottoNumberBlock = false;
  }

  function openBetModal() {
    showBetModal = true;
  }

  function closeBetModal(event: CustomEvent) {
    showBetModal = false;
    showPaymentSummary = true;
    order = event.detail;
  }

  function navigateBack() {
    goto("/seamless");
  }

  const betListSummary = derived(betStore, () => {
    const summary = betStore.getSummary();

    return {
      totalBet: summary.totals.total_bet,
    };
  });

  $: ({ totalBet } = $betListSummary);
  $: enterPriceButton = totalBet == 0;
</script>

<div
  class="w-full mx-auto max-w-7xl bg-theme min-h-screen flex flex-col items-center"
>
  {#if isLoading}
    <p class="text-white text-xl mt-8">กำลังโหลดข้อมูล...</p>
  {:else if initializationError}
    <div class="text-center p-8">
      <CircleAlert size={48} class="mx-auto mb-4 text-red-500" />
      <p class="text-red-400 text-xl mb-2">เกิดข้อผิดพลาด</p>
      <p class="text-gray-300 mb-6">{initializationError}</p>
      <button class="btn-gradient p-2 text-sm" on:click={navigateBack}>
        กลับไปหน้าหลัก
      </button>
    </div>
  {:else if lotteryRound}
    <div class="flex justify-center px-4 sm:px-6 lg:px-8 mb-20 lg:mb-4 w-full">
      <div
        class="bg-transparent border border-gold shadow-lg rounded-lg mt-4 w-full max-w-7xl"
      >
        <!-- Navigation -->
        <button
          class="btn-gradient rounded-t-md mb-4 p-2 w-full"
          on:click={navigateBack}
        >
          <div class="text-black font-bold text-sm flex items-center">
            <ChevronLeft size={20} strokeWidth={3} class="mr-2" />
            <p>Back</p>
          </div>
        </button>

        <!-- Header -->
        <div class="p-2 mb-4">
          <div
            class="flex flex-col sm:flex-row justify-between border-b pb-4 border-gold"
          >
            <div class="flex flex-wrap items-center mb-2 sm:mb-0 w-full">
              <div class="flex flex-row items-center justify-between w-full">
                <div class="flex flex-row items-center">
                  <img
                    src={lotteryRound.lotto.lotto_image}
                    alt=""
                    class="w-8 h-8"
                  />

                  <p
                    class="text-xl sm:text-2xl font-bold mx-2 sm:mx-4 pr-4 text-white"
                  >
                    {lotteryRound.lotto.lotto_name}
                  </p>
                </div>

                <div
                  class="flex items-center justify-center bg-amber-300 p-1 sm:p-1.5 text-xs sm:text-sm rounded-full text-black"
                >
                  <div>
                    <CircleAlert size={16} />
                  </div>
                  <div class="mx-1">
                    {formatDateTime(lotteryRound.round_date, end_bet_min)}
                  </div>
                </div>
              </div>
              <div class="flex flex-row items-center justify-between w-full">
                <p class="text-sm blink mt-2 md:mt-0">
                  เวลาซื้อเหลือ {dateRun}
                </p>

                <div class="flex gap-2 mt-1">
                  <button
                    class="btn-gradient px-4 py-1 !rounded-full text-xs"
                    on:click={openLottoNumberBlockModal}
                  >
                    <div class="text-black font-bold flex items-center">
                      <p>รายเลขอั้น</p>
                    </div>
                  </button>

                  <button
                    class="btn-gradient px-4 py-1 !rounded-full text-xs"
                    on:click={openLottoRuleModal}
                  >
                    <div class="text-black font-bold flex items-center">
                      <p>กติกา</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Lotto Bet Type Filter -->
          <LotteryTypeFilter
            selectedBetType={$selectedBetTypeStore}
            availableBetTypes={lotteryRound.lottoBetTypes}
            on:typesChanged={handleBetTypeChange}
          />

          <!-- Play Mode Tabs -->
          <div class="flex relative justify-start mt-4">
            <button
              class="btn-gradient flex items-center justify-center text-center cursor-pointer py-2 px-3 sm:px-4 text-xs sm:text-sm border-r border-t relative border-b {selectedPlayMode
                ? 'border-b-white'
                : ''}"
              on:click={() => setPlayMode("custom")}
            >
              <div
                class="absolute 0 h-1 -top-1 {selectedPlayMode
                  ? 'block'
                  : 'hidden'}"
                style="width: calc(100% + 2px);"
              ></div>
              <p>กดเลขเอง</p>
            </button>
          </div>

          <!-- Play Area -->
          <div class="py-2 flex w-full">
            <div class="select-list w-2/6 border-r">
              <SelectedNumbers availableBetTypes={lotteryRound.lottoBetTypes} />
            </div>
            {#if $selectedBetTypeStore}
              <div class="numpad w-4/6 flex flex-col items-center">
                <NumberPad
                  digitsCount={$selectedDigitsCount}
                  selectedBetType={$selectedBetType}
                  activeLotteryTypesStore={selectedBetTypeStore}
                  activeLotteryTypesArrayStore={selectedBetTypesStore}
                />
              </div>
            {:else}
              <div class="w-4/6 flex flex-col items-center justify-center">
                <p class="text-white text-center">กรุณาเลือกประเภทการเดิมพัน</p>
              </div>
            {/if}
          </div>

          <div class="flex justify-center items-center mt-4 space-x-1">
            <button
              on:click={betStore.clearAll}
              class="btn bg-red-500 text-white px-6 sm:px-8 py-2 rounded-lg text-sm sm:text-base"
            >
              ลบทั้งหมด
            </button>
            <button
              on:click={openBetModal}
              class="btn-gradient px-6 sm:px-8 py-2 rounded-lg text-sm sm:text-base"
              disabled={enterPriceButton}
            >
              ใส่ราคา
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Modals: Only render if not loading and no init error, and show flag is true -->
  {#if !isLoading && !initializationError}
    {#if showBetModal}
      <BetAmountModal
        on:orderCreated={closeBetModal}
        on:cancel={closeBetModal}
      />
    {/if}

    {#if showLottoRuleModal}
      <LottoRulesModal on:close={closeLottoRuleModal} />
    {/if}

    {#if showLottoNumberBlock}
      <LottoNumberBlock on:close={closeLottoNumberBlockModal} />
    {/if}

    {#if showPaymentSummary && order}
      <PaymentSummary {order} on:cancel={handlePaymentCancel} />
    {/if}
  {/if}
</div>

<style lang="postcss">
  button:disabled {
    background: silver !important;
    cursor: not-allowed;
    opacity: 0.9;
  }
</style>
