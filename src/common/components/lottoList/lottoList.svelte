<script lang="ts">
  import CardLotto from "../cardLotto/cardLotto.svelte";
  import { onMount } from "svelte";
  let playlist: any;
  let isLoading = true;

  export let category: string;

  onMount(async () => {
    try {
      let response = null;
      if (category === "yeekee") {
        response = await fetch("/setting/yeekeelist.json"); // ดึงข้อมูลจาก static/settings.json
      } else {
        response = await fetch("/setting/playlist.json"); // ดึงข้อมูลจาก static/settings.json
      }
      playlist = await response.json();
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
    {#each playlist.list as card}
      <CardLotto
        headerColorClass={card.header_color_class}
        headerImageBackground={card.header_image_background}
        icon={card.icon}
        title={card.title}
        countDownText={card.time}
        details={card.detail}
        open={card.open}
        name={card.name}
        agent={card.agent}
      />
    {/each}
  {/if}
</div>
