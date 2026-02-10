<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label?: string;
  color?: "primary" | "error" | "neutral" | "success";
  variant?: "solid" | "subtle" |"link";
}

const props = withDefaults(defineProps<Props>(), {
  color: "primary",
  variant: "solid",
});

const dynamicClass = computed(() => {
  switch (props.color) {
    case "primary":
      if (props.variant === "solid") {
        return "bg-primary hover:bg-primary-hover text-dark font-medium";
      } else if (props.variant === "link") {
        return "text-primary hover:text-primary-hover";
      } else {
        return "text-primary hover:bg-primary-50 dark:hover:bg-transparent";
      }

    case "error":
      if (props.variant === "solid") {
        return "bg-red-700 hover:bg-red-800 text-white";
      } else if (props.variant === "link") {
        return "text-red-700 hover:text-red-800";
      } else {
        return "text-red-700 hover:bg-red-50 dark:hover:text-red-800 dark:hover:bg-transparent";
      }

    case "success":
      if (props.variant === "solid") {
        return "bg-green-700 hover:bg-green-800 text-white";
      } else if (props.variant === "link") {
        return "text-green-700 hover:text-green-800";
      } else {
        return "text-green-700 hover:bg-green-50 dark:hover:text-green-800 dark:hover:bg-transparent";
      }

    case "neutral":
      if (props.variant === "solid") {
        return "bg-gray-100 hover:bg-gray-200";
      } else if (props.variant === "link") {
        return "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white";
      } else {
        return "text-gray-700 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-gray-800";
      }

    default:
      return "";
  }
});
</script>

<template>
  <button
    class="flex flex-row gap-2 justify-center items-center p-2 rounded-sm cursor-pointer text-nowrap"
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
