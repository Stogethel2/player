<script lang="ts">
    import { onMount, type Snippet } from 'svelte';
    import type { LayoutData } from './$types';
    import { goto } from '$app/navigation';
    

    let { data, children }: { data: LayoutData, children: Snippet } = $props();
    
</script>

{@render children()}