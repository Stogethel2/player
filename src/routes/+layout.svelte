<script lang="ts">
  let { children } = $props();
  import "../app.css";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Navbar from "../common/components/navbar/navbar.svelte";
  import { balanceRoundApi } from "$lib/api/endpoint/balance";

  let name = $state('');
  let credits = $state(0);

  const getBalance = async (): Promise<void> => {
    const username = localStorage.getItem('username');
    try {

      if (username) {

        const responseGetBalance = await balanceRoundApi.getBalance(username);
        name = responseGetBalance.username;
        credits = responseGetBalance.balance;

      }
    } catch (error) {
      console.error("Error in login:", error);
    }
  };

  onMount( () => {
    if ($page.url.pathname === "/") goto("/seamless");
    // จะทำงานทุกครั้งที่ URL เปลี่ยน
    const unsubscribe = page.subscribe((currentPage) => {
      (async () => {
        if ($page.url.pathname !== '/seamless') await getBalance();
      })().catch((error) => {
        console.error('Error fetching balance:', error);
      });
    });

    return () => unsubscribe();
  });
</script>

{#if $page.url.pathname !== '/seamless'}
<Navbar {name} {credits} />
{/if}
{@render children()}
