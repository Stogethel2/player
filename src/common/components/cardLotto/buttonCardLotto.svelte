<script lang="ts">
  export let text: string;
  export let disabled: boolean = false;
  export let onClick: () => void;
  export let agent: boolean = false;

  function handleClick() {
    if (!disabled) {
      onClick();
    }
  }
</script>

<div class="flex justify-end">
  <div
    class="relative overflow-hidden group font-bold rounded-full w-24 sm:w-28 px-3 sm:px-4 py-2 transition-all duration-300 ease-out cursor-pointer
             {disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
             {agent ? 'agent' : ''}
             transform hover:scale-105 active:scale-100"
    on:click={handleClick}
    on:keydown={(e) => e.key === "Enter" && handleClick()}
    tabindex={disabled ? -1 : 0}
    role="button"
    aria-disabled={disabled}
  >
    <div
      class="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 bg-gold-gradient"
    ></div>
    <div
      class="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform bg-gold-gradient"
    ></div>
    <div class="relative flex items-center justify-center">
      <span
        class="text-black text-xs sm:text-sm group-hover:scale-105 transition-transform duration-300"
      >
        {text}
      </span>
    </div>
  </div>
</div>

<style lang="postcss">
  @media (prefers-reduced-motion: no-preference) {
    .agent {
      animation: float 0.3s ease-in-out infinite;
    }

    .agent:hover {
      animation: none;
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(2px);
    }
    50% {
      transform: translateY(-1px);
    }
  }
</style>
