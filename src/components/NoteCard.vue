<script setup lang="ts">
import type { Note } from "../types";
import { formatDate } from "@/utils/formatTime";
import { Clock, PinIcon } from "lucide-vue-next";

const props = defineProps<Partial<Note>>();

const emits = defineEmits(["delete", "update", "click"]);
</script>

<template>
  <div
    class="flex flex-col gap-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 p-4 rounded-xl w-full cursor-pointer hover:border-2 hover:border-primary-100 dark:hover:border-gray-900"
    v-bind="$attrs"
    @click="emits('click', id)"
  >
    <h3 class="font-medium text-md">{{ props?.title }}</h3>
    <p class="text-sm font-normal line-clamp-2">{{ props?.content }}</p>
    <div class="flex flex-row justify-between items-center">
      <p class="text-[10px] text-start text-secondary flex items-center">
        <Clock :size="10" class="inline me-2" />
        {{ formatDate(props?.updated_at) }}
      </p>
      <PinIcon :size="10" v-if="props.pinned" />
    </div>
  </div>
</template>

<style scoped></style>
