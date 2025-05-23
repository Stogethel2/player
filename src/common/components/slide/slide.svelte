<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Swiper from "swiper";
    import { Autoplay } from "swiper/modules";
    import { fade } from "svelte/transition";
    import "swiper/css";

    import { BannerApi } from "$lib/api/endpoint/slide";
    import { agent_id } from "../../../routes/seamless/auth.store";

    let images: string[] = [];
    let isLoading = true;
    let swiper: Swiper | null = null;
    let swiperInitialized = false;

    const initSwiper = () => {
        // Check if container exists before initializing
        const swiperContainer = document.querySelector('.swiper-container');
        if (!swiperContainer) return;

        // Ensure there are slides to initialize with
        const slides = swiperContainer.querySelectorAll('.swiper-slide');
        if (!slides || slides.length === 0) return;

        try {
            swiper = new Swiper(".swiper-container", {
                modules: [Autoplay],
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 1.1,
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: false,
                },
                spaceBetween: 0,
                loop: true,
            });
            swiperInitialized = true;
        } catch (error) {
            console.error("Error initializing Swiper:", error);
        }
    };

    onMount(async () => {
        try {
            //Get from api
            const response = await BannerApi.getBannerAgent($agent_id ?? '');
            images = response.map((item) => item.image);
        } catch (error) {
            console.error("Error fetching banners:", error);
        } finally {
            isLoading = false;
        }

        // Initialize Swiper after a short delay to ensure DOM is ready
        setTimeout(() => {
            initSwiper();
        }, 100);
    });

    onDestroy(() => {
        try {
            if (swiper && swiperInitialized) {
                swiper.destroy(true, true); // true, true = destroy all events and elements
                swiper = null;
            }
        } catch (error) {
            console.error("Error destroying Swiper:", error);
        }
    });
</script>

<div class="banner-container">
    {#if isLoading}
        <div class="loading-spinner"></div>
        <p class="text-center">Loading...</p>
    {:else if images.length > 0}
        <div transition:fade={{ duration: 300 }} class="swiper-container">
            <div class="swiper-wrapper">
                {#each images as image}
                    <div class="swiper-slide">
                        <img
                            class="w-full h-full object-cover rounded-lg px-1"
                            src={image}
                            alt="Banner"
                            loading="lazy"
                        />
                    </div>
                {/each}
            </div>
        </div>
    {:else}
        <div class="no-banners">No banners available</div>
    {/if}
</div>

<style lang="postcss">
    .banner-container {
        @apply w-full overflow-hidden;
        animation: fadeInUp 0.5s ease-out;
    }

    .no-banners {
        @apply text-center py-8 text-lg font-semibold;
    }

    :global(.swiper-container) {
        @apply w-full h-full;
    }

    :global(.swiper-slide) {
        width: 100%; /* Fixed width */
        height: 100%; /* Fixed height */
        transition: all 0.3s ease;
    }

    :global(.swiper-slide img) {
        @apply rounded-lg w-full h-full object-cover;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 767px) {
        .banner-container {
            height: auto; /* Allow height to adjust on mobile */
        }

        :global(.swiper-slide) {
            width: 100%; /* Full width on mobile */
            height: auto; /* Allow height to adjust on mobile */
        }
    }

    @media (min-width: 768px) {
        :global(.swiper-container) {
            @apply py-2;
        }

        :global(.swiper-slide) {
            opacity: 0.7;
            transform: scale(0.9);
        }

        :global(.swiper-slide-prev),
        :global(.swiper-slide-next) {
            opacity: 0.85;
            transform: scale(0.95);
        }

        :global(.swiper-slide-active) {
            opacity: 1;
            transform: scale(1);
            z-index: 1;
        }

        :global(.swiper-slide-active img) {
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
