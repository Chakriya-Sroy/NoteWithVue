<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "./stores/auth";
import type { CustomResponse, User } from "./types";
import { getToken } from "./utils/useCookie";
import { onMounted } from "vue";

const store = useAuthStore();
const { getProfile } = store;
const { user } = storeToRefs(store);

const fetchUserProfile = async () => {
  const token = getToken();

  if (!token) return; // no token not fetch
  if (user.value) return; // already fetch not fetch

  const res = (await getProfile()) as CustomResponse<User>;
  if (res?.status?.success) {
    user.value = res?.data;
  }
};

onMounted(async () => {
  await fetchUserProfile();
});
</script>
<template>
  <router-view />
</template>


<style scoped></style>
