<script lang="ts">
    import LogOut from "lucide-svelte/icons/log-out";
    import SquareUserRound from "lucide-svelte/icons/square-user-round";
    import { onDestroy, onMount } from "svelte";
    import type { brandSetting } from "../../../interface/setting.type";
    import { goto } from "$app/navigation";
    import { userAuth, userLogout } from "$lib/utils/user-auth";

    let settings: brandSetting = {
        logo: { type: "text", value: "Loading..." },
    };

    onMount(async () => {
        // Check Auth token
        if (!localStorage.getItem("token")) {
            await goto("/seamless?token=null", { replaceState: true });
            console.error("Token not found");
            return;
        }
        const response = await fetch("/setting/settings.json"); // ดึงข้อมูลจาก static/settings.json
        settings = await response.json();
    });

    export let credits = 0;
    export let name = "lorem";
    export let currency = "THB";
    function formatCredits(credits: number): string {
        return credits.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const logout = async (): Promise<void> => {
        userLogout();
    };

</script>

<div class="w-full bg-black text-white border-b border-gold">
    <div class="w-full mx-auto px-0 md:px-8 lg:px-16 max-w-7xl">
        <div class="flex flex-col sm:flex-row items-center justify-between w-full py-3 px-4">
            <h1 class="text-gold font-bold text-2xl mb-4 sm:mb-0">
                {settings.logo.value}
            </h1>
            <div
                class="flex border-2 border-gold rounded-md justify-between items-center w-full sm:w-auto max-w-full sm:max-w-xs"
            >
                <div class="p-2 text-white">
                    <SquareUserRound size={32} />
                </div>
                <div
                    class="text-white mr-4 flex-grow sm:flex-grow-0 overflow-hidden"
                >
                    <p class="text-xs truncate">username: {name}</p>
                    <p class="text-xs truncate">
                        ยอดเงินคงเหลือ: {formatCredits(credits)}
                        {currency}
                    </p>
                </div>

                <button
                    class="text-white p-2 bg-black border border-gold mx-2 rounded-md cursor-pointer hover:bg-gold hover:text-black transition duration-300"
                    on:click={async () => await logout()}
                >
                    <LogOut size={18} />
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    /* Custom gold color for consistency with navigation */
    :root {
        --gold: #FFD700;
    }

    .text-gold {
        color: var(--gold);
    }

    .border-gold {
        border-color: var(--gold);
    }
</style>
