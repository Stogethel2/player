<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';

    let { data }: { data: PageData } = $props();
    const redirect = async (): Promise<void> => {
        let token = localStorage.getItem("token");

        // ส่ง token ไปใน URL
        await goto(`/seamless?token=${token}`, { replaceState: true });
        location.reload(); // รีเฟรชหน้าหลังจาก redirect
    };
    onMount(() => {
        redirect(); // เรียกใช้ redirect เมื่อโหลดหน้า
    });
</script>