<script setup lang="ts">
import { XIcon } from "lucide-vue-next";

const show = defineModel("show", { default: false });
interface Props {
  title?: string;
}
const props = defineProps<Props>();
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
    @click.self="show = false"
  >
    <slot name="content">
      <div
        class="bg-white dark:bg-black dark:text-white border border-gray-100 dark:border-gray-900 rounded-lg w-full mx-4 sm:mx-0 sm:max-w-sm h-auto flex flex-col gap-4 p-4"
      >
        <slot name="header">
          <div class="flex flex-row items-center justify-between">
            <h3 v-if="props?.title" class="font-bold">{{ props?.title }}</h3>

            <button @click="show = false" class="cursor-pointer ms-auto">
              <XIcon :size="20" />
            </button>
          </div>
        </slot>

        <div class="max-w-sm text-wrap">
          <slot></slot>
        </div>
      </div>
    </slot>
  </div>
</template>

<style scoped></style>
