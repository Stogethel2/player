<script lang="ts">
  let { children } = $props();
  import Navbar from "../common/components/navbar/navbar.svelte";
  import "../app.css";
  import { page } from "$app/stores";

  let isLoginPage = $state(false);
  $effect(() => {
    if ($page.url.pathname === "/login") {
      isLoginPage = true;
    }
  })
</script>

{#if !isLoginPage}
  <Navbar />
{/if}

{@render children()}
