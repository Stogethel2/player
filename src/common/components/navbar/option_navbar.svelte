<script lang="ts">
  import { onMount } from "svelte";
  import Menu from "lucide-svelte/icons/menu";
  import X from "lucide-svelte/icons/x";
  import { Wallet, CirclePlus } from "lucide-svelte";
  import ThaiIcon from "$lib/assets/thailand_flag.png";
  import type { menuSetting } from "../../../interface/setting.type";

  let settings: menuSetting = {
    menu: [],
  };
  let isLoading = true;
  let isMenuOpen = false;

  onMount(async () => {
    try {
      const response = await fetch("/setting/settings.json");
      settings = await response.json();
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      isLoading = false;
    }
  });

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function closeMenu() {
    isMenuOpen = false;
  }
</script>

<div
  class="bg-gradient-to-b from-amber-300 via-amber-500 to-yellow-600 p-2 sm:p-3 lg:p-4"
>
  <div class="mx-auto sm:px-6 lg:px-8">
    <div class="flex items-center justify-between">
      <div class="lang flex cursor-pointer hover:shadow-lg">
        <img
          src={ThaiIcon}
          alt="Languages"
          class="w-8 rounded border hover:border-2"
        />
      </div>
      <button
        on:click={toggleMenu}
        class="menu text-white hover:text-red-800 border-white border-2 rounded p-1 transition duration-300 ease-in-out transform hover:scale-110"
        aria-label="Toggle menu"
      >
        <Menu size={28} />
      </button>
    </div>
  </div>
</div>

<!-- Sliding menu -->
<div
  class="fixed inset-y-0 right-0 w-72 bg-red-600 text-white shadow-lg transform {isMenuOpen
    ? 'translate-x-0'
    : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50 overflow-y-auto"
>
  <div class="p-4">
    <div class="flex justify-end p-2">
      <button
        on:click={toggleMenu}
        class="text-white hover:text-red-200 transition duration-300 ease-in-out mb-8"
        aria-label="Close menu"
      >
        <X size={28} />
      </button>
    </div>

    <h1 class="text-amber-300 font-bold text-2xl mb-4 items-center">
      <!-- LOGO NAME -->
    </h1>

    <!-- <div class="flex justify-center w-full pb-8">
      <nav
        class="flex flex-row items-center text-sm font-normal leading-relaxed antialiased bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md"
      >
        <a
          href="/withdraw"
          on:click={closeMenu}
          class="flex flex-col items-center justify-center px-2 py-3 w-1/2 transition-colors duration-200 text-red-500"
        >
          <Wallet size={32} />
          <p class="text-base mt-2">ถอนเงิน</p>
        </a>
        <div class="w-px h-full bg-gray-200"></div>
        <a
          href="/deposit"
          on:click={closeMenu}
          class="flex flex-col items-center justify-center px-2 py-3 w-1/2 transition-colors duration-200 text-green-500"
        >
          <CirclePlus size={32} />
          <p class="text-base mt-2">ฝากเงิน</p>
        </a>
      </nav>
    </div> -->

    {#if isLoading}
      <p class="text-center text-xl font-semibold p-2">Loading...</p>
    {:else}
      <nav class="flex flex-col space-y-6 p-2">
        {#each settings.menu as { path, label }}
          <a
            href={path}
            on:click={closeMenu}
            class="text-lg font-medium hover:text-red-200 transition duration-300 ease-in-out transform hover:translate-x-2"
          >
            {label}
          </a>
        {/each}
      </nav>
    {/if}
  </div>
</div>
