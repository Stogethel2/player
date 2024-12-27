<script lang="ts">
    import { onMount } from "svelte";
    import { formatDateTime } from "$lib/utils/dateTime";
    import { orderApi } from "$lib/api/endpoint/order";
    import { CheckCircle2, XCircle, ChevronDown } from "lucide-svelte";
    import type { Order, OrderResponse } from "$lib/interface/order.types";
    import Loading from "../../common/components/loading/loading.svelte";
    import ConfirmPayment from "../../common/components/bet/ConfirmPayment.svelte";
    import { betCalculateApi } from "$lib";

    let orders: OrderResponse[];
    let selectedOrderId: string | null = null;
    let isLoading = true;
    let error: string | null = null;
    let showPaymentSummary = false;
    let reorderedBet: Order;

    onMount(async () => {
        try {
            const response = await orderApi.getOrderHistory();
            orders = response.orders;
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
</script>

{#if isLoading}
    <Loading />
{:else if error}
    <div class="p-4 text-center text-red-600">
        <p>{error}</p>
    </div>
{:else}
    <div class="max-w-4xl mx-auto p-4">
        <h1 class="text-lg font-bold my-2 text-gray-800">ประวัติการเดิมพัน</h1>

        <div class="space-y-4">
            {#each orders as order}
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <!-- Order Header -->
                    <button
                        on:click={() => toggleOrderDetails(order.id)}
                        class="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <div class="flex items-center space-x-4">
                            {#if order.status === "SUCCESS"}
                                <CheckCircle2 class="w-7 h-7 text-green-400" />
                            {:else}
                                <XCircle class="w-7 h-7 text-red-500" />
                            {/if}
                            <div class="text-left">
                                <p class="text-sm font-medium text-gray-900">
                                    {formatDateTime(order.created_at, 0)}
                                </p>
                                <p class="text-sm text-gray-600">
                                    ยอดรวมบิล ฿{order.total_amount.toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-3">
                            <!-- <span class={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>{order.status}</span> -->
                            <ChevronDown
                                class={`w-5 h-5 text-gray-400 transition-transform ${
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
                                        class="bg-gray-50 p-3 rounded-lg grid grid-cols-3 gap-2 text-sm"
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
                                        <!-- <div>
                                            <p class="text-gray-600">
                                                วันที่แทง
                                            </p>
                                            <p class="font-medium">
                                                {formatDateTime(
                                                    order.created_at,
                                                    0
                                                )}
                                            </p>
                                        </div> -->
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
                    ไม่พบประวัติการแทง
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
