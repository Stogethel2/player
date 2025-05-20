<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { formatDateTime } from "$lib/utils/date-time";
    import { orderApi } from "$lib/api/endpoint/order";
    import { CheckCircle2, XCircle, ChevronDown } from "lucide-svelte";
    import type { Order, OrderResponse } from "$lib/interface/order.types";
    import Loading from "../../common/components/loading/loading.svelte";
    import ConfirmPayment from "../../common/components/bet/confirmPayment.svelte";
    import { betCalculateApi } from "$lib";
    import { userAuth } from "$lib/utils/user-auth";

    let orders: OrderResponse[] = [];
    let selectedOrderId: string | null = null;
    let isLoading = true;
    let error: string | null = null;
    let showPaymentSummary = false;
    let reorderedBet: Order;
    let pageShow = 1;

    let loading = false;
    let allLoaded = false;
    let newItems: OrderResponse[];
    let lottoResult: "PENDING" | "CLOSED" = "PENDING";

    async function loadItems(reset: boolean = false) {
        if (loading || allLoaded) return;
        loading = true;

        try {
            if (reset) {
                orders = [];
            }

            const response = await orderApi.getOrderHistory(
                pageShow,
                lottoResult
            );
            newItems = response.orders;

            if (newItems.length === 0) {
                allLoaded = true;
            } else {
                orders = [...orders, ...newItems];
                pageShow += 1;
            }
        } catch (error) {
            console.error("Error loading items:", error);
        } finally {
            loading = false;
        }
    }

    async function handleFilterChange(newResult: typeof lottoResult) {
        try {
            orders = orders || [];
            pageShow = 1;
            loading = false;
            allLoaded = false;
            lottoResult = newResult;
            await loadItems(true);
        } catch (error) {
            console.error("Error loading items:", error);
        } finally {
            isLoading = false;
        }
    }

    onMount(async () => {
        try {
            userAuth();

            lottoResult = "PENDING";
            await loadItems();
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            isLoading = false;
        }
    });

    function toggleOrderDetails(orderId: string) {
        selectedOrderId = selectedOrderId === orderId ? null : orderId;
    }

    function getStatusColor(status: string): string {
        return status === "SUCCESS"
            ? "bg-green-400 text-white"
            : "bg-red-500 text-white";
    }

    async function handlePayment(order: OrderResponse) {
        reorderedBet = await betCalculateApi.reOrder(order.id);
        console.log(reorderedBet);
        showPaymentSummary = true;
    }

    async function handleCancelPayment(order: OrderResponse) {
        reorderedBet = await betCalculateApi.cancelOrder(order.id);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    function handleScroll() {
        if (typeof window === "undefined") return;

        const { scrollTop, scrollHeight, clientHeight } =
            document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 50) {
            loadItems();
        }
    }

    if (typeof window !== "undefined") {
        window.addEventListener("scroll", handleScroll);
    }

    onDestroy(() => {
        if (typeof window !== "undefined") {
            window.removeEventListener("scroll", handleScroll);
        }
    });
</script>

