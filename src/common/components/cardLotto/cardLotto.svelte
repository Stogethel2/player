<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import AlarmClock from "lucide-svelte/icons/alarm-clock";
  import ButtonCardLotto from "./buttonCardLotto.svelte";
  import { goto } from "$app/navigation";
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

  function handleButtonClick() {
    console.log("Button clicked for:", name);
    if (name === "yeekee") {
      goto("/yeekee");
    } else {
      goto("/play?lottoId=" + lottoId);
    }
  }

  let dateRun: string = "";

  // ตัวแปรสำหรับเวลา
  let days,
    hours,
    minutes,
    seconds = 0;

  let hoursToStr,
    minutesToStr,
    secondsToStr = "";

  // คำนวณเวลาที่เหลือ
  function calculateTimeLeft(targetDate: string, endBetMin: number): string {
    // set now to timezone UTC+7
    let now = new Date();

    // set date to timezone UTC+7
    let date = new Date(targetDate.replace('T', ' ').split('.')[0]);
    date.setHours(date.getHours() + 7);

    let end_bet_min = new Date(date.getTime() - endBetMin * 60 * 1000);
    let difference = Number(end_bet_min) - Number(now);

    if (difference > 0) {
      days = Math.floor(difference / (1000 * 60 * 60 * 24));
      hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      minutes = Math.floor((difference / (1000 * 60)) % 60);
      seconds = Math.floor((difference / 1000) % 60);
      hoursToStr = hours.toString();
      minutesToStr = minutes.toString();
      secondsToStr = seconds.toString();
      if (hoursToStr.length == 1) {
        hoursToStr = "0" + hoursToStr;
      }
      if (minutesToStr.length == 1) {
        minutesToStr = "0" + minutesToStr;
      }
      if (secondsToStr.length == 1) {
        secondsToStr = "0" + secondsToStr;
      }
    } else {
      // ตั้งค่าทุกค่าเป็นศูนย์เมื่อถึงเวลาที่กำหนด
      days = 0;
      hoursToStr = minutesToStr = secondsToStr = "00";
      open = false;
    }
    return `เวลาซื้อเหลือ ${days} วัน ${hoursToStr}:${minutesToStr}:${secondsToStr}`;
  }

  onMount(() => {
    if (countDownText != "") {
      let targetDate = countDownText;

      if (targetDate && endBetMin >= 0) {
        timerIntervalTarget = setInterval(() => {
          dateRun = calculateTimeLeft(targetDate, endBetMin);
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
