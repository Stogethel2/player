<script lang="ts">
  let { children } = $props();
  import "../../app.css";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { loginApi } from "$lib/api/login";
  import {
    token,
    username,
    agent_name,
    agent_id,
    isAuthenticated,
    clearAuth,
  } from "./auth.store";
  import { walletApi } from "$lib/api/endpoint/balance";
  import Navbar from "../../common/components/navbar/navbar.svelte";
  import { browser } from "$app/environment";
  import { CircleAlert } from "lucide-svelte";

  let name = $state("");
  let credits = $state(0);
  let currency = $state("");
  let isLoggedIn = $state(false);
  let isLoading = $state(true);

  const login = async (): Promise<void> => {
    try {
      const queryParams = Object.fromEntries($page.url.searchParams.entries());
      const queryToken = queryParams.token;
      const tokenValue =
        queryToken && queryToken !== "null" ? queryToken : $token;

      if (tokenValue && tokenValue !== "null") {
        token.set(tokenValue);

        const responseGetUsers = await loginApi.getUsers(tokenValue);
        username.set(responseGetUsers.username);
        agent_name.set(responseGetUsers.agent.name);
        agent_id.set(responseGetUsers.agent.agent_id);

        const responseGetBalance = await walletApi.getBalance();
        name = responseGetBalance?.username ?? $username;
        credits = responseGetBalance?.balance ?? 0;
        currency = responseGetBalance?.currency ?? "";

        if ($username) {
          isLoggedIn = true;
        }
      } else {
        clearAuth();
        isLoggedIn = false;
      }
    } catch (error) {
      console.error("Error in login:", error);
      // On error, check if we should clear auth
      if (error instanceof Error && error.message.includes("unauthorized")) {
        clearAuth();
        isLoggedIn = false;
      }
    } finally {
      isLoading = false;
    }
  };

  const handleNavigation = () => {
    if (browser) {
      if (!isLoggedIn && isAuthenticated()) {
        login();
      }
    }
  };

  let unsubscribeFromPage: (() => void) | undefined;

  onMount(() => {
    login().then(() => {
      if (browser) {
        window.addEventListener("popstate", handleNavigation);

        unsubscribeFromPage = page.subscribe(() => {
          handleNavigation();
        });
      }
    });

    return () => {
      if (browser) {
        window.removeEventListener("popstate", handleNavigation);
        if (unsubscribeFromPage) unsubscribeFromPage();
      }
    };
  });
</script>

{#if isLoading}
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white"
  >
    <div
      class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"
    ></div>
  </div>
{:else if isLoggedIn}
  <div class="app-container">
    <Navbar {name} {credits} {currency} />

    <div class="content-wrapper">
      {@render children()}
    </div>
  </div>
{:else}
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4"
  >
    <CircleAlert size={64} class="text-red-500 mb-4" />
    <h1 class="text-2xl font-bold mb-2">การเข้าถึงถูกปฏิเสธ</h1>
    <p class="text-lg text-center">
      ไม่สามารถเข้าใช้งานได้เนื่องจาก Token ไม่ถูกต้อง
    </p>
  </div>
{/if}

<style>
  :global(body) {
    background-color: #121212;
    color: #e0e0e0;
    margin: 0;
    padding: 0;
  }

  .app-container {
    min-height: 100vh;
    width: 100%;
    position: relative;
  }

  .content-wrapper {
    padding-bottom: 60px; /* Space for mobile navigation */
  }

  @media (min-width: 768px) {
    .content-wrapper {
      padding-bottom: 0; /* No bottom padding needed on desktop */
    }
  }

  :global(.card, .container, .box) {
    background-color: #1e1e1e;
    border-color: #333;
  }

  :global(a) {
    color: #bb86fc;
  }

  :global(button:not([class*="bg-"])) {
    background-color: transparent;
    color: #e0e0e0;
  }
</style>
