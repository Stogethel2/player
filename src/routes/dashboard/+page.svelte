<script lang="ts">
  import LotteryResultsView from "../../components/lottery/LotteryResultsView.svelte";
  import { resultApi } from "$lib/api/endpoint/result";
  import type { LotteryResultData } from "$lib/interface/result.types";

  // Example of custom fetch function for a specific lottery
  async function fetchLatestLottery(date: string): Promise<LotteryResultData[]> {
    // You could use the date parameter if needed
    const response = await resultApi.getResultsByLottery("e45b4ef9-92b0-445a-a36b-01dc6f4673db");
    return response.data;
  }
</script>

<div class="dashboard-page">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h2 class="text-2xl font-bold mb-4">Dashboard Overview</h2>
      <!-- Other dashboard content would go here -->
    </div>
    
    <div>
      <!-- Example of reusing the lottery results component with custom settings -->
      <LotteryResultsView 
        title="ผลหวยล่าสุด" 
        showDatePicker={false}
        customFetchFunction={fetchLatestLottery} 
      />
    </div>
  </div>
</div>

<style>
  .dashboard-page {
    padding: 1rem;
  }
</style> 