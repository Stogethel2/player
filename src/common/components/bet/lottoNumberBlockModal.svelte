<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import Loading from "../loading/loading.svelte";

    import type { Lotto } from "$lib/interface/lotto.types";
    import type { LottoRound, LottoBetType } from "$lib/interface/lotto.types";

    import { formatDateTime } from "$lib/utils/date_time";
    import { lottoApi, lottoRoundApi } from "$lib";

    const dispatch = createEventDispatcher();

    let lotto: Lotto | null = null;
    let lotteryRound: LottoRound | null = null;

    let isLoading = true;

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
            <h2 class="text-lg font-medium">
                รายการเลขอั้นงวด - {formatDateTime(
                    lotteryRound?.round_date ?? "",
                    0
                )}
            </h2>
            <button
                class="text-2xl hover:opacity-80 transition-opacity"
                disabled={isLoading}
                on:click={handleCloseModal}
            >
                &times;
            </button>
        </header>

        <!-- Content -->
        <div class="p-4 space-y-1 overflow-x-auto overflow-y-auto max-h-[600px]">
            {#if lotto}
                <div style="color: black;">
                    <!-- รายละเอียดการเดิมพัน -->
                    <table class="border-collapse w-full">
                        <thead class="bg-red-600 text-white">
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
                            {:else}
                                <tr>
                                    <td
                                        class="border border-gray-300 px-4 py-2 text-sm"
                                        colspan="2"
                                    >
                                        ไม่พบข้อมูล
                                    </td>
                                </tr>
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
