<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import NoteCard from "./components/NoteCard.vue";
import Modal from "./components/Modal.vue";
import {
  ArrowLeft,
  CalendarPlus,
  Clock,
  Pen,
  PinIcon,
  Trash2,
} from "lucide-vue-next";
import { formatDate } from "./utils/formatTime";
import CustomLayout from "./components/CustomLayout.vue";
import Button from "./components/Button.vue";
import type { FormPayload, Note } from "./types";
import Form from "./components/Form.vue";
import { useNoteStore } from "./stores/note";
import { storeToRefs } from "pinia";
import { customToastPlugin } from "./plugins/useToast";

const showCreateModal = ref(false);
const showUpdateModal = ref(false);
const showDeleteModal = ref(false);
const openNote = ref(false);

// Fix 1: Make selectedNote nullable instead of Partial
const selectedNote = ref<Note | null>(null);

const store = useNoteStore();

const { notes } = storeToRefs(store);

const { success, error } = customToastPlugin();

const {
  getAllNotes,
  getNoteById,
  updateNoteById,
  createNewNote,
  deleteNoteById,
} = store;

const handleOpenNote = async (id: string) => {
  openNote.value = true;
  isInitialLoad.value = true;
  const res = await getNoteById(id);
  if (res?.success) {
    selectedNote.value = res?.data as Note; // Remove 'as any'
  }
};

const handleAddNewNote = () => {
  // Fix 2: Create a proper Note object with all required fields
  const newNotes: Note = {
    id: "new",
    title: "Untitled",
    content: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  notes.value = [newNotes, ...notes.value];
  openNote.value = true;
  selectedNote.value = newNotes;
};

const submitCreateNote = async (data: Partial<Note>) => {
  const res = await createNewNote(data);
  if (res?.success) {
    showCreateModal.value = false;
    selectedNote.value = res?.data as Note; // Add type assertion
    isInitialLoad.value = true;
  } else {
    error(res?.message ?? "Fail To Create Note");
  }
};

const submitUpdateNote = async (data: Partial<Note>) => {
  // Fix 3: Check if selectedNote exists before accessing id
  if (!selectedNote.value?.id) return;
  
  const id = selectedNote.value.id;
  const res = await updateNoteById(id, data);
  if (res?.success) {
    showUpdateModal.value = false;
    selectedNote.value = res?.data as Note; // Add type assertion
    isInitialLoad.value = true;
    await getAllNotes();
  } else {
    error(res?.message ?? "Fail To Update Note");
  }
};

const handleDeleteNote = async () => {
  // Fix 4: Check if selectedNote exists before accessing id
  if (!selectedNote.value?.id) return;
  
  const id = selectedNote.value.id;
  const res = await deleteNoteById(id);
  if (res?.success) {
    showDeleteModal.value = false;
    openNote.value = false;
    success(res?.message);
    await getAllNotes();
  } else {
    error(res?.message ?? "Fail To Delete Note");
  }
};

const form = ref();

const handleSearch = async (val: string) => {
  await getAllNotes(val);
};

const handleSort = (order: string) => {
  const sorted = [...notes.value].sort((a, b) =>
    order === "asc"
      ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  notes.value = sorted;
};

const getText = (text: string) => {
  const htmlString = text;
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const textContent = doc.body.textContent;
  return textContent;
};

let timeout: ReturnType<typeof setTimeout> | null = null;
const isInitialLoad = ref(false);

watch(
  () => [selectedNote.value?.content, selectedNote.value?.title],
  async (oldVal, newVal) => {
    if (isInitialLoad.value) {
      isInitialLoad.value = false;
      return;
    }

    if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(async () => {
      // Fix 5: Check if selectedNote exists
      if (!selectedNote.value) return;
      
      const data = selectedNote.value;
      if (selectedNote.value.id && selectedNote.value.id !== "new") {
        await submitUpdateNote(data);
      } else {
        await submitCreateNote(data);
      }
    }, 500);
  },
  { deep: true },
);

onMounted(async () => {
  await getAllNotes();
});
</script>

<template>
  <CustomLayout
    v-model:open="openNote"
    :items="notes"
    @add="handleAddNewNote"
    @search="handleSearch"
    @sort="handleSort"
  >
    <template #item="{ item: note }">
      <NoteCard
        :id="note.id"
        :title="note.title"
        :content="getText(note?.content ?? '')"
        :key="note.id"
        :created-at="note?.createdAt"
        :class="
          note.id === selectedNote?.id
            ? 'border-blue-200! dark:border-gray-900! '
            : ''
        "
        @click="handleOpenNote"
      />
    </template>
    <template #preview-header>
      <div class="flex-1 flex flex-row items-center gap-4 justify-between">
        <input
          type="text"
          class="focus:ring-0 focus:outline-none w-full p-2 border-none ring-0 outline-none"
          v-model="selectedNote.title"
        />
        <div class="flex flex-row gap-4">
          <Button
            @click="showUpdateModal = true"
            color="success"
            variant="subtle"
          >
            <PinIcon :size="20" />
            Pin
          </Button>

          <Button
            @click="showDeleteModal = true"
            color="error"
            variant="subtle"
          >
            <Trash2 :size="20" />
            Delete
          </Button>
        </div>
      </div>
    </template>
    <template #preview-body>
      <QuillEditor
        ref="editor"
        theme="snow"
        v-model:content="selectedNote.content"
        contentType="html"
      />
    </template>
  </CustomLayout>

  <Modal v-model:show="showDeleteModal">
    <h1>Confirm Deletion</h1>
    <p>Are you sure u wnat to delete this note {{ selectedNote?.title }}</p>
    <div class="flex flex-row gap-2 justify-end">
      <Button
        color="neutral"
        variant="subtle"
        @click="showDeleteModal = false"
        label="Cancel"
      >
      </Button>
      <Button color="error" label="Delete" @click="handleDeleteNote"></Button>
    </div>
  </Modal>
</template>

<style>
.ql-toolbar.ql-snow {
  border: transparent !important;
}
.ql-container.ql-snow {
  border: transparent !important;
}
</style>
