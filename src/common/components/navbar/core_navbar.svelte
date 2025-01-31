<script lang="ts">
    import LogOut from "lucide-svelte/icons/log-out";
    import SquareUserRound from "lucide-svelte/icons/square-user-round";
    import { onDestroy, onMount } from "svelte";
    import type { brandSetting } from "../../../interface/setting.type";
    import { goto } from "$app/navigation";
    import { userAuth, userLogout } from "$lib/utils/userAuth";

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

<div
    class="w-full bg-gradient-to-r from-red-700 to-red-900 px-4 py-3 sm:px-6 sm:py-4"
>
    <div class="flex flex-col sm:flex-row items-center justify-between w-full">
        <h1 class="text-amber-300 font-bold text-2xl mb-4 sm:mb-0">
            <!-- {settings.logo.value} -->
        </h1>
        <div
            class="flex border-2 rounded-md justify-between items-center w-full sm:w-auto max-w-full sm:max-w-xs"
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
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="text-white p-2 bg-red-950 mx-2 rounded-md cursor-pointer hover:bg-white hover:text-red-950 transition duration-300"
                on:click={async () => await logout()}
            >
                <LogOut size={18} />
            </div>
        </div>
    </div>
</div>
