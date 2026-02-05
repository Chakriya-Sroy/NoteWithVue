<script setup lang="ts">
import {
  ArrowLeft,
  FileBarChart,
  LogOut,
  Pen,
  Pin,
  Plus,
} from "lucide-vue-next";
import Button from "./Button.vue";
import { computed, onMounted, ref, watch } from "vue";
import { type Folder, type Note } from "../types";
import Modal from "./Modal.vue";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";
import { watchDebounced } from "@vueuse/core";
import NoteItemListContainer from "@/components/Note/itemListContainer.vue";
import SearchContainer from "./SearchContainer.vue";
import SwitchTheme from "./SwitchTheme.vue";
import SwitchLocale from "./SwitchLocale.vue";

interface Props {
  items: Note[];
  loading: boolean;
}

const props = defineProps<Props>();

const open = defineModel("open", { default: false });

const emits = defineEmits([
  "add",
  "search",
  "sort",
  "filter-header",
  "add-folder",
]);

const search = ref("");

watchDebounced(
  search,
  (newVal) => {
    emits("search", newVal);
  },
  { debounce: 1000, maxWait: 1000 },
);

const sortOrder = ref<"asc" | "desc">("asc");

const handleSort = () => {
  sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  emits("sort", sortOrder.value);
};

const theme = ref("dark");

const headers = [
  {
    key: "all",
    label: "note.all",
  },
  { key: "pinned", label: "note.pinned" },
];

const defaultHeader = ref("all");

const computedHeader = computed(() => {
  return (
    headers.find((header) => header.key === defaultHeader.value)?.label ||
    headers[0]?.label
  );
});

watch(defaultHeader, (newVal) => {
  emits("filter-header", newVal);
});

const folders = ref<Folder[]>([]);

const addNewFolder = () => {
  const newFolder = {
    id: "new",
    name: "New Folder",
  } as Folder;

  folders.value.push(newFolder);
};

const openSignoutModal = ref(false);

const store = useAuthStore();

const handleSignOut = () => {
  openSignoutModal.value = false;
  store.logout();
  router.push({ path: "/auth/login" });
};

onMounted(() => {
  theme.value = localStorage.getItem("theme") ?? "dark";
  document.documentElement.classList.toggle(theme.value);
});
</script>

