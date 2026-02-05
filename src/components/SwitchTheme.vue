<script setup lang="ts">
import { Moon, Sun } from "lucide-vue-next";


const theme = defineModel('theme',{default:'dark'});

const handleSwitchTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";

  const classList = document.documentElement.classList;

  classList.remove("light", "dark");
  classList.add(theme.value);

  localStorage.setItem("theme", theme.value);
};
</script>
<template>
  <Moon
    :size="20"
    class="cursor-pointer"
    v-if="theme === 'light'"
    @click="handleSwitchTheme"
  />
  <Sun
    :size="20"
    class="cursor-pointer"
    v-if="theme === 'dark'"
    @click="handleSwitchTheme"
  />
</template>

<style scoped></style>
