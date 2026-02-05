<script setup lang="ts">
import { Search } from 'lucide-vue-next';

const search = defineModel<string>('search',{default:''});

</script>
<template>
  <div
    class="w-full mb-6 relative flex items-center border border-gray-100 dark:border-gray-800 rounded-md"
  >
    <Search class="text-gray-300 absolute top-auto bottom-auto left-2" />
    <input
      type="text"
      :placeholder="$t('search')"
      v-model="search"
      class="w-full h-full p-2 indent-10 focus:outline-none bg-transparent"
    />
  </div>
</template>

<style scoped></style>