<template>
  <div
    class="flex flex-col h-screen bg-white dark:bg-[#1a1a1a] dark:text-white w-full"
  >
    <slot name="mobile">
      <div
        class="sm:hidden bg-inherit p-4 flex flex-col gap-2 scrollbar-width-none"
        v-if="open == false"
      >
        <div class="flex flex-row justify-between items-center">
          <div class="rounded-full bg-primary  w-10 h-10"></div>
        </div>
        <SearchContainer v-model:search="search" />

        <div class="flex flex-row">
          <template v-for="header in headers">
            <Button
              variant="subtle"
              :label="$t(header.label)"
              :color="header.key === defaultHeader ? 'primary' : 'neutral'"
              class="w-full justify-start! items-start!"
              @click="defaultHeader = header.key"
            >
              <template #icon>
                <FileBarChart :size="20" v-if="header.key === 'all'" />
                <FileBarChart :size="20" v-if="header.key === 'trash'" />
                <Pin :size="20" v-if="header.key === 'pinned'" />
              </template>
            </Button>
          </template>
        </div>
        <NoteItemListContainer
          @add="emits('add')"
          :search="search"
          :items="items"
          :loading="loading"
        >
          <template #item="{ item }">
            <slot name="item" :item="item"></slot>
          </template>
        </NoteItemListContainer>
        <div
          class="fixed bottom-4 right-4 p-2 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg"
          @click="emits('add')"
        >
          <Plus :size="20" class="text-white" />
        </div>
      </div>
      <div class="sm:hidden p-4" v-else>
        <ArrowLeft :size="20" @click="open = false" class="cursor-pointer text-gray-500"/>
        <slot name="preview-header"></slot>
        <div class="w-full h-[1px] bg-gray-100 dark:bg-gray-600 my-2"></div>
        <slot name="preview-body"></slot>
      </div>
    </slot>

    <slot name="default">
      <div
        class="grow-0 h-[75px] hidden sm:grid grid-cols-[0.75fr_1fr_2fr] border-b border-gray-200 dark:border-gray-800 divide-x divide-gray-200 dark:divide-gray-800"
      >
        <div class="flex items-center justify-between p-4">
          <p class="font-bold">MyNote</p>
          <SwitchTheme v-model:theme="theme" />
        </div>
        <div class="flex flex-row items-center justify-between p-4">
          <p>{{ $t(`${computedHeader}`) }} ({{ items?.length }})</p>
          <Button @click="emits('add')">
            <Plus :size="20" />
            <span class="sm:hidden lg:inline-block">{{ $t("note.new") }}</span>
          </Button>
        </div>
        <div class="flex items-center p-4">
          <template v-if="open">
            <slot name="preview-header"></slot>
          </template>
        </div>
      </div>
      <div
        class="flex-1 hidden sm:grid grid-cols-[0.75fr_1fr_2fr] divide-x divide-gray-200 dark:divide-gray-800 overflow-hidden"
      >
        <div
          class="flex flex-col gap-4 justify-start items-start p-4 overflow-hidden"
        >
          <!--Search Path-->
          <div
            class="w-full mb-6 relative flex items-center border border-gray-100 dark:border-gray-800 rounded-md"
          >
            <SearchContainer v-model:search="search" />
          </div>

          <template v-for="header in headers">
            <Button
              variant="subtle"
              :label="$t(header.label)"
              :color="header.key === defaultHeader ? 'primary' : 'neutral'"
              class="w-full justify-start! items-start!"
              @click="defaultHeader = header.key"
            >
              <template #icon>
                <FileBarChart :size="20" v-if="header.key === 'all'" />
                <FileBarChart :size="20" v-if="header.key === 'trash'" />
                <Pin :size="20" v-if="header.key === 'pinned'" />
              </template>
            </Button>
          </template>

          <!-- 
          <div
            class="w-full flex flex-row gap-2 justify-between items-center mt-4 cursor-pointer text-gray-500"
          >
            <p class="font-medium">Folder</p>
            <Plus :size="20" @click="addNewFolder" />
          </div>
          <div class="flex-1 w-full overflow-scroll scrollbar-width-none">
            <template
              v-for="folder in folders"
              :key="folder.id"
              v-if="folders.length > 0"
            >
              <input
                type="text"
                :name="folder.id"
                v-model="folder.name"
                class="w-full focus:outline-none bg-transparent font-medium text-gray-600 my-2"
              />
            </template>
          </div> -->

          <div class="w-full mt-auto flex flex-col gap-4">

            <SwitchLocale />

            <div class="flex flex-row items-center justify-between">
              <div class="rounded-full bg-primary w-10 h-10"></div>
              <LogOut
                :size="20"
                class="cursor-pointer text-red-500"
                @click="openSignoutModal = true"
              />
            </div>
          </div>
        </div>

        <NoteItemListContainer
          :search="search"
          :loading="loading"
          :items="items"
          @add="emits('add')"
          class="bg-gray-50 dark:bg-black"
        >
          <template #item="{ item }">
            <slot name="item" :item="item"></slot>
          </template>
        </NoteItemListContainer>

        <div class="p-4">
          <template v-if="open">
            <slot name="preview-body"></slot>
          </template>
          <template v-else>
            <div class="flex flex-col items-center justify-center h-full gap-8">
              <div class="bg-gray-500/10 p-5 rounded-lg">
                <Pen :size="70" class="text-gray-500"></Pen>
              </div>
              <p class="text-lg font-bold text-gray-500">
                {{ $t("note.selectToView") }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </slot>
  </div>

  <Modal v-model:show="openSignoutModal" :title="$t('dialog.logout.header')">
    <p>{{ $t("dialog.logout.desc") }}</p>

    <div class="flex justify-end gap-4 mt-4">
      <Button
        :label="$t('button.cancel')"
        variant="subtle"
        color="neutral"
        @click="openSignoutModal = false"
      />
      <Button
        :label="$t('button.logout')"
        color="error"
        @click="handleSignOut"
      />
    </div>
  </Modal>
</template>

<style scoped>
.scrollbar-width-none {
  scrollbar-width: none;
}
</style>
