<script setup lang="ts">
import type { Note } from "../types";
import { formatDate } from "@/utils/formatTime";
import { Clock } from "lucide-vue-next";


const props = defineProps<Partial<Note>>();

const emits = defineEmits(["delete", "update", "click"]);
</script>

<template>
  <div
    class="flex flex-col gap-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 p-4 rounded-xl w-full cursor-pointer hover:border-2 hover:border-blue-100 dark:hover:border-gray-900 "
    v-bind="$attrs"
    @click="emits('click', id)"
  >
    <!-- <div class="flex flex-row justify-between items-center">
      <p class="text-xs text-center text-secondary ms-auto flex items-center">
        <Clock :size="15" class="inline me-2" /> {{ formatDate(props?.createdAt) }}
      </p>
    </div> -->
    <h3 class="font-medium text-md">{{ props?.title }}</h3>
    <p class="text-sm font-normal line-clamp-2">{{ props?.content }}</p>
    <p class="text-xs font-semibold text-gray-500"> {{ formatDate(props?.createdAt) }}</p>
  </div>
</template>

<style scoped></style>
