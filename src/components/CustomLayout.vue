<script setup lang="ts">
import {
  ArrowUpDown,
  FileBarChart,
  FileBarChart2Icon,
  LogOut,
  Moon,
  Pen,
  Pin,
  Plus,
  Search,
  StickyNote,
  Sun,
  Trash2,
} from "lucide-vue-next";
import Button from "./Button.vue";
import { computed, onMounted, ref, watch } from "vue";
import { Folder, type Note } from "../types";
import Modal from "./Modal.vue";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";

interface Props {
  items: Note[];
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

let timeout: ReturnType<typeof setTimeout> | null = null;

watch(search, (newVal) => {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    emits("search", newVal);
  }, 1000); //
});

const sortOrder = ref<"asc" | "desc">("asc");

const handleSort = () => {
  sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  emits("sort", sortOrder.value);
};

const theme = ref("dark");

const handleSwitchTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";

  if (theme.value === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("theme", theme.value);
};
const headers = [
  {
    key: "all",
    label: "All Notes",
  },
  { key: "pinned", label: "Pinned" },
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

const folders=ref<Folder[]>([]);

const addNewFolder=()=>{
  const newFolder={
    id:"new",
    name:"New Folder"
  } as Folder;
  
  folders.value.push(newFolder);
}


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
    class="flex flex-col h-screen bg-white dark:bg-[#1a1a1a] dark:text-white"
  >
    <div
      class="grow-0 h-[75px] grid grid-cols-[0.75fr_1fr_2fr] border-b border-gray-200 dark:border-gray-800 divide-x divide-gray-200 dark:divide-gray-800"
    >
      <div class="flex items-center justify-between p-4">
        <p class="font-bold">MyNote</p>
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
      </div>
      <div class="flex flex-row items-center justify-between p-4">
        <p>{{ computedHeader }} ({{ items?.length }})</p>
        <Button @click="emits('add')">
          <Plus :size="20" />
          New Note
        </Button>
      </div>
      <div class="flex items-center p-4">
        <template v-if="open">
          <slot name="preview-header"></slot>
        </template>
      </div>
    </div>
    <div
      class="flex-1 grid grid-cols-[0.75fr_1fr_2fr] divide-x divide-gray-200 dark:divide-gray-800 overflow-hidden"
    >
      <div
        class="flex flex-col gap-4 justify-start items-start p-4 overflow-hidden"
      >
        <!--Search Path-->
        <div
          class="w-full mb-6 relative flex items-center border border-gray-100 dark:border-gray-800 rounded-md"
        >
          <Search class="text-gray-300 absolute top-auto bottom-auto left-2" />
          <input
            type="text"
            placeholder="Search....."
            v-model="search"
            class="w-full h-full p-2 indent-10 focus:outline-none bg-transparent"
          />
        </div>

        <template v-for="header in headers">
          <Button
            variant="subtle"
            :label="header.label"
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
        <div
          class="w-full flex flex-row gap-2 justify-between items-center mt-4 cursor-pointer text-gray-500"
        >
          <p class="font-medium">Folder</p>
          <Plus :size="20" @click="addNewFolder" />
        </div>

        <div class="flex-1 w-full overflow-scroll scrollbar-width-none">
          <template v-for="folder in folders" :key="folder.id" v-if="folders.length>0">
              <input type="text" :name="folder.id" id="" v-model="folder.name" class="w-full focus:outline-none bg-transparent">
          </template>
        </div>

        <div class="w-full mt-auto flex flex-row items-center justify-between">
          <div class="rounded-full bg-primary w-10 h-10"></div>
          <LogOut
            :size="20"
            class="cursor-pointer text-red-500"
            @click="openSignoutModal = true"
          />
        </div>
      </div>

      <div
        class="bg-gray-50 dark:bg-black overflow-auto h-full scrollbar-width-none"
      >
        <template v-if="items?.length > 0">
          <slot name="sidebar-items" :items="props.items">
            <div
              class="overflow-scroll flex flex-col gap-2 scrollbar-width-none p-4"
            >
              <template v-for="item in props.items">
                <slot name="item" :item="item"></slot>
              </template>
            </div>
          </slot>
        </template>
        <div class="flex flex-col items-center gap-4 mt-20 p-4" v-else>
          <div class="bg-gray-500/20 p-5 rounded-lg">
            <FileBarChart2Icon :size="70" class="text-gray-500" />
          </div>
          <p class="font-medium dark:text-white">No notes yet</p>
          <p class="font-semibold text-gray-500 text-center">
            Create your first note to get started organizing your thoughts
          </p>
          <Button @click="emits('add')">
            <Plus :size="20" />
            Create Note
          </Button>
        </div>
      </div>
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
              Select a note to view details
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>

  <Modal v-model:show="openSignoutModal" title="Confirm Logout">
    <p>Are you sure you want to log out?</p>

    <div class="flex justify-end gap-4 mt-4">
      <Button
        label="Cancel"
        variant="subtle"
        color="neutral"
        @click="openSignoutModal = false"
      />
      <Button label="Log Out" color="error" @click="handleSignOut" />
    </div>
  </Modal>
</template>

<style scoped>
.scrollbar-width-none {
  scrollbar-width: none;
}
</style>
