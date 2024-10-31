<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let initialActiveTags: string[] = [];

  let activeTags = initialActiveTags;

  const tags = [
    { id: "tag1", label: "เลขเด็ด" },
    { id: "tag2", label: "เลขดัง" },
    { id: "tag3", label: "เลขแม่หมอ" },
    { id: "tag4", label: "เลขอั้น" },
    { id: "tag5", label: "เลขฮิต" },
    { id: "tag6", label: "เลขตามวันเกิด" },
  ];

  function toggleTag(tagId: string) {
    activeTags = activeTags.includes(tagId)
      ? activeTags.filter((id) => id !== tagId)
      : [...activeTags, tagId];

    dispatch("tagsChanged", { activeTags });
  }
</script>

<div class="p-2">
  <p class="text-xs font-bold py-2 text-gray-500">ตัวเลขเพิ่มเติม</p>
  <div
    class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2"
  >
    {#each tags as tag}
      <button
        class="p-2 bg-gray-200 rounded-lg text-xs sm:text-sm transition-colors duration-200 ease-in-out"
        class:active={activeTags.includes(tag.id)}
        on:click={() => toggleTag(tag.id)}
        aria-pressed={activeTags.includes(tag.id)}
      >
        {tag.label}
      </button>
    {/each}
  </div>
</div>

<style lang="postcss">
  button {
    @apply hover:bg-opacity-80 focus:outline-none;
  }
  button.active {
    @apply font-semibold bg-red-600 text-white;
  }
</style>
