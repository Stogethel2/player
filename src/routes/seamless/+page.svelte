<script lang="ts">
  import Announcement from "../../common/components/announcement/announcement.svelte";
  import LottoList from "../../common/components/lottoList/lottoList.svelte";
  import Slide from "../../common/components/slide/slide.svelte";
  import { onMount } from "svelte";
  import type { announceSetting } from "../../interface/setting.type";
  import { lottoApi, announcementsApi } from '$lib/api/endpoint';
  import { agent_id, username } from "./auth.store";
  import type { RunText } from '$lib/interface/announcements.types';

  let settings: announceSetting = {
    announcement: "Loading...",
  };
  let isLoading = true;
  let announcements: RunText;

  onMount(async () => {
    try {
      const response = await fetch("/setting/settings.json");
      settings = await response.json();
      
      // Only fetch data if we have an agent_id (meaning user is logged in)
      if ($agent_id) {
        announcements = await announcementsApi.getAnnouncementsById($agent_id);
        if (announcements) {
          settings.announcement = announcements.run_message;
        }

        const lottoData = await lottoApi.getActiveLottos();
        /* Work in progress */
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      isLoading = false;
    }
  });
</script>

{#if $username}
  <Announcement details={settings.announcement} />
  {#if isLoading}
    <div class="flex justify-center items-center h-64">
      <p class="text-lg">Loading...</p>
    </div>
  {:else}
    <Slide />
  {/if}
  <LottoList category="" />
{/if}
