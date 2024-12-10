<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { CircleCheck } from "lucide-svelte";
    import type { Order } from "$lib/interface/order.types";
  
    export let order: Order;
  
    const dispatch = createEventDispatcher();
  
    $: orderDetails = order;
    $: totalBetAmount = orderDetails.orderBets.reduce(
      (sum, bet) => sum + bet.bet_amount,
      0
    );
    $: totalPayout = orderDetails.orderBets.reduce(
      (sum, bet) => sum + bet.payout,
      0
    );
  
    // Create a unique key for each bet
    function getBetKey(bet: Order["orderBets"][0], index: number): string {
      return `${bet.order_id}-${bet.bet_number}-${bet.lotto_bet_type_id}-${index}`;
    }
  
    function handleConfirm() {
    }
  
    function handleCancel() {
      dispatch("cancel");
    }
  </script>
  
  <div 
    class="fixed inset-0 z-50 overflow-y-auto bg-black/50"
  >
    <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
      <div 
        class="w-11/12 max-w-2xl bg-white rounded-lg overflow-hidden"
      >
        <!-- Header -->
        <div class="bg-red-600 px-4 py-4 sm:px-6">
          <div class="flex flex-col items-center">
            <div class="mt-2 text-center">
              <h3 class="text-lg font-medium leading-6 text-white">
                ยืนยันการเดิมพัน
              </h3>
            </div>
          </div>
        </div>
  
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
            <h4 class="text-sm font-medium text-gray-900">รายละเอียดการเดิมพัน</h4>
            <div class="mt-3 max-h-60 space-y-2 overflow-y-auto rounded-md">
              {#each orderDetails.orderBets as bet, index (getBetKey(bet, index))}
                <div class="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
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
  
        <!-- Actions -->
        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 space-x-reverse space-x-3">
          <button
            type="button"
            class="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto sm:text-sm"
            on:click={handleConfirm}
          >
            ยืนยัน
          </button>
          <button
            type="button"
            class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
            on:click={handleCancel}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <style>
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