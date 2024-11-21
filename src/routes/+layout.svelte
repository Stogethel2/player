<script lang="ts">
  let { children } = $props();
  import Navbar from "../common/components/navbar/navbar.svelte";
  import "../app.css";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  onMount(() => {
    if ($page.url.pathname === "/") goto("/seamless");
  });
</script>

<Navbar />
{@render children()}
