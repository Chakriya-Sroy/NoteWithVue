<script setup lang="ts">
import {  onMounted, ref} from "vue";
import NoteCard from "../components/NoteCard.vue";
import Modal from "../components/Modal.vue";
import {
  PinIcon,
  PinOff,
  Trash2,
} from "lucide-vue-next";

import CustomLayout from "../components/CustomLayout.vue";
import Button from "../components/Button.vue";
import type {  Note, NoteWithoutId } from "../types";
import { useNoteStore } from "../stores/note";
import { storeToRefs } from "pinia";
import { customToastPlugin } from "../plugins/useToast";
import { QuillEditor } from "@vueup/vue-quill";
import {  watchDebounced } from "@vueuse/core";

const showCreateModal = ref(false);
const showUpdateModal = ref(false);
const showDeleteModal = ref(false);
const openNote = ref(false);

const editorRef = ref();

// Fix 1: Make selectedNote nullabl
// e instead of Partial
const selectedNote = ref<Note | null>(null);

const store = useNoteStore();

const { notes, loading } = storeToRefs(store);

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
  if (res?.status?.success) {
    selectedNote.value = res?.data as Note; // Remove 'as any'
    editorRef.value?.setHTML(res?.data?.content);
  }
};

const noteHeader = ref("all");

const handleAddNewNote = () => {
  // Fix 2: Create a proper Note object with all required fields
  const newNotes: Note = {
    id: "new",
    title: "Untitled",
    content: "",
    pinned: noteHeader.value == "all" ? false : true,
    updated_at: new Date().toISOString(),
  };
  notes.value = [newNotes, ...notes.value];
  openNote.value = true;
  selectedNote.value = newNotes;
  editorRef.value?.setHTML("");
};

const submitCreateNote = async (data: Partial<Note>) => {
  const res = await createNewNote(data);
  if (res?.status?.success) {
    showCreateModal.value = false;
    selectedNote.value = res?.data as Note; // Add type assertion
    isInitialLoad.value = true;
    await getAllNotes("", noteHeader.value == "all" ? false : true);
  } else {
    error(res?.status?.message ?? "Fail To Create Note");
  }
};

const submitUpdateNote = async (data: Partial<Note>) => {
  if (!selectedNote.value?.id) return;

  const id = selectedNote.value.id;
  const res = await updateNoteById(id, data);
  if (res?.status?.success) {
    showUpdateModal.value = false;
    selectedNote.value = res?.data as Note; // Add type assertion
    isInitialLoad.value = true;
    // Find index
    const updatedNoteId = notes.value.findIndex(
      (note) => note.id === selectedNote.value?.id,
    );
    // if it found
    if (updatedNoteId !== -1) {
      notes.value[updatedNoteId] = res?.data as Note;
    }
  } else {
    error(res?.status?.message ?? "Fail To Update Note");
  }
};

const handlePinnedNote = () => {
  if (!selectedNote.value) return;
  selectedNote.value.pinned = selectedNote.value.pinned === true ? false : true;
  submitUpdateNote(selectedNote.value);
};

const handleDeleteNote = async () => {
  // Fix 4: Check if selectedNote exists before accessing id
  if (!selectedNote.value?.id) return;

  const id = selectedNote.value.id;
  const res = await deleteNoteById(id);
  if (res?.status?.success) {
    showDeleteModal.value = false;
    openNote.value = false;
    success(res?.status?.message);
    await getAllNotes();
  } else {
    error(res?.status?.message ?? "Fail To Delete Note");
  }
};

const form = ref();

const handleSearch = async (val: string) => {
  await getAllNotes(val);
};

// const handleSort = (order: string) => {
//   const sorted = [...notes.value].sort((a, b) =>
//     order === "asc"
//       ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
//       : new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
//   );

//   notes.value = sorted;
// };

const getText = (text: string) => {
  const htmlString = text;
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const textContent = doc.body.textContent;
  return textContent;
};

const isInitialLoad = ref(false);

watchDebounced(
  () => [selectedNote.value?.content, selectedNote.value?.title],
  async (oldVal, newVal) => {
    if (isInitialLoad.value) {
      isInitialLoad.value = false;
      return;
    }

    if (!selectedNote.value) return;
    const data = selectedNote.value;

    if (selectedNote.value.id && selectedNote.value.id !== "new") {
      await submitUpdateNote(data);
    } else {
      const { id, ...payload } = data;
      const dataToSend: NoteWithoutId = payload;

      await submitCreateNote(dataToSend);
    }
  },
  { debounce: 2000 },
);

const handleFilterHeader = async (headerKey: string) => {
  noteHeader.value = headerKey;
  return headerKey === "all"
    ? await getAllNotes("", false)
    : await getAllNotes("", true);
};

onMounted(async () => {
  document.title = "HomePage";
  await getAllNotes();
});
</script>

<template>
  <CustomLayout
    v-model:open="openNote"
    :items="notes"
    :loading="loading"
    @add="handleAddNewNote"
    @search="handleSearch"
    @filter-header="handleFilterHeader"
  >
    <template #item="{ item: note }">
      <NoteCard
        :id="note.id"
        :title="note.title"
        :content="getText(note?.content ?? '')"
        :key="note.id"
        :updated_at="note?.updated_at"
        :pinned="note?.pinned"
        :class="
          note.id === selectedNote?.id
            ? 'border-primary-200! dark:border-gray-700! '
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
          v-if="selectedNote"
        />
        <div class="flex flex-row gap-4">
          <Button @click="handlePinnedNote" color="success" variant="subtle">
            <PinOff :size="20" v-if="selectedNote?.pinned" />
            <PinIcon :size="20" v-else />
            <span class="sm:inline hidden"> {{ $t("button.pinned") }}</span>
          </Button>

          <Button
            @click="showDeleteModal = true"
            color="error"
            variant="subtle"
          >
            <Trash2 :size="20" />
            <span class="sm:inline hidden"> {{ $t("button.delete") }}</span>
          </Button>
        </div>
      </div>
    </template>
    <template #preview-body>
      <template v-if="selectedNote">
        <QuillEditor
          ref="editorRef"
          theme="snow"
          v-model:content="selectedNote.content"
          contentType="html"
        />
      </template>
    </template>
  </CustomLayout>

  <Modal v-model:show="showDeleteModal" :title="$t('dialog.delete.header')">
    <p>{{ $t("dialog.delete.desc", { name: selectedNote?.title }) }}</p>
    <div class="flex flex-row gap-2 justify-end">
      <Button
        color="neutral"
        variant="subtle"
        @click="showDeleteModal = false"
        :label="$t('button.cancel')"
      >
      </Button>
      <Button
        color="error"
        :label="$t('button.delete')"
        @click="handleDeleteNote"
      ></Button>
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
