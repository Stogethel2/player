<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { writable, derived } from "svelte/store";
    import { goto } from "$app/navigation";
    import type { LottoRound, LottoBetType } from "$lib/interface/lotto.types";
    import type { Order } from "$lib/interface/order.types";
    import { betStore } from "$lib/stores/BetStore";

    /* Utils */
    import { togglePlayMode } from "$lib/utils/play";
    import { formatDateTime } from "$lib/utils/dateTime";
    import { lottoRoundApi } from "$lib";

    import {
        ChevronLeft,
        ChevronRight,
        CircleAlert,
        CircleHelp,
    } from "lucide-svelte";

    /* Components */
    import BetAmountModal from "./BetAmountModal.svelte";
    import LotteryTypeFilter from "./LotteryTypeFilter.svelte";
    import NumberPad from "./NumberPad.svelte";
    import PaymentSummary from "./ConfirmPayment.svelte";
    import SelectedNumbers from "./SelectedNumbers.svelte";

    /* Timer store and state */
    const timeRemaining = writable(0);
    let timerInterval: ReturnType<typeof setInterval>;
    let displayTime = "";
    let timerIntervalTarget: ReturnType<typeof setInterval>;

    $: {
        const remainingMinutes = Math.floor($timeRemaining / 60);
        const remainingSeconds = $timeRemaining % 60;
        displayTime = `${remainingMinutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }

    /* Main state */
    let selectedPlayMode = true;
    let showBetModal = false;
    let showPaymentSummary = false;
    let order: Order | null = null;
    let lotteryRound: LottoRound | null = null;
    let lotto_name = "";

    let end_bet_min = 0;

    const selectedBetTypeStore = writable<LottoBetType>();
    const selectedBetType = derived(
        selectedBetTypeStore,
        ($selectedBetTypeStore) => $selectedBetTypeStore?.bet_type || ""
    );
    const selectedDigitsCount = derived(
        selectedBetTypeStore,
        ($selectedBetTypeStore) => $selectedBetTypeStore?.bet_digit || 3
    );

    function startTimer(seconds: number) {
        timeRemaining.set(seconds);
        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            timeRemaining.update((time) => {
                if (time <= 0) {
                    clearInterval(timerInterval);
                    return 0;
                }
                return time - 1;
            });
        }, 1000);
    }

    let dateRun: string = "";

    // ตัวแปรสำหรับเวลา
    let days,
        hours,
        minutes,
        seconds = 0;

    let hoursToStr,
        minutesToStr,
        secondsToStr = "";

    // คำนวณเวลาที่เหลือ
    function calculateTimeLeft(targetDate: string, endBetMin: number): string {
        let now = new Date();
        let date = new Date(targetDate.replace("T", " ").split(".")[0]);

        let end_bet_min = new Date(date.getTime() - endBetMin * 60 * 1000);
        let difference = Number(end_bet_min) - Number(now);

        if (difference > 0) {
            days = Math.floor(difference / (1000 * 60 * 60 * 24));
            hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            minutes = Math.floor((difference / (1000 * 60)) % 60);
            seconds = Math.floor((difference / 1000) % 60);
            hoursToStr = hours.toString();
            minutesToStr = minutes.toString();
            secondsToStr = seconds.toString();
            if (hoursToStr.length == 1) {
                hoursToStr = "0" + hoursToStr;
            }
            if (minutesToStr.length == 1) {
                minutesToStr = "0" + minutesToStr;
            }
            if (secondsToStr.length == 1) {
                secondsToStr = "0" + secondsToStr;
            }
        } else {
            // ตั้งค่าทุกค่าเป็นศูนย์เมื่อถึงเวลาที่กำหนด
            days = 0;
            hoursToStr = minutesToStr = secondsToStr = "00";
            goto("/seamless");
        }
        return `${days} วัน ${hoursToStr}:${minutesToStr}:${secondsToStr}`;
    }

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const lottoId = urlParams.get("lottoId");

        if (!lottoId) return;
        lotteryRound = await lottoRoundApi.getLottoRoundById(lottoId);
        end_bet_min = lotteryRound.lotto.default_close_bet_minutes;
        lotto_name = lotteryRound.lotto.lotto_name;
        let targetDate = lotteryRound.round_date;

        if (lotteryRound && end_bet_min >= 0) {
            startTimer(300); // Start 5 minute countdown
            timerIntervalTarget = setInterval(() => {
                dateRun = calculateTimeLeft(targetDate, end_bet_min);
            }, 1000);
        }
    });

    onDestroy(() => {
        clearInterval(timerInterval);
        if (timerIntervalTarget) {
            clearInterval(timerIntervalTarget);
            // console.log('Timer cleared on component destroy');
        }
    });

    function handleBetTypeChange(event: CustomEvent) {
        const selectedBetType = event.detail.selectedBetType as LottoBetType;
        selectedBetTypeStore.set(selectedBetType);
    }

    function handlePaymentCancel() {
        showPaymentSummary = false;
    }

    function setPlayMode(mode: "custom" | "selector") {
        selectedPlayMode = togglePlayMode(selectedPlayMode, mode);
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

{#if lotteryRound}
    <div class="flex justify-center px-4 sm:px-6 lg:px-8">
        <div class="bg-white shadow-lg rounded-lg my-4 w-full max-w-7xl">
            <!-- Navigation -->
            <button
                class="bg-gradient-to-r from-red-900 to-red-700 rounded-t-md mb-4 p-2 w-full"
                on:click={navigateBack}
            >
                <div class="text-amber-300 font-bold text-sm flex items-center">
                    <ChevronLeft size={20} strokeWidth={3} class="mr-2" />
                    <p>Back</p>
                </div>
            </button>

            <!-- Header -->
            <div class="p-2">
                <div
                    class="flex flex-col sm:flex-row justify-between border-b pb-4"
                >
                    <div class="flex flex-wrap items-center mb-2 sm:mb-0">
                        <div
                            class="flex flex-row items-center justify-between md:justify-start"
                        >
                            <div class="flex flex-row items-center">
                                <img
                                    src={lotteryRound.lotto.lotto_image}
                                    alt=""
                                    class="w-8 h-8"
                                />

                                <p
                                    class="text-xl sm:text-2xl font-bold mx-2 sm:mx-4 pr-4"
                                >
                                    {lotteryRound.lotto.lotto_name}
                                </p>
                            </div>

                            <div
                                class="flex items-center justify-center bg-amber-300 p-1 sm:p-1.5 text-xs sm:text-sm rounded-full"
                            >
                                <div>
                                    <CircleAlert size={16} />
                                </div>
                                <div class="mx-1">
                                    {formatDateTime(
                                        lotteryRound.round_date,
                                        end_bet_min
                                    )}
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-row justify-end">
                            <p
                                class="text-xs sm:text-sm blink mt-2 md:mt-0 md:ml-2 text-right"
                            >
                                เวลาเดิมพันเหลือ {dateRun}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center text-gray-500 mt-4">
                        <CircleHelp size={16} />
                        <p class="text-xs sm:text-sm mx-1">Rules</p>
                        <ChevronRight size={16} />
                    </div>
                </div>

                <!-- Lotto Bet Type Filter -->
                <LotteryTypeFilter
                    selectedBetType={$selectedBetTypeStore}
                    availableBetTypes={lotteryRound.lottoBetTypes}
                    on:typesChanged={handleBetTypeChange}
                />

                {#if $selectedBetType}
                    <!-- Play Mode Tabs -->
                    <div class="flex border-l relative justify-start mt-4">
                        <button
                            class="flex items-center justify-center text-center cursor-pointer py-2 px-3 sm:px-4 text-xs sm:text-sm border-r border-t relative border-b {selectedPlayMode
                                ? 'border-b-white'
                                : ''}"
                            on:click={() => setPlayMode("custom")}
                        >
                            <div
                                class="absolute bg-teal-600 h-1 -top-1 {selectedPlayMode
                                    ? 'block'
                                    : 'hidden'}"
                                style="width: calc(100% + 2px);"
                            ></div>
                            <p>กดเลขเอง</p>
                        </button>
                    </div>

                    <!-- Play Area -->
                    {#if selectedBetTypeStore !== null}
                        <div class="p-2 flex w-full">
                            <div class="select-list w-2/6 border-r">
                                <SelectedNumbers
                                    availableBetTypes={lotteryRound.lottoBetTypes}
                                />
                            </div>
                            <div
                                class="numpad w-4/6 flex flex-col items-center"
                            >
                                <NumberPad
                                    digitsCount={$selectedDigitsCount}
                                    selectedBetType={$selectedBetType}
                                    activeLotteryTypesStore={selectedBetTypeStore}
                                />
                            </div>
                        </div>

                        <div
                            class="flex justify-center items-center mt-4 space-x-1 mb-6"
                        >
                            <button
                                on:click={betStore.clearAll}
                                class="bg-red-500 text-white px-6 sm:px-8 py-2 rounded-lg text-sm sm:text-base"
                            >
                                ลบทั้งหมด
                            </button>
                            <button
                                on:click={openBetModal}
                                class="bg-green-500 text-white px-6 sm:px-8 py-2 rounded-lg text-sm sm:text-base"
                                disabled={enterPriceButton}
                            >
                              ใส่ราคา
                            </button>
                        </div>
                    {:else}
                        <div
                            class="p-8 text-center text-xs sm:text-sm text-gray-500"
                        >
                            <p class="text-xl font-semibold mb-2">
                                เงื่อนไขการแทง
                            </p>
                            <p class="text-lg">แทงขั้นต่ำ : 1.00</p>
                            <p class="text-lg">
                                แทงสูงสุดต่อครั้ง : 2000 / โพย
                            </p>
                        </div>
                    {/if}
                {/if}
            </div>
        </div>
    </div>
{/if}

{#if showBetModal}
    <BetAmountModal on:orderCreated={closeBetModal} on:cancel={closeBetModal} />
{/if}

{#if showPaymentSummary && order}
    <PaymentSummary {order} on:cancel={handlePaymentCancel} />
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

    button:disabled {
      background-color: #9ae6b4;
      cursor: not-allowed;
      opacity: 0.7;
    }
</style>
