<script lang="ts">
  import { lottoRoundApi } from "$lib";
  import { lottoApi } from "$lib/api/endpoint/lotto";
  import type { LottoRound } from "$lib/interface/lotto.types";
  import CardLotto from "../cardLotto/cardLotto.svelte";
  import { onMount } from "svelte";

  import { formatDateTime } from "$lib/utils/dateTime";

  let playlist: LottoRound[];
  let isLoading = true;
  let end_bet_min = 0;

  export let category: string;

  onMount(async () => {
    try {
      if (category === "yeekee") {
        playlist = await lottoRoundApi.getActiveLottoRounds();
        // lottoData = await fetch("/setting/yeekeelist.json"); // ดึงข้อมูลจาก static/settings.json
      } else {
        playlist = await lottoRoundApi.getActiveLottoRounds();
      }
      const colors = [
        "bg-red-500",
        "bg-gray-500",
        "bg-orange-500",
        "bg-green-500",
        "bg-blue-500",
      ];
      playlist = playlist.map((card: LottoRound) => {
        card.headerColorClass =
          colors[Math.floor(Math.random() * colors.length)];
        return card;
      });
      end_bet_min = playlist[0].lotto.default_close_bet_minutes;
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      isLoading = false;
    }
  });
</script>

<div
  class="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 mx-auto px-4 sm:px-6 lg:px-8"
>
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    {#each playlist as card}
      <CardLotto
        headerColorClass={card.headerColorClass}
        headerImageBackground={"https://images.squarespace-cdn.com/content/v1/58cd025a4402439656dae04f/1561314690504-Y25AJHYE86T7YBYI3VV0/Reis+naar+Thailand+boeken-3.JPG"}
        icon={card.lotto.lotto_image}
        title={card.lotto.lotto_name}
        countDownText={card.round_date}
        details={formatDateTime(card.round_date,end_bet_min)}
        open={true}
        name={card.lotto.lotto_name}
        agent={false}
        lottoId={card.id}
        endBetMin={end_bet_min}
      />
    {/each}

    <CardLotto
      headerColorClass={"bg-red-500"}
      headerImageBackground={"https://images.squarespace-cdn.com/content/v1/58cd025a4402439656dae04f/1561314690504-Y25AJHYE86T7YBYI3VV0/Reis+naar+Thailand+boeken-3.JPG"}
      icon={"https://cdn-icons-png.flaticon.com/512/630/630635.png"}
      title={"หวยยี่กี่ 01/01/2564"}
      countDownText={"เหลือเวลาอีก 0 วัน 00:00:00"}
      details={"ออกผลวันที่ 01/01/2564"}
      open={false}
      name={"test"}
      agent={true}
      lottoId={`70fbea68-8a14-44c3-bb69-07c12584c277`}
      endBetMin={end_bet_min}
    />
  {/if}
</div>
