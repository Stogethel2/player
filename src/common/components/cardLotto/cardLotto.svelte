<script lang="ts">
  import AlarmClock from "lucide-svelte/icons/alarm-clock";
  import ButtonCardLotto from "./buttonCardLotto.svelte";
  import { goto } from "$app/navigation";

  export let headerColorClass = "bg-gradient-to-r from-blue-500 to-purple-600";
  export let headerImageBackground: string | null = null;
  export let icon;
  export let title;
  export let countDownText;
  export let details;
  export let open = true;
  export let agent = false;
  export let name: string;

  function handleButtonClick() {
    console.log("Button clicked for:", name);
    if (name === "yeekee") {
      goto("/yeekee");
    } else {
      goto("/play");
    }
  }
</script>

<div
  class="card w-full max-w-sm mx-auto overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg"
>
  <div class="{headerColorClass} rounded-t-xl relative p-4">
    {#if headerImageBackground}
      <img
        src={headerImageBackground}
        alt=""
        class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
      />
    {/if}
    <div class="relative z-10 flex items-center mb-3">
      <img
        src={icon}
        alt=""
        class="w-8 h-8 rounded-full object-cover mr-3 border-2 border-white shadow-sm"
      />
      <h2 class="text-lg sm:text-xl font-bold text-white">{title}</h2>
    </div>
    {#if open}
      <p class="blink text-sm sm:text-base text-white font-semibold mb-2">
        {countDownText}
      </p>
      <div
        class="flex items-center text-xs sm:text-sm text-white bg-black bg-opacity-20 rounded-full px-3 py-1"
      >
        <AlarmClock size={16} class="mr-2 flex-shrink-0" />
        <span class="truncate">{details}</span>
      </div>
    {:else}
      <div
        class="bg-red-500 text-white text-sm font-semibold rounded-full px-3 py-1 inline-block"
      >
        หมดเวลารับแทง
      </div>
    {/if}
  </div>
  <div class="px-2 md:px-4 py-2 bg-white">
    {#if open}
      <ButtonCardLotto
        text="เดิมพัน"
        {agent}
        disabled={false}
        onClick={() => handleButtonClick()}
      />
    {:else}
      <p class="text-sm text-gray-500 italic">หมดเวลารับแทงสำหรับงวดนี้</p>
    {/if}
  </div>
</div>

<style lang="postcss">
  .card {
    @apply bg-white rounded-xl shadow-md;
  }
  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
  .blink {
    animation: blink 1.5s infinite;
  }
  .truncate {
    @apply overflow-hidden text-ellipsis;
  }
</style>
