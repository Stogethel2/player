<script lang="ts">
  import Announcement from "../../common/components/announcement/announcement.svelte";
  import LottoList from "../../common/components/lottoList/lottoList.svelte";
  import Slide from "../../common/components/slide/slide.svelte";
  import { onMount } from "svelte";
  import type { announceSetting } from "../../interface/setting.type";
  import { lottoApi, announcementsApi } from '$lib/api/endpoint';
  import { agent_id } from "./auth.store";
  import type { RunText } from '$lib/interface/announcements.types';

  let settings: announceSetting = {
    announcement: "Loading...",
  };
  let isLoading = true;
  let announcements:RunText;

  onMount(async () => {
    try {
      const response = await fetch("/setting/settings.json"); // ดึงข้อมูลจาก static/settings.json
      settings = await response.json();
      announcements = await announcementsApi.getAnnouncementsById($agent_id ? $agent_id : '');
      if (announcements) {
        settings.announcement = announcements.run_message;
      }

      const lottoData = await lottoApi.getActiveLottos();
      /* Work in progress */
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      isLoading = false;
    }
  });
</script>

<Announcement details={settings.announcement} />
{#if isLoading}
  <p>Loading...</p>
{:else}
  <Slide />
{/if}
<LottoList category="" />
