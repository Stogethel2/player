<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { formatDateTime } from "$lib/utils/dateTime";
    import { orderApi } from "$lib/api/endpoint/order";
    import { CheckCircle2, XCircle, ChevronDown } from "lucide-svelte";
    import type { Order, OrderResponse } from "$lib/interface/order.types";
    import Loading from "../../common/components/loading/loading.svelte";
    import ConfirmPayment from "../../common/components/bet/ConfirmPayment.svelte";
    import { betCalculateApi } from "$lib";

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
    let orderResult = "PENDING";

    async function loadItems() {
        if (loading || allLoaded) return;
        loading = true;

        try {
            const response = await orderApi.getOrderHistory(pageShow,orderResult);
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

    onMount(async () => {
        try {
            orderResult = "PENDING";
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
                            <div class="col-span-12 text-green-600 text-left">
                                <span class="font-bold">{order.lotto_name}</span
                                >
                                <span class="text-gray-600 font-bold">
                                    งวดที่:</span
                                >
                                <span class="text-blue-600">
                                    {formatDateTime(order.round_date, 0)}
                                </span>
                            </div>
                            <div
                                class="col-span-12 text-left border-b border-gray-400"
                            >
                                <span class="font-bold">เลขที่บิล: </span>
                                <span class="text-xs text-blue-600"
                                    >{order.id}</span
                                >
                            </div>
                            <!-- First Column -->
                            <div class="col-span-4 text-left">
                                <div>ยอดรวมบิล</div>
                                <div class="text-xs text-gray-600 font-bold">
                                    ฿{order.total_amount.toFixed(2)}
                                </div>
                            </div>
                            <!-- Second Column -->
                            <div class="col-span-4">
                                <div>วันที่ซื้อ</div>
                                <div class="text-xs text-gray-600 font-bold">
                                    {formatDateTime(order.created_at, 0)}
                                </div>
                            </div>
                            <!-- Third Column -->
                            <div class="col-span-4">
                                <div>สถานะชำระเงิน</div>
                                <div>
                                    {#if order.status === "SUCCESS"}
                                        <span class="text-green-600 font-bold"
                                            >สำเร็จ</span
                                        >
                                    {:else if order.status === "PENDING"}
                                        <span class="text-orange-600 font-bold"
                                            >รอชำระ</span
                                        >
                                    {:else}
                                        <span class="text-red-600 font-bold"
                                            >ไม่สำเร็จ</span
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
                                {#each order.orderBets as bet}
                                    <div
                                        class="bg-gray-50 p-3 rounded-lg grid grid-cols-4 gap-2 text-sm"
                                    >
                                        <div>
                                            <p class="text-gray-600">
                                                {bet.bet_type_name}
                                            </p>
                                            <p class="font-medium">
                                                {bet.bet_number}
                                            </p>
                                        </div>
                                        <div>
                                            <p class="text-gray-600">
                                                จำนวนเงิน
                                            </p>
                                            <p class="font-medium">
                                                ฿{bet.bet_amount}
                                            </p>
                                        </div>
                                        <div>
                                            <p class="text-gray-600">
                                                อัตราจ่าย
                                            </p>
                                            <p
                                                class={`font-bold ${order.status === "SUCCESS" ? "text-green-600" : "text-red-600"}`}
                                            >
                                                ฿{bet.payout}
                                            </p>
                                        </div>
                                        <div>
                                            {#if bet.lotto_result === "WIN"}
                                                <p class="text-gray-600">
                                                    ผลรางวัล
                                                </p>
                                                <p
                                                    class="font-medium text-green-600"
                                                >
                                                    ถูกรางวัล
                                                </p>
                                            {:else if bet.lotto_result === "LOSE"}
                                                <p class="text-gray-600">
                                                    ผลรางวัล
                                                </p>
                                                <p
                                                    class="font-medium text-red-600"
                                                >
                                                    ไม่ถูกรางวัล
                                                </p>
                                            {:else}
                                                <p class="text-gray-600">
                                                    ผลรางวัล
                                                </p>
                                                <p
                                                    class="font-medium text-blue-600"
                                                >
                                                    รอออกผล
                                                </p>
                                            {/if}
                                        </div>
                                    </div>
                                {/each}

                                {#if order.status === "PENDING"}
                                    {#if order.orderBets.length > 0}
                                        <div class="flex justify-end mt-4">
                                            <button
                                                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                                                on:click={() =>
                                                    handlePayment(order)}
                                            >
                                                จ่ายเงินอีกครั้ง
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
        </div>
    </div>
{/if}

{#if showPaymentSummary}
    <ConfirmPayment
        order={reorderedBet}
        on:cancel={() => (showPaymentSummary = false)}
    />
{/if}
