<script lang="ts">
  import Announcement from "../../common/components/announcement/announcement.svelte";
  import LottoList from "../../common/components/lottoList/lottoList.svelte";
  import { onMount } from "svelte";
  import type { announceSetting } from "../../interface/setting.type";

  let settings: announceSetting = {
    announcement: "Loading...",
  };
  let isLoading = true;

  onMount(async () => {
    try {
      const response = await fetch("/setting/settings.json"); // ดึงข้อมูลจาก static/settings.json
      settings = await response.json();
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      isLoading = false;
    }
  });

  let category: string = "yeekee";
</script>

<Announcement details={settings.announcement} />
<LottoList {category} />
