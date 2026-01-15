<script setup lang="ts">
import { formatDate } from "@/utils/formatTime";

interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

const props = defineProps<Note>();

const emits = defineEmits(["delete", "update", "click"]);

</script>

<template>
  <div
    class="flex flex-col gap-4 bg-white border border-gray-100 p-4 rounded-sm w-full cursor-pointer hover:bg-blue-50"
    v-bind="$attrs"
    @click="emits('click', id)"
  >
    <div class="flex flex-row justify-between items-center">
      <p class="text-xs text-secondary ms-auto">
        {{ formatDate(props?.updatedAt) }}
      </p>
    </div>
    <h3 class="font-medium text-md">{{ props?.title }}</h3>
    <p class="text-sm font-normal line-clamp-2">{{ props?.content }}</p>
  </div>
</template>

<style scoped></style>
