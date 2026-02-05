<script setup lang="ts">
import { useLocale } from "@/utils/useLocale";

const { locale, setLocale } = useLocale();

</script>
<template>
  <div
    class="flex flex-row border border-primary dark:border-gray-500 rounded-md w-fit overflow-hidden"
  >
    <button
      class="p-2 cursor-pointer"
      :class="locale === 'en' ? 'bg-primary' : ''"
      @click="setLocale('en')"
    >
      🇬🇧
    </button>
    <button
      class="p-2 cursor-pointer"
      :class="locale === 'km' ? 'bg-primary' : ''"
      @click="setLocale('km')"
    >
      🇰🇭
    </button>
  </div>
</template>

<style scoped></style>
