<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label?: string;
  color?: "primary" | "error" | "neutral" | "success";
  variant?: "solid" | "subtle";
}

const props = withDefaults(defineProps<Props>(), {
  color: "primary",
  variant: "solid",
});

const dynamicClass = computed(() => {
  switch (props.color) {
    case "primary":
      return props.variant === "solid"
        ? "bg-blue-700 hover:bg-blue-800 text-white"
        : "text-blue-700 hover:bg-blue-50 dark:hover:bg-transparent";

    case "error":
      return props.variant === "solid"
        ? "bg-red-700 hover:bg-red-800 text-white"
        : "text-red-700 hover:bg-red-50";

    case "success":
      return props.variant === "solid"
        ? "bg-green-700 hover:bg-green-800 text-white"
        : "text-green-700 hover:bg-green-50";

    case "neutral":
      return props.variant === "solid"
        ? "bg-gray-100 hover:bg-gray-200 "
        : "text-gray-700 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-gray-800";

    default:
      return "";
  }
});
</script>

<template>
  <button
    class="flex flex-row gap-2 justify-center items-center p-2 rounded-sm cursor-pointer"
    :class="dynamicClass"
    v-bind="$attrs"
  >
    <slot name="default">
      <slot name="icon"></slot>
      {{ props.label }}
    </slot>
  </button>
</template>

<style scoped></style>
