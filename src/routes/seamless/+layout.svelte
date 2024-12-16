<script lang="ts">
  let { children } = $props();
  import "../../app.css";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { loginApi } from "$lib/api/login";
  import { token, username } from "./auth.store";
  import { walletApi } from "$lib/api/endpoint/balance";
  import Navbar from "../../common/components/navbar/navbar.svelte";

  let isLoginPage = $state(false);
  let isLoaded = $state(false);
  let name = $state('');
  let credits = $state(0);

  const login = async (): Promise<void> => {
    try {
      const queryParams = Object.fromEntries($page.url.searchParams.entries());
      const tokenValue = queryParams.token ?? $token;

      if (tokenValue) {
        token.set(tokenValue);

        const responseGetUsers = await loginApi.getUsers(tokenValue);
        username.set(responseGetUsers.username);

        const responseGetBalance = await walletApi.getBalance(responseGetUsers.username);
        name = responseGetBalance.username;
        credits = responseGetBalance.balance;

        if ($username) {
          isLoginPage = true;
        }
      }
    } catch (error) {
      console.error("Error in login:", error);
    }
  };

  onMount(async () => {
    try {
      await login();
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      isLoaded = true;
    }
  });

  $effect(() => {
    if ($page.url.pathname === "/login") {
      isLoginPage = true;
    }
  });
</script>

{#if isLoginPage && isLoaded}
  <Navbar {name} {credits} />
  {@render children()}
{:else}
  <h1>Token doesn't work</h1>
{/if}
