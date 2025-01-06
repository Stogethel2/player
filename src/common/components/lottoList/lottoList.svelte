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
  let playlistTH: LottoRound[];
  let playlistAbroad: LottoRound[];
  let uniqueLotteries: LottoRound[];

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
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      isLoading = false;
    }

    playlist.sort((a, b) => {
      if (a.lotto.lotto_category === 'หวยไทย' && b.lotto.lotto_category !== 'หวยไทย') return -1;
      if (a.lotto.lotto_category !== 'หวยไทย' && b.lotto.lotto_category === 'หวยไทย') return 1;
      return 0;
    });

    uniqueLotteries = Array.from(
      new Map(
        playlist.map(lottery => [lottery.lotto.lotto_category, lottery])
      ).values()
    );

    playlistTH = playlist.filter(data => data.lotto.lotto_category == 'หวยไทย');
    playlistAbroad = playlist.filter(data => data.lotto.lotto_category == 'หวยต่างประเทศ');
  });
</script>

{#each uniqueLotteries as lottery}
{#if lottery.lotto.lotto_category}
<div class="grid border-8 border-gray-200 rounded-[1rem] shadow-md bg-white p-4">
  <div class="flex flex-row items-center border-b border-gray-300 pb-4">
    <p class="text-xl sm:text-2xl font-bold mx-2 sm:mx-4 pr-4">
      {lottery.lotto.lotto_category}
    </p>
  </div>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 px-4 sm:px-6 lg:px-8">
    {#if isLoading}
      <p>Loading...</p>
    {:else}
      {#each (lottery.lotto.lotto_category == "หวยไทย" ? playlistTH : playlistAbroad) as card}
        <CardLotto
          headerColorClass={card.headerColorClass}
          headerImageBackground={"https://images.squarespace-cdn.com/content/v1/58cd025a4402439656dae04f/1561314690504-Y25AJHYE86T7YBYI3VV0/Reis+naar+Thailand+boeken-3.JPG"}
          icon={card.lotto.lotto_image}
          title={card.lotto.lotto_name}
          countDownText={card.round_date}
          details={formatDateTime(card.round_date, card.lotto.default_close_bet_minutes)}
          open={true}
          name={card.lotto.lotto_name}
          agent={false}
          lottoId={card.id}
          endBetMin={card.lotto.default_close_bet_minutes}
        />
      {/each}
      {#if lottery.lotto.lotto_category == "หวยต่างประเทศ"}
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
    {/if}
  </div>
</div>
{/if}
{/each}