<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import AlarmClock from "lucide-svelte/icons/alarm-clock";
  import ButtonCardLotto from "./buttonCardLotto.svelte";
  import { goto } from "$app/navigation";
  import { calculateTimeLeft, type TimeLeft } from "$lib/utils/date-time.utils";
  export let headerImageBackground: string | null = null;
  export let icon;
  export let title;
  export let countDownText;
  export let details;
  export let open = true;
  export let agent = false;
  export let name: string;
  export let lottoId: string;
  export let endBetMin;
  export let round_status: string;

  let not_open = false;
  let timerIntervalTarget: ReturnType<typeof setInterval>;
  let dateRun: string = "";

  function handleButtonClick() {
    if (name === "yeekee") {
      goto("/yeekee");
    } else {
      goto("/play?lottoId=" + lottoId);
    }
  }

  onMount(() => {
    if (countDownText != "") {
      let targetDate = countDownText;

      if (targetDate && endBetMin >= 0) {
        timerIntervalTarget = setInterval(() => {
          const timeLeft = calculateTimeLeft(targetDate, endBetMin);
          dateRun = timeLeft.formattedText;

          if (timeLeft.isTimeUp) {
            open = false;
          }
        }, 1000);
      }

      if (round_status === "INACTIVE") {
        open = false;
        not_open = false;
      }
    } else {
      open = false;
      not_open = true;
    }
  });

  onDestroy(() => {
    if (timerIntervalTarget) {
      clearInterval(timerIntervalTarget);
    }
  });
</script>

<div
  class="card w-full max-w-sm mx-auto overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg"
>
  <div
    class="rounded-t-xl relative p-4"
    style="background-image: url({headerImageBackground})"
  >
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
        {dateRun}
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
        {not_open ? "ยังไม่เปิด" : "หมดเวลารับแทง"}
      </div>
    {/if}

    {#if open}
      <ButtonCardLotto
        text="ซื้อหวย"
        {agent}
        disabled={false}
        onClick={() => handleButtonClick()}
      />
    {:else}
      <p class="text-sm text-white-500 italic">
        {not_open ? "จะเปิดให้บริการเร็วๆนี้" : "หมดเวลารับแทงสำหรับงวดนี้"}
      </p>
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
