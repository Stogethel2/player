<script lang="ts">
  let { children } = $props();
  import "../app.css";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  onMount(() => {
    if ($page.url.pathname === "/") goto("/seamless");
  });
</script>

{@render children()}
