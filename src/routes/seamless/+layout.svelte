<script lang="ts">
  let { children } = $props();
  import "../../app.css";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { loginApi } from "$lib/api/login";
  import { token, username, agent_name, agent_id } from "./auth.store";
  import { walletApi } from "$lib/api/endpoint/balance";
  import Navbar from "../../common/components/navbar/navbar.svelte";
  import Loading from "../../common/components/loading/loading.svelte";

  let name = $state("");
  let credits = $state(0);
  let currency = $state("");
  let isLoggedIn = $state(false);
  let isLoading = $state(true);

  const login = async (): Promise<void> => {
    try {
      const queryParams = Object.fromEntries($page.url.searchParams.entries());
      const tokenValue = queryParams.token ?? $token;

      if (tokenValue) {
        token.set(tokenValue);

        const responseGetUsers = await loginApi.getUsers(tokenValue);
        username.set(responseGetUsers.username);
        agent_name.set(responseGetUsers.agent.name);
        agent_id.set(responseGetUsers.agent.agent_id);

        const responseGetBalance = await walletApi.getBalance();
        name = responseGetBalance.username;
        credits = responseGetBalance.balance;
        currency = responseGetBalance.currency;

        if ($username) {
          isLoggedIn = true;
        }
      }
    } catch (error) {
      console.error("Error in login:", error);
    } finally {
      isLoading = false;
    }
  };

  onMount(async () => {
    await login();
  });
</script>

{#if isLoading}
  <div class="h-screen flex flex-col items-center justify-center">
    <Loading />
  </div>
{:else if isLoggedIn}
  <Navbar {name} {credits} {currency} />

  {@render children()}
{:else}
  <div class="h-screen flex flex-col items-center justify-center">
    <h1 class="text-xl font-bold">Token has expired</h1>
    <h1 class="text-lg">Please login again</h1>
  </div>
{/if}
