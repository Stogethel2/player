<script lang="ts">
  import { lottoRoundApi } from "$lib";
  import { lottoApi } from "$lib/api/endpoint/lotto";
  import type { LottoRound, Lotto } from "$lib/interface/lotto.types";
  import CardLotto from "../cardLotto/cardLotto.svelte";
  import { onMount } from "svelte";

  import { formatDateTime } from "$lib/utils/date-time.utils";

  let playlist: LottoRound[];
  let isLoading = true;

  let lottoData: Lotto[];
  let playlistTH: Lotto[];
  let playlistAbroad: Lotto[];
  let uniqueLotteries: Lotto[];

  export let category: string;

  onMount(async () => {
    try {
      if (category === "yeekee") {
        playlist = await lottoRoundApi.getActiveLottoRounds();
      } else {
        lottoData = await lottoApi.getActiveLottos();
      }

      lottoData = lottoData.map((card: Lotto) => {
        card.round_date_in_lottoRound =
          card.lottoRound && card.lottoRound.length > 0
            ? card.lottoRound[0].round_date
            : "";
        card.id_in_lottoRound =
          card.lottoRound && card.lottoRound.length > 0
            ? card.lottoRound[0].id
            : "";
        return card;
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      isLoading = false;
    }

    lottoData.sort((a, b) => {
      if (a.lotto_category === "หวยไทย" && b.lotto_category !== "หวยไทย")
        return -1;
      if (a.lotto_category !== "หวยไทย" && b.lotto_category === "หวยไทย")
        return 1;
      return 0;
    });

    uniqueLotteries = Array.from(
      new Map(
        lottoData.map((lottery) => [lottery.lotto_category, lottery])
      ).values()
    );

    playlistTH = lottoData.filter((data) => data.lotto_category == "หวยไทย");
    playlistAbroad = lottoData.filter(
      (data) => data.lotto_category == "หวยต่างประเทศ"
    );
  });
</script>

<div class="w-full mx-auto max-w-7xl">
  {#each uniqueLotteries as lottery}
    {#if lottery.lotto_category}
      <div
        class="grid rounded-[1rem] shadow-md bg-transparent text-white my-8 mx-1"
      >
        <div class="flex flex-row items-center border-b border-gold py-2">
          <p class="text-xl sm:text-2xl font-bold text-gold mx-2 sm:mx-4">
            {lottery.lotto_category}
          </p>
        </div>
        <div
          class="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 px-4 sm:px-6 lg:px-8"
        >
          {#if isLoading}
            <p>Loading...</p>
          {:else}
            {#each lottery.lotto_category == "หวยไทย" ? playlistTH : playlistAbroad as card}
              <CardLotto
                headerImageBackground={card?.lotto_background ||
                  "https://images.squarespace-cdn.com/content/v1/58cd025a4402439656dae04f/1561314690504-Y25AJHYE86T7YBYI3VV0/Reis+naar+Thailand+boeken-3.JPG"}
                icon={card.lotto_image}
                title={card.lotto_name}
                countDownText={card.round_date_in_lottoRound}
                details={formatDateTime(
                  card.round_date_in_lottoRound
                    ? card.round_date_in_lottoRound
                    : "",
                  card.default_close_bet_minutes
                )}
                open={true}
                round_status={card.lottoRound && card.lottoRound[0]
                  ? card.lottoRound[0].round_status
                  : "INACTIVE"}
                name={card.lotto_name}
                lottoId={card.id_in_lottoRound ? card.id_in_lottoRound : ""}
                endBetMin={card.default_close_bet_minutes}
              />
            {/each}
          {/if}
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  /* Gold colors defined globally in app.css */
  .text-gold {
    color: var(--color-gold);
  }

  .border-gold {
    border-color: var(--color-gold);
  }
</style>