{#if isLoading}
    <Loading />
{:else if error}
    <div class="p-4 text-center text-red-600">
        <p>{error}</p>
    </div>
{:else}
    <div class="max-w-4xl mx-auto p-4 mb-[50px]">
        <div class="space-y-4 mb-4">
            <h1 class="text-lg font-bold my-2 text-gray-800">ประวัติการซื้อ</h1>

            <div class="flex items-center text-white mt-4">
                <button
                    class="bg-gradient-to-r from-red-700 to-red-900 rounded-md p-2"
                    class:opacity-75={lottoResult !== "PENDING"}
                    on:click={() => handleFilterChange("PENDING")}
                >
                    <div
                        class="text-amber
                    -300 font-bold text-sm flex items-center"
                    >
                        <p>ยังไม่ออกผล</p>
                    </div>
                </button>

                <button
                    class="bg-gradient-to-r from-red-700 to-red-900 rounded-md p-2 ml-2"
                    class:opacity-75={lottoResult !== "CLOSED"}
                    on:click={() => handleFilterChange("CLOSED")}
                >
                    <div
                        class="text-amber
                    -300 font-bold text-sm flex items-center"
                    >
                        <p>ออกผลแล้ว</p>
                    </div>
                </button>
            </div>
        </div>

        <div class="space-y-4">
            {#each orders as order}
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <!-- Order Header -->
                    <button
                        on:click={() => toggleOrderDetails(order.id)}
                        class="w-full p-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <div
                            class="grid grid-cols-12 w-full text-sm text-gray-800 p-1 gap-1"
                        >
                            <div class="col-span-12 text-left">
                                <div class="flex items-center space-x-1">
                                    <span class="font-bold text-green-600"
                                        >{order.lotto_name}</span
                                    >
                                    <span class="text-gray-600 font-bold"
                                        >งวดที่:</span
                                    >
                                    <span class="text-blue-600"
                                        >{formatDateTime(
                                            order.round_date,
                                            0
                                        )}</span
                                    >
                                </div>
                            </div>
                            <div
                                class="col-span-12 text-left border-b border-gray-400 space-x-1"
                            >
                                <span class="font-bold">เลขที่บิล:</span>
                                <span class="text-xs text-blue-600"
                                    >{order.id}</span
                                >
                            </div>
                            <!-- First Column -->
                            <div class="col-span-3 text-left">
                                <div>ยอดรวมบิล</div>
                                <div class="text-xs text-gray-600 font-bold">
                                    ฿{order.total_amount.toFixed(2)}
                                </div>
                            </div>

                            <!-- Second Column -->
                            <div class="col-span-3">
                                <div>วันที่ซื้อ</div>
                                <div class="text-xs text-gray-600 font-bold">
                                    {formatDateTime(order.created_at, 0)}
                                </div>
                            </div>

                            <!-- Third Column -->
                            <div class="col-span-3">
                                <div>สถานะชำระเงิน</div>
                                <div>
                                    {#if order.status === "SUCCESS"}
                                        <span class="text-green-600 font-bold"
                                            >สำเร็จ</span
                                        >
                                    {:else if order.status === "PENDING"}
                                        <span class="text-pink-500 font-bold"
                                            >รอชำระ</span
                                        >
                                    {:else if order.status === "CANCELED"}
                                        <span class="text-red-600 font-bold"
                                            >ยกเลิก</span
                                        >
                                    {:else}
                                        <span class="text-red-600 font-bold"
                                            >ไม่สำเร็จ</span
                                        >
                                    {/if}
                                </div>
                            </div>

                            <!-- Fourth Column -->
                            <div class="col-span-3">
                                <div>สถานะ</div>
                                <div>
                                    {#if order.lotto_result === "PENDING"}
                                        {#if order.status === "FAILED" || order.status === "CANCELED"}
                                            <span
                                                class="bg-red-500 text-white text-xs font-semibold rounded-full px-3 py-1 inline-block"
                                            >
                                                ยกเลิก</span
                                            >
                                        {:else if order.status === "PENDING"}
                                            <span
                                                class="bg-pink-500 text-white text-xs font-semibold rounded-full px-3 py-1 inline-block"
                                            >
                                                รอชำระเงิน</span
                                            >
                                        {:else}
                                            <span
                                                class="bg-gray-500 text-white text-xs font-semibold rounded-full px-3 py-1 inline-block"
                                            >
                                                เปิดรับแทง</span
                                            >
                                        {/if}
                                    {:else if order.lotto_result === "CLOSED"}
                                        <span
                                            class="bg-green-500 text-white text-xs font-semibold rounded-full px-3 py-1 inline-block"
                                        >
                                            ออกผลแล้ว</span
                                        >
                                    {/if}
                                </div>
                            </div>
                        </div>
                        <!-- Chevron -->
                        <div>
                            <ChevronDown
                                class={`w-5 h-5 text-gray-600 transition-transform ${
                                    selectedOrderId === order.id
                                        ? "transform rotate-180"
                                        : ""
                                }`}
                            />
                        </div>
                    </button>

                    <!-- Order Details -->
                    {#if selectedOrderId === order.id}
                        <div class="border-t border-gray-200 p-4">
                            <div class="space-y-3">
                                <div
                                    class="bg-gray-50 p-3 rounded-lg grid grid-cols-5 gap-2 text-sm text-center"
                                >
                                    <div>
                                        <p
                                            class="text-gray-600 font-bold text-left"
                                        >
                                            ประเภท
                                        </p>
                                    </div>
                                    <div>
                                        <p class="text-gray-600 font-bold">
                                            เลข
                                        </p>
                                    </div>
                                    <div>
                                        <p
                                            class="text-gray-600 font-bold text-right"
                                        >
                                            ซื้อ
                                        </p>
                                    </div>
                                    <div>
                                        <p
                                            class="text-gray-600 font-bold text-right"
                                        >
                                            อัตราจ่าย
                                        </p>
                                    </div>
                                    <div>
                                        <p
                                            class="text-gray-600 font-bold text-right"
                                        >
                                            ผลรางวัล
                                        </p>
                                    </div>
                                    {#each order.orderBets as bet}
                                        <div class="text-left">
                                            {bet.bet_type_name}
                                        </div>
                                        <div>
                                            {bet.bet_number}
                                        </div>
                                        <div class="text-right">
                                            {bet.bet_amount}
                                        </div>
                                        <div class="text-right">
                                            {bet.payout}
                                        </div>
                                        <div class="text-right">
                                            {#if bet.lotto_result === "WIN"}
                                                <p class="text-green-600">
                                                    {(
                                                        bet.payout *
                                                        bet.bet_amount
                                                    ).toFixed(2)}
                                                </p>
                                            {:else if bet.lotto_result === "LOSE"}
                                                <p class="text-orange-600">
                                                    ไม่ถูกรางวัล
                                                </p>
                                            {:else if order.status === "FAILED" || order.status === "CANCELED"}
                                                <p class="text-red-600">
                                                    ยกเลิก
                                                </p>
                                            {:else}
                                                <p class="text-blue-600">
                                                    รอออกผล
                                                </p>
                                            {/if}
                                        </div>
                                    {/each}
                                </div>
                                {#if order.status === "PENDING"}
                                    {#if order.orderBets.length > 0}
                                        <div class="flex justify-end mt-4">
                                            <button
                                                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors mr-2"
                                                on:click={() =>
                                                    handlePayment(order)}
                                            >
                                                ชำระอีกครั้ง
                                            </button>
                                            <button
                                                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                                on:click={() =>
                                                    handleCancelPayment(order)}
                                            >
                                                ยกเลิกบิล
                                            </button>
                                        </div>
                                    {:else}
                                        <div
                                            class="bg-gray-50 p-3 rounded-lg text-sm text-center"
                                        >
                                            <p class="text-gray-600">
                                                ไม่สามารถจ่ายเงินได้กรุณาเดิมพันใหม่อีกครั้ง
                                            </p>
                                        </div>
                                    {/if}
                                {:else if order.status === "SUCCESS"}
                                    <div class="flex justify-end mt-4">
                                        <button
                                            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                            on:click={() =>
                                                handleCancelPayment(order)}
                                        >
                                            ยกเลิกการซื้อ
                                        </button>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}

            {#if orders.length === 0}
                <div class="text-center py-8 text-gray-500">
                    ไม่พบประวัติการซื้อ
                </div>
            {/if}

            {#if loading}
                <div class="text-center py-4">
                    <Loading />
                </div>
            {/if}
        </div>
    </div>
{/if}

{#if showPaymentSummary}
    <ConfirmPayment
        order={reorderedBet}
        on:cancel={() => (showPaymentSummary = false)}
    />
{/if}
