<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import type { Lotto } from "$lib/interface/lotto.types";
    import type { LottoRound, LottoBetType } from "$lib/interface/lotto.types";
    import { formatDateTime } from "$lib/utils/dateTime";
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
    <div class="w-11/12 max-w-2xl bg-white rounded-lg overflow-hidden">
        <!-- Header -->
        <header
            class="bg-red-600 text-white px-4 py-2 flex justify-between items-center"
        >
            <h2 class="text-lg font-medium">กฏิกา</h2>
            <button
                class="text-2xl hover:opacity-80 transition-opacity"
                disabled={isLoading}
                on:click={handleCloseModal}
            >
                &times;
            </button>
        </header>

        <!-- Content -->
        <div class="p-4 space-y-1 overflow-y-auto">
            {#if lotto}
                <h3 class="text-lg font-medium">{lotto.lotto_name}</h3>
                <div style="color: black;">
                    <!-- รายละเอียดกฏการเล่น -->
                    <div class="mt-4">
                        <h4 class="text-lg font-medium">รายละเอียดกฏการเล่น</h4>
                        <div class="prose">
                            <p> {lotto.lotto_rules}</p>
                        </div>
                    </div>

                    <!-- รายละเอียดการเดิมพัน -->
                    <table class="border-collapse w-full">
                        <thead>
                            <tr>
                                <th class="border border-gray-300 px-4 py-2"
                                    >ประเภท</th
                                >
                                <th class="border border-gray-300 px-4 py-2"
                                    >อัตราการจ่าย บาทละ</th
                                >
                            </tr>
                        </thead>
                        <tbody>
                            {#if lotteryRound}
                                {#each lotteryRound.lottoBetTypes as betType}
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
                                {/each}
                            {/if}
                        </tbody>
                    </table>
                </div>
            {:else}
                <Loading />
            {/if}
        </div>
    </div>
</div>
