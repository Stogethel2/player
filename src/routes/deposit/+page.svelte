<script lang="ts">
  import { onMount } from "svelte";
  import { CircleDollarSign, CopyCheck } from "lucide-svelte";
  import Loading from "../../common/components/loading/loading.svelte";

  interface BankAccount {
    bankName: string;
    accountName: string;
    accountNumber: string;
    logoUrl: string;
  }

  let bankAccount: BankAccount;
  let isLoading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const response = await fetch("/setting/bank-deposit.json");
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
      .then(() => alert("Copied to clipboard!"))
      .catch((err) => console.error("Failed to copy: ", err));
  }
</script>

<div
  class="min-h-screen bg-gradient-to-b from-gray-50 to-white py-4 px-4 sm:px-6 lg:px-8"
>
  <div class="max-w-md mx-auto">
    <h1 class="text-3xl font-extrabold text-center text-gray-900 my-4">
      ฝากเงิน
    </h1>

    <img
      src="https://slip.zxcv8888.com/permanent/4c3bf9ed-4660-49f1-a4de-9817c473289b.jpeg"
      alt="deposit"
      class="w-full object-cover rounded-lg shadow-lg mb-8"
    />

    <div class="bg-white shadow-lg rounded-2xl overflow-hidden">
      <div class="bg-red-600 p-4">
        <h2 class="text-xl font-semibold text-white flex items-center">
          <CircleDollarSign class="mr-2" size={24} />
          ข้อมูลบัญชีธนาคารที่ต้องโอน
        </h2>
      </div>

      <div class="p-6">
        {#if isLoading}
          <Loading />
        {:else if error}
          <p class="text-center text-red-500 py-4">{error}</p>
        {:else if bankAccount}
          <div class="bg-gray-50 rounded-xl p-4 shadow-inner">
            <div class="flex items-center mb-4">
              <img
                src={bankAccount.logoUrl}
                alt={bankAccount.bankName}
                class="w-16 h-16 object-contain mr-4 rounded-lg shadow"
              />
              <div>
                <p class="font-bold text-lg text-gray-800">
                  {bankAccount.bankName}
                </p>
                <p class="text-lg text-gray-600">{bankAccount.accountName}</p>
              </div>
            </div>
            <div
              class="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm"
            >
              <p class="text-lg font-medium text-gray-700">
                {bankAccount.accountNumber}
              </p>
              <button
                on:click={() => copyToClipboard(bankAccount.accountNumber)}
                class="btn text-blue-600 hover:text-blue-800"
                title="Copy account number"
              >
                <CopyCheck size={20} />
              </button>
            </div>
          </div>
        {:else}
          <p class="text-center text-gray-500 py-4">ไม่พบข้อมูลบัญชี</p>
        {/if}
      </div>
    </div>

    <div class="mt-8 text-center">
      <p class="text-sm text-gray-600 mb-3">หลังจากโอนเงินเรียบร้อยแล้ว</p>
      <button
        class="btn bg-green-500 text-white px-8 py-3 rounded-full font-medium hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        แจ้งยอดฝาก
      </button>
    </div>
  </div>
</div>
