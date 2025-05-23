<script lang="ts">
    import { onMount } from "svelte";
    import { lottoRuleApi } from '$lib/api/endpoint';
    import { agent_id } from './../../routes/seamless/auth.store';
    let content = '';

    onMount(async () => {
        try {
            const respones = await lottoRuleApi.getLottoRuleById($agent_id);
            content = respones && respones.rule_message ? respones.rule_message : '';
        } catch (error) {
            console.error("Error get lotto rule:", error);
        }
    });
</script>

{#if content != ''}
    <div class="bg-gradient-to-r my-1.5 p-1.5">
        <div>{@html content}</div>
    </div>
{:else}
    <div class="no-banners">No Lotto Rule</div>
{/if}
