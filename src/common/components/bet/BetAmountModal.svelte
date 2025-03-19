<script lang="ts">
    import { betCalculateApi } from "$lib/api/endpoint/betCalculate";
    import { betStore } from "$lib/stores/BetStore";
    import { calculateBetSummary } from "$lib/utils/betCalculations";
    import { createEventDispatcher, onMount } from "svelte";
    import { derived } from "svelte/store";
    import BetSummaryTable from "./BetSummary/BetSummaryTable.svelte";
    import type {
        BetGroupSummary,
        BetSummary,
        BetTypeGroup,
    } from "$lib/interface/bet.types";
    import type { Order } from "$lib/interface/order.types";
    import Loading from "../loading/loading.svelte";
    import ButtonLoading from "../loading/buttonLoading.svelte";

    // wallet
    import { walletApi } from "$lib/api/endpoint/balance";

    export const QUICK_BET_AMOUNTS = [5, 10, 20, 50, 100] as const;
    export const BET_CONFIG = {
        MIN_BET: 1.0,
        MAX_BET: 2000,
    } as const;
    export let availableBalance = 0;

    let betCalculationResult: BetSummary;
    let isLoading = true;

    const dispatch = createEventDispatcher();

    /* Get bet summary from store */
    $: currentBetSummary = derived(betStore, calculateBetSummary);

    $: console.log({ $currentBetSummary });

    async function handleSubmitBet() {
        const order: Order = await createOrder();
        dispatch("orderCreated", order);
    }

    function handleCloseModal() {
        dispatch("cancel");
    }

    function handleQuickBetAmount(amount: number): void {
        updateBetsInStore(
            $currentBetSummary.lotto_id,
            $currentBetSummary.lotto_name,
            $currentBetSummary.betGroups,
            amount
        );
    }

    function handleClearBetAmounts(): void {
        handleQuickBetAmount(0);
    }

    /* Update bets in store */
    function updateBetsInStore(
        lotto_id: string,
        lotto_name: string,
        betGroups: BetGroupSummary[],
        amount: number
    ): void {
        betGroups.forEach((betGroup) => {
            betGroup.betList.forEach((betItem) => {
                if (betItem.temp_id !== undefined) {
                    betStore.updateAmount(
                        lotto_id,
                        lotto_name,
                        betGroup.bet_type_id,
                        betItem.temp_id,
                        amount
                    );
                }
            });
        });
    }

    async function fetchBetCalculations(): Promise<void> {
        try {
            const result =
                await betCalculateApi.getBetCalculate($currentBetSummary);
            betCalculationResult = result;
            syncCalculationsWithStore(result);
        } catch (error) {
            console.error("Failed to fetch bet calculations:", error);
            betCalculationResult = $currentBetSummary;
        } finally {
            isLoading = false;
        }
    }

    function syncCalculationsWithStore(calculations: BetSummary): void {
        const betTypeGroup: BetTypeGroup = {};
        calculations.betGroups.forEach((betGroup) => {
            betTypeGroup[betGroup.bet_type_id] = betGroup.betList.map(
                (bet) => ({
                    ...bet,
                })
            );
        });
        betStore.syncBetData(betTypeGroup);
    }

    async function createOrder(): Promise<Order> {
        return await betCalculateApi.createOrder($currentBetSummary);
    }

    const getBalance = async (): Promise<void> => {
        const username = localStorage.getItem("username");
        try {
            if (username) {
                const responseGetBalance = await walletApi.getBalance();
                availableBalance = responseGetBalance.balance;
            }
        } catch (error) {
            console.error("Error in login:", error);
        }
    };

    onMount(async () => {
        try {
            await Promise.all([getBalance(), fetchBetCalculations()]);
        } catch (error) {
            console.error("Error in onMount:", error);
        }
    });
</script>

<div class="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div class="w-11/12 max-w-2xl bg-white rounded-lg overflow-hidden">
        <!-- Header -->
        <header
            class="bg-red-600 text-white px-4 py-2 flex justify-between items-center"
        >
            <h2 class="text-lg font-medium">
                ใส่ราคา - {$currentBetSummary.lotto_name}
            </h2>
            <button
                class="text-2xl hover:opacity-80 transition-opacity"
                on:click={handleCloseModal}
            >
                &times;
            </button>
        </header>

        <!-- Table -->
        {#if isLoading}
            <Loading />
        {:else}
            <BetSummaryTable betSummary={betCalculationResult} />
        {/if}

        <!-- Quick Actions -->
        <div class="p-4 space-y-4">
            <div class="space-y-2">
                <button
                    class="w-full py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    on:click={handleClearBetAmounts}
                >
                    เคลียร์จำนวนเงิน
                </button>

                <div class="grid grid-cols-3 gap-2">
                    {#each QUICK_BET_AMOUNTS as amount}
                        <button
                            class="py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                            on:click={() => handleQuickBetAmount(amount)}
                        >
                            {amount}฿
                        </button>
                    {/each}
                    <button
                        class="py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    >
                        ระบุ
                    </button>
                </div>
            </div>

            <!-- Total Amount -->
            <div class="space-y-2">
                <label class="block" for="totalAmount">ราคารวม</label>
                <input
                    id="totalAmount"
                    type="number"
                    class="w-full p-2 bg-gray-100 rounded text-right"
                    readonly
                    value={$currentBetSummary.totals.total_amount}
                />
            </div>

            <!-- Balance Information -->
            <div class="flex justify-between text-sm">
                <div>
                    <span class="text-green-600">Credit คงเหลือ</span>
                    <span class="block font-bold">{availableBalance}</span>
                </div>
                <div>
                    <span class="text-red-600">ใช้ Credit ทั้งหมด</span>
                    <span class="block font-bold text-right"
                        >{$currentBetSummary.totals.total_amount.toFixed(
                            2
                        )}</span
                    >
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between gap-4">
                <button
                    class="flex-1 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    on:click={handleCloseModal}
                >
                    ยกเลิกทั้งหมด
                </button>
                <button
                    class="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    disabled={isLoading}
                    on:click={handleSubmitBet}
                >
                    {#if isLoading}
                        <ButtonLoading />
                    {:else}
                        ชำระเงิน
                    {/if}
                </button>
            </div>
        </div>
    </div>
</div>
