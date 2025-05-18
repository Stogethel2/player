<script lang="ts">
  import { goto } from "$app/navigation";
  import { Home, Award, History, UserPlus, HelpCircle } from "lucide-svelte";
  import Menu from "lucide-svelte/icons/menu";
  import X from "lucide-svelte/icons/x";
  import ThaiIcon from "$lib/assets/thailand_flag.png";
  import type { menuSetting } from "../interface/setting.type";
  import { onMount } from "svelte";

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

  function handleNavigation(path: string) {
    isMenuOpen = false;
    goto(path);
  }
</script>

<!-- Header with language selector and menu button -->
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
        class="toggle-menu menu text-white hover:text-red-800 border-white border-2 rounded p-1 transition duration-300 ease-in-out transform hover:scale-110"
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

    {#if isLoading}
      <p class="text-center text-xl font-semibold p-2">Loading...</p>
    {:else}
      <nav class="flex flex-col space-y-6 p-2">
        {#each settings.menu as { path, label }}
          <button
            class="text-lg font-medium hover:text-red-200 transition duration-300 ease-in-out transform hover:translate-x-2 cursor-pointer"
            on:click={() => handleNavigation(path)}
          >
            {label}
          </button>
        {/each}
      </nav>
    {/if}
  </div>
</div>

<!-- Mobile navigation bar at bottom -->
<div class="menu-mobile bg-gradient-to-r from-red-700 to-red-900 w-full">
  {#each settings.menu as { path, label }}
    <div class="menu-item-mobile">
      <button
        class="text-lg font-medium hover:text-red-200 transition duration-300 ease-in-out transform hover:translate-x-2 cursor-pointer"
        on:click={() => handleNavigation(path)}
      >
        {#if label == "หน้าแรก"}
          <Home size={32} />
        {/if}
        {#if label == "ผลรางวัล"}
          <Award size={32} />
        {/if}
        {#if label == "ประวัติการซื้อ"}
          <History size={32} />
        {/if}
        {#if label == "แนะนำเพื่อน"}
          <UserPlus size={32} />
        {/if}
        {#if label == "ช่วยเหลือ"}
          <HelpCircle size={32} />
        {/if}
      </button>
    </div>
  {/each}
</div>

<style>
  .toggle-menu {
    display: none;
  }

  .menu-mobile {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    color: white;
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
    z-index: 40;
  }

  .menu-item-mobile {
    text-align: -webkit-center;
    flex: 1;
  }

  @media (min-width: 768px) {
    .menu-mobile {
      display: none;
    }
    .toggle-menu {
      display: flex;
    }
  }

  @media (max-width: 767px) {
    .navigation-desktop {
      display: none;
    }
  }
</style> 