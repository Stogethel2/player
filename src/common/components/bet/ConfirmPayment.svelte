<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Order } from "$lib/interface/order.types";
  import { paymentApi } from "$lib/api/endpoint/payment";
  import type {
    PaymentResult,
    PaymentStatus,
  } from "$lib/interface/payment.types";
  import { fade, fly } from "svelte/transition";
  import { XCircle, CheckCircle2, AlertCircle } from "lucide-svelte";

  export let order: Order;
  const dispatch = createEventDispatcher<{
    confirm: void;
    cancel: void;
  }>();

  let paymentStatus: PaymentStatus = "PENDING";
  let paymentResult: PaymentResult | null = null;
  let isProcessing = false;
  let error: string | null = null;

  $: orderDetails = order;
  $: totalBetAmount = orderDetails.orderBets.reduce(
    (sum, bet) => sum + bet.bet_amount,
    0
  );
  $: totalPayout = orderDetails.orderBets.reduce(
    (sum, bet) => sum + bet.payout,
    0
  );

  function getBetKey(bet: Order["orderBets"][0], index: number): string {
    return `${bet.order_id}-${bet.bet_number}-${bet.lotto_bet_type_id}-${index}-${bet.bet_amount}`;
  }

  async function handleConfirm() {
    if (isProcessing) return;

    try {
      isProcessing = true;
      error = null;
      paymentResult = await paymentApi.createPayment(
        order.order_id,
        "COMPLETED"
      );
      paymentStatus = paymentResult.status;
      dispatch("confirm");
    } catch (err) {
      error = err instanceof Error ? err.message : "Payment failed";
      console.error("Payment failed", err);
    } finally {
      isProcessing = false;
    }
  }

  async function handleCancel() {
    if (isProcessing) return;

    try {
      isProcessing = true;
      error = null;
      paymentResult = await paymentApi.createPaymentFail(order.order_id);
      paymentStatus = paymentResult.status;
    } catch (err) {
      error = err instanceof Error ? err.message : "Cancellation failed";
      console.error("Payment cancellation failed", err);
    } finally {
      isProcessing = false;
    }
  }
</script>

<div
  class="fixed inset-0 z-50 overflow-y-auto bg-black/50"
  role="dialog"
  aria-modal="true"
>
  <div
    class="flex min-h-full items-center justify-center p-4 text-center sm:p-0"
  >
    <div
      class="w-11/12 max-w-2xl bg-white rounded-lg overflow-hidden"
      in:fly={{ y: 20, duration: 200 }}
      out:fade
    >
      <!-- Header -->
      <div
        class={`${(() => {
          switch (paymentStatus) {
            case "COMPLETED":
              return "bg-green-600";
            case "FAILED":
              return "bg-red-600";
            default:
              return "bg-red-600";
          }
        })()} px-4 py-4 sm:px-6`}
      >
        <div class="flex justify-between items-center">
          <div class="text-center flex-1">
            <h3 class="text-lg font-medium leading-6 text-white">
              {(() => {
                switch (paymentStatus) {
                  case "COMPLETED":
                    return "ตัดเงินสำเร็จ";
                  case "FAILED":
                    return "การชำระเงินล้มเหลว";
                  default:
                    return "ยืนยันการเดิมพัน";
                }
              })()}
            </h3>
          </div>
          <button
            class="text-white text-2xl hover:opacity-80 transition-opacity"
            aria-label="Close modal"
            on:click={() => dispatch("cancel")}
          >
            &times;
          </button>
        </div>
      </div>

      <!-- Error Message -->
      {#if error}
        <div class="px-4 py-3 bg-red-50" transition:fade>
          <div class="flex items-center">
            <AlertCircle class="text-red-500 mr-2" size={20} />
            <p class="text-red-700">{error}</p>
          </div>
        </div>
      {/if}

      {#if paymentStatus === "PENDING"}
        <!-- Summary Cards -->
        <div class="px-4 py-5 sm:p-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-lg bg-gray-50 p-4">
              <p class="text-sm font-medium text-gray-500">ยอดเดิมพันรวม</p>
              <p class="mt-1 text-2xl font-semibold text-gray-900">
                ฿{totalBetAmount.toFixed(2)}
              </p>
            </div>
            <div class="rounded-lg bg-gray-50 p-4">
              <p class="text-sm font-medium text-gray-500">เรทจ่ายรวม</p>
              <p class="mt-1 text-2xl font-semibold text-green-600">
                ฿{totalPayout.toFixed(2)}
              </p>
            </div>
          </div>

          <!-- Bet Details -->
          <div class="mt-6">
            <h4 class="text-sm font-medium text-gray-900">
              รายละเอียดการเดิมพัน
            </h4>
            <div class="mt-3 max-h-60 space-y-2 overflow-y-auto rounded-md">
              {#each orderDetails.orderBets as bet, index (getBetKey(bet, index))}
                <div
                  class="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                >
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      เลข: {bet.bet_number}
                    </p>
                    <p class="text-sm text-gray-500">
                      เดิมพัน: ฿{bet.bet_amount.toFixed(2)}
                    </p>
                  </div>
                  <div class="text-sm font-medium text-green-600">
                    เรทจ่าย: ฿{bet.payout.toFixed(2)}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}

      <!-- Success Message -->
      {#if paymentStatus === "COMPLETED"}
        <div class="px-4 py-5 sm:p-6 text-center">
          <div class="flex flex-col items-center">
            <div class="icon-success mb-3">
              <CheckCircle2 class="h-10 w-10 text-green-600" />
            </div>
            <p class="text-lg font-medium text-green-600">
              ตัดเงินสำเร็จ ยอดเงินที่จ่ายคือ ฿{totalBetAmount.toFixed(2)} บาท
            </p>
          </div>
        </div>
      {/if}

      <!-- Failed Message -->
      {#if paymentStatus === "FAILED"}
        <div class="px-4 py-5 sm:p-6 text-center">
          <div class="flex flex-col items-center">
            <div class="icon-failed mb-3">
              <XCircle class="h-10 w-10 text-red-600" />
            </div>
            <p class="text-lg font-medium text-red-600 mb-2">
              การชำระเงินล้มเหลว
            </p>
            <p class="text-gray-600">
              เกิดข้อผิดพลาดในการชำระเงิน กรุณาลองใหม่อีกครั้ง
            </p>
            {#if error}
              <p class="text-sm text-red-500 mt-2">
                สาเหตุ: {error}
              </p>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Pending Message -->
      {#if paymentStatus === "PENDING"}
        <div
          class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 space-x-reverse space-x-3"
        >
          <button
            type="button"
            class="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto sm:text-sm"
            on:click={handleConfirm}
            disabled={isProcessing}
          >
            {#if isProcessing}
              <span
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
              ></span>
            {/if}
            ยืนยัน
          </button>
          <button
            type="button"
            class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:mt-0 sm:w-auto sm:text-sm"
            on:click={handleCancel}
            disabled={isProcessing}
          >
            ยกเลิก
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  /* Styling for the success icon */
  .icon-success {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    height: 50px;
    width: 50px;
  }

  /* Styling for the failed icon */
  .icon-failed {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    height: 50px;
    width: 50px;
  }

  /* Custom scrollbar for bet details */
  .overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }

  .overflow-y-auto::-webkit-scrollbar {
    width: 4px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
  }
</style>
