<script setup lang="ts">
import type { Note } from "@/types";
import { FileBarChart2Icon, Search } from "lucide-vue-next";
import { ref } from "vue";
import { vIntersectionObserver } from "@vueuse/components";
interface Props {
  loading?: boolean;
  items: Array<Note>;
  search?: string;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  loading: false,
  search: "",
});

const emits = defineEmits(["add", "intersection-observer"]);

const loadedNotes = ref(new Set());

const onNoteVisible = (noteId: string) => {
  return ([entry]: IntersectionObserverEntry[]) => {
    if (entry?.isIntersecting) {
      loadedNotes.value.add(noteId);
    }
  };
};

const loadMoreNotes = async ([entry]: IntersectionObserverEntry[]) => {
  if (entry?.isIntersecting) {
    emits("intersection-observer");
  }
};
</script>

<template>
  <div
    class="overflow-auto h-full scrollbar-width-none sm:p-4 p-0"
    v-bind="$attrs"
  >
    <template v-if="loading">
      <div class="flex flex-col items-center justify-center gap-4 mt-20 p-4">
        <div class="relative">
          <div
            class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-primary-500"
          ></div>
        </div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ $t("note.loading") }}
        </p>
      </div>
    </template>
    <template v-else-if="items?.length > 0">
      <slot name="sidebar-items" :items="props.items">
        <div class="overflow-scroll flex flex-col gap-2 scrollbar-width-none">
          <template v-for="item in props.items">
            <slot name="item" :item="item"></slot>
          </template>
        </div>
      </slot>
    </template>

    <template v-else-if="search && items?.length === 0">
      <div class="flex flex-col items-center gap-4 mt-20 p-4">
        <div class="bg-gray-500/20 p-5 rounded-lg">
          <Search :size="70" class="text-gray-500" />
        </div>
        <p class="font-medium dark:text-white">
          {{ $t("empty.search.title") }}
        </p>
        <p class="font-semibold text-gray-500 text-center">
          {{ $t("empty.search.desc", { query: search }) }}
        </p>
      </div>
    </template>

    <div
      class="flex flex-col items-center gap-4 mt-20 p-4"
      v-else-if="items?.length === 0 && search === ''"
    >
      <div class="bg-gray-500/20 p-5 rounded-lg">
        <FileBarChart2Icon :size="70" class="text-gray-500" />
      </div>
      <p class="font-medium dark:text-white">
        {{ $t("empty.notes.title") }}
      </p>
      <p class="font-semibold text-gray-500 text-center">
        {{ $t("empty.notes.desc") }}
      </p>
      <Button @click="emits('add')">
        <Plus :size="20" />
        {{ $t("empty.notes.button") }}
      </Button>
    </div>
    <div v-intersection-observer="loadMoreNotes" class="h-10">
      <!-- <p>Load more</p> -->
    </div>
  </div>
</template>

<style scoped></style>
