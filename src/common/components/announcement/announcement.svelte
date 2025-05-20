<script lang="ts">
  import Volume2 from "lucide-svelte/icons/volume-2";
  export let details = "-";
</script>

<div
  class="my-1.5 p-1.5"
  style="background: linear-gradient(to top, #dab768, #a77338, #fef7b2, #dab768, #a77338);"
>
  <div class="flex">
    <div class="text-black text-sm flex items-center w-2/6 border-r-2">
      <span class="mr-1">ประกาศจากทางเว็บ</span>
      <Volume2 size={18} />
    </div>
    <div class="px-1.5 marquee w-4/6">
      <span class="text-sm text-black marquee-content">{details}</span>
    </div>
  </div>
</div>

<style>
  .marquee {
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
  }

  .marquee-content {
    display: inline-block;
    padding-left: 100%;
    animation: marquee 15s linear infinite;
  }

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
</style>
