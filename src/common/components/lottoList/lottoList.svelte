<script lang="ts">
  import { lottoApi } from "$lib/api/endpoint/lotto";
  import CardLotto from "../cardLotto/cardLotto.svelte";
  import { onMount } from "svelte";
  let playlist: any;
  let isLoading = true;

  export let category: string;

  onMount(async () => {
    try {
      let lottoData;
      if (category === "yeekee") {
        lottoData = await fetch("/setting/yeekeelist.json"); // ดึงข้อมูลจาก static/settings.json
      } else {
        lottoData = await lottoApi.getActiveLottos();
      }

      playlist = lottoData;
      const colors = [
        "bg-red-500",
        "bg-gray-500",
        "bg-orange-500",
        "bg-green-500",
        "bg-blue-500",
      ];
      playlist = playlist.map((card: any) => {
        card.header_color_class =
          colors[Math.floor(Math.random() * colors.length)];
        return card;
      });
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
        headerColorClass={card.header_color_class}
        headerImageBackground={"https://images.squarespace-cdn.com/content/v1/58cd025a4402439656dae04f/1561314690504-Y25AJHYE86T7YBYI3VV0/Reis+naar+Thailand+boeken-3.JPG"}
        icon={"https://cdn-icons-png.flaticon.com/512/630/630635.png"}
        title={card.lotto_name}
        countDownText={"เหลือเวลาอีก 0 วัน 00:00:00"}
        details={card.description}
        open={card.is_active}
        name={'test'}
        agent={card.lotto_name}
      />
    {/each}
  {/if}
</div>
