<script lang="ts">
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { CircleDollarSign, CopyCheck, CheckCircle2 } from "lucide-svelte";
  import Loading from "../../common/components/loading/loading.svelte";

  interface BankAccount {
    bankName: string;
    accountName: string;
    accountNumber: string;
    logoUrl: string;
  }

  let bankAccount: BankAccount | null = null;
  let isLoading = true;
  let error: string | null = null;
  let copied = false;
  let withdrawalAmount = "";

  onMount(async () => {
    try {
      const response = await fetch("/setting/bank-withdraw.json");
      if (!response.ok) {
        throw new Error("Failed to fetch bank account data");
      }
      bankAccount = await response.json();
    } catch (e) {
      error = e instanceof Error ? e.message : "An unknown error occurred";
    } finally {
      isLoading = false;
    }
  });

  function copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        copied = true;
        setTimeout(() => (copied = false), 2000);
      })
      .catch((err) => console.error("Failed to copy: ", err));
  }

  function handleWithdraw() {
    // Implement withdrawal logic here
    console.log("Withdrawal amount:", withdrawalAmount);
    // You would typically send this to your backend
    alert(`คำขอถอนเงินจำนวน ${withdrawalAmount} บาท ได้รับการดำเนินการแล้ว`);
    withdrawalAmount = "";
  }
</script>

<div
  class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-4 px-4 sm:px-6 lg:px-8"
>
  <div class="max-w-lg mx-auto">
    <h1 class="text-3xl font-extrabold text-center text-gray-900 my-4">
      ถอนเงิน
    </h1>

    <div
      class="bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl mb-8"
    >
      <div class="bg-green-700 p-4">
        <h2 class="text-xl font-semibold text-white flex items-center">
          <CircleDollarSign class="mr-3" size={28} />
          ข้อมูลบัญชีที่รับเงิน
        </h2>
      </div>

      <div class="p-4">
        {#if isLoading}
          <Loading />
        {:else if error}
          <p class="text-center text-red-500 py-4" in:fade>
            เกิดข้อผิดพลาด: {error}
          </p>
        {:else if bankAccount}
          <div
            class="bg-gray-50 rounded-2xl p-4 shadow-inner"
            in:fade={{ duration: 300 }}
          >
            <div class="flex items-center mb-4">
              <img
                src={bankAccount.logoUrl}
                alt={bankAccount.bankName}
                class="w-16 h-16 object-contain mr-4 rounded-lg shadow"
              />
              <div>
                <p class="font-bold text-2xl text-gray-800">
                  {bankAccount.bankName}
                </p>
                <p class="text-lg text-gray-600">{bankAccount.accountName}</p>
              </div>
            </div>
            <div
              class="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm"
            >
              <p class="text-center text-gray-500 py-4">
                {bankAccount.accountNumber}
              </p>
            </div>
          </div>
        {:else}
          <p class="text-center text-gray-500 py-6 text-lg" in:fade>
            ไม่พบข้อมูลบัญชี
          </p>
        {/if}
      </div>
    </div>

    <div
      class="bg-white shadow-xl rounded-3xl overflow-hidden p-8 mb-8"
      in:fade={{ duration: 300, delay: 200 }}
    >
      <h3 class="text-xl font-semibold mb-4 text-gray-800">
        รายละเอียดการถอนเงิน
      </h3>
      <div class="mb-6">
        <label
          for="withdrawAmount"
          class="block text-sm font-medium text-gray-700 mb-2"
          >จำนวนที่ต้องการถอน</label
        >
        <input
          type="number"
          id="withdrawAmount"
          bind:value={withdrawalAmount}
          placeholder="ใส่จำนวนเงิน"
          class="input w-full px-4 py-2 border-green-500 focus:ring-green-500"
        />
      </div>
      <button
        on:click={handleWithdraw}
        class="btn w-full bg-gradient-to-t from-green-700 to-green-900 text-white px-6 py-2 rounded-full text-lg font-semibold hover:from-green-700 hover:to-green-900 transform hover:-translate-y-1 focus:ring-green-500"
      >
        แจ้งถอน
      </button>
    </div>

    <div
      class="text-center text-sm text-gray-600"
      in:fly={{ y: 20, duration: 500, delay: 300 }}
    >
      <p>กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนทำการถอนเงิน</p>
      <p>หากมีข้อสงสัยกรุณาติดต่อฝ่ายบริการลูกค้า</p>
    </div>
  </div>
</div>

<style lang="postcss">
  :global(body) {
    @apply antialiased;
  }
</style>
