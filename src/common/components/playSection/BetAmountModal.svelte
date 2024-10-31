<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { derived } from "svelte/store";
  import BetSummary from "./BetSummaryTable.svelte";
  import { LotteryBetStore } from "./LotteryBetStore";
  import type {
    TotalList,
    BetEntry,
    BetGroup,
    BetEntryStore,
  } from "./LotteryBetStore";

  export let creditBalance = 30420.19;
  export let usedCredit = 0;
  let selectedRows = new Set<string>();
  let price = 0;
  $: totalList = derived(LotteryBetStore, calculateTotalList);

  const dispatch = createEventDispatcher();

  function calculateTotalList($store: BetEntryStore): TotalList {
    let totalBets = 0;
    let totalAmount = 0;

    const betGroup: BetGroup[] = Object.entries($store).map(
      ([type, entries]) => {
        const groupEntries: BetEntry[] = entries.map((entry) => {
          totalBets += 1;
          totalAmount += entry.amount;
          return { ...entry, payout: 0 };
        });

        return { type, entry: groupEntries };
      }
    );

    return {
      betGroup,
      summary: { totalBets, totalAmount },
    };
  }

  function cancel() {
    dispatch("cancel");
  }

  function submit() {
    dispatch("submit", { price, usedCredit });
  }

  function updateAmountForSelectedBets(amount: number): void {
    const allEntries = LotteryBetStore.getAllBetEntries();

    allEntries.forEach((group) => {
      group.entries.forEach((entry) => {
        if (selectedRows.has(entry.betId)) {
          LotteryBetStore.updateBetAmount(group.type, entry.betNo, amount);
        }
      });
    });
  }

  function clearBetAmounts() {
    updateAmountForSelectedBets(0);
  }

  function handleBetSelectionChange(event: CustomEvent) {
    selectedRows = event.detail.selectedRows;
  }
</script>

<div class="modal">
  <div class="modal-content">
    <header class="modal-header">
      <h2>ใส่ราคา</h2>
      <button class="close-button" on:click={cancel}>✕</button>
    </header>

    <BetSummary
      on:selectionChange={handleBetSelectionChange}
      totalList={$totalList}
    />

    <div class="quick-buttons">
      <div class="common-buttons">
        <button on:click={() => clearBetAmounts()}>เคลียร์จำนวนเงิน</button>
      </div>
      <div class="price-buttons">
        <button on:click={() => updateAmountForSelectedBets(5)}>5฿</button>
        <button on:click={() => updateAmountForSelectedBets(10)}>10฿</button>
        <button on:click={() => updateAmountForSelectedBets(20)}>20฿</button>
        <button on:click={() => updateAmountForSelectedBets(50)}>50฿</button>
        <button on:click={() => updateAmountForSelectedBets(100)}>100฿</button>
        <button on:click={() => updateAmountForSelectedBets(100)}>ระบุ</button>
      </div>
    </div>

    <div class="price-input">
      <label for="price-input">ราคารวม</label>
      <input
        id="price-input"
        disabled
        type="number"
        bind:value={$totalList.summary.totalAmount}
        min="0"
      />
    </div>

    <div class="credit-info">
      <div class="credit-balance">
        <span>Credit คงเหลือ</span>
        <span class="amount">{creditBalance.toFixed(2)}</span>
      </div>
      <div class="credit-used">
        <span>ใช้ Credit ทั้งหมด</span>
        <span class="amount">{usedCredit.toFixed(2)}</span>
      </div>
    </div>

    <div class="action-buttons">
      <button class="cancel-button" on:click={cancel}>ยกเลิกทั้งหมด</button>
      <button class="submit-button" on:click={submit}>ส่งไป</button>
    </div>
  </div>
</div>

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    min-width: 400px;
    overflow: hidden; /* Ensure the header corners stay rounded */
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0rem 1rem;
    background-color: red;
    color: white;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: white;
  }

  .price-input {
    margin: 1rem;
  }

  .price-input input {
    text-align: right;
    background-color: #f0f0f0;
    width: 100%;
    margin: 0.5rem 0rem;
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 0.25rem;
  }

  .quick-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem;
  }

  .price-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .common-buttons {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 0.5rem;
  }

  .credit-info {
    display: flex;
    justify-content: space-between;
    margin: 1rem;
  }

  .credit-balance {
    color: green;
  }

  .credit-used {
    color: red;
  }

  .amount {
    font-weight: bold;
    display: block;
  }

  .action-buttons {
    display: flex;
    justify-content: space-between;
    margin: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f0f0f0;
    cursor: pointer;
  }

  .submit-button {
    background-color: #4caf50;
    color: white;
  }
</style>
