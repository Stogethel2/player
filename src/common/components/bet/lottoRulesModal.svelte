<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import type { BetType, Lotto } from "$lib/interface/lotto.types";
    import type { LottoRound, LottoBetType } from "$lib/interface/lotto.types";
    import { lottoApi, lottoRoundApi } from "$lib";

    import Loading from "../loading/loading.svelte";

    const dispatch = createEventDispatcher();

    let lotto: Lotto | null = null;
    let lotteryRound: LottoRound | null = null;

    let isLoading = true;

    // ฟังก์ชันปิด modal
    function handleCloseModal() {
        dispatch("close");
    }

    onMount(async () => {
        // Check Auth token
        

        const urlParams = new URLSearchParams(window.location.search);
        const lottoRoundId = urlParams.get("lottoId");

        if (!lottoRoundId) return;
        lotteryRound = await lottoRoundApi.getLottoRoundById(lottoRoundId);

        if (!lotteryRound) return;
        lotto = await lottoApi.getLottoById(lotteryRound.lotto_id);

        isLoading = false;
    });
</script>

<div class="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div class="modal-container w-11/12 max-w-2xl rounded-lg overflow-hidden">
        <!-- Header -->
        <header
            class="bg-red-600 text-white px-4 py-2 flex justify-between items-center"
        >
            <h2 class="text-lg font-medium">กติกา</h2>
            <button
                class="text-2xl hover:opacity-80 transition-opacity"
                disabled={isLoading}
                on:click={handleCloseModal}
            >
                &times;
            </button>
        </header>

        <!-- Content -->
        <div
            class="p-4 space-y-1 overflow-x-auto overflow-y-auto max-h-[600px]"
        >
            {#if lotto}
                <h3 class="text-lg font-bold">
                    <u>รายละเอียดกฏการเล่น - {lotto.lotto_name}</u>
                </h3>
                <br />

                <!-- รายละเอียดกฏการเล่น -->
                <div class="mt-2 space-y-2">
                    <div class="prose">
                        {@html lotto.lotto_rules}
                    </div>
                </div>

                <p>&nbsp;</p>

                <!-- รายละเอียดการเดิมพัน -->
                <div style="color: var(--color-text);">
                    <h3 class="text-lg font-bold">
                        <u>อัตราการจ่าย</u>
                    </h3>
                </div>
                <table class="border-collapse w-full">
                    <thead class="bg-red-600 text-white">
                        <tr>
                            <th class="border border-gray-300 px-4 py-2"
                                >ประเภท</th
                            >
                            <th class="border border-gray-300 px-4 py-2"
                                >บาทละ</th
                            >
                        </tr>
                    </thead>
                    <tbody>
                        {#if lotteryRound}
                            {#each lotteryRound.lottoBetTypes as betType}
                                {#if betType.is_active}
                                    <tr>
                                        <td
                                            class="border border-gray-300 px-4 py-2 text-sm"
                                            >{betType.bet_type_name}</td
                                        >
                                        <td
                                            class="border border-gray-300 px-4 py-2 text-right text-sm"
                                            >{betType.current_payout_rate}</td
                                        >
                                    </tr>
                                {/if}
                            {/each}
                        {/if}
                    </tbody>
                </table>
            {:else}
                <Loading />
            {/if}
        </div>
    </div>
</div>
