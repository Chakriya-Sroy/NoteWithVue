<script setup lang="ts">
import { ref } from "vue";
import NoteCard from "./components/NoteCard.vue";
import Modal from "./components/Modal.vue";

import { ArrowLeft, ArrowUpDown, Pen, Search, Trash2 } from "lucide-vue-next";
import { formatDate } from "./utils/formatTime";
import CustomLayout from "./components/CustomLayout.vue";
import Button from "./components/Button.vue";
import type { FormPayload, Note } from "./types";
import Form from "./components/Form.vue";
const notes = ref<Note[]>([]);

const showCreateModal = ref(false);
const showUpdateModal = ref(false);
const showDeleteModal = ref(false);
const openNote = ref(false);

const selectedNote = ref<Note>();

const findNoteById = (id: string) => {
  if (!id) {
    return;
  }
  return notes.value.find((note) => note.id === id);
};

const handleOpenNote = (id: string) => {
  openNote.value = true;
  selectedNote.value = findNoteById(id);
};

const handleOpenUpdateModal = () => {
  showUpdateModal.value = true;
};

const handleAddNewNote = (payload: FormPayload) => {
  const data = payload.data;
  notes.value.unshift(data);
  showCreateModal.value = false;
};

const handleUpdateNote = (payload: FormPayload) => {
  const selectedNoteId = selectedNote.value?.id;
  const length = notes.value.length;
  for (var i = 0; i < length; i++) {
    if (notes.value[i]?.id === selectedNoteId) {
      notes.value[i] = payload.data;
      break;
    }
  }

  showUpdateModal.value = false;
};

const handleOpenDeleteModal = () => {
  showDeleteModal.value = true;
  // selectedNote.value = findNoteById();
};

const handleOpenCreateModal = () => {
  showCreateModal.value = true;
};
const handleDeleteNote = () => {
  const newNotes = notes.value.filter(
    (note) => note.id !== selectedNote.value?.id
  );
  notes.value = newNotes;
  showDeleteModal.value = false;
  openNote.value = false;
};

const form = ref();

const closePreview = () => {
  openNote.value = false;
  selectedNote.value = {} as Note;
};
</script>

<template>
  <CustomLayout
    v-model:open="openNote"
    :items="notes"
    @add="handleOpenCreateModal"
  >
    <template #item="{ item: note }">
      <NoteCard
        :id="note.id"
        :title="note.title"
        :content="note?.content"
        :key="note.id"
        :updated-at="note?.updatedAt"
        :class="
          note.id === selectedNote?.id ? 'bg-blue-50! border-blue-100!' : ''
        "
        @click="handleOpenNote"
      />
    </template>
    <template #previewSelection>
      <div class="flex flex-row items-center justify-between mb-6">
        <Button color="neutral" variant="subtle" @click="closePreview">
          <ArrowLeft :size="20" />
          Back
        </Button>

        <p class="line-clamp-1">
          Last edited {{ formatDate(selectedNote?.updatedAt) }}
        </p>
        <div class="flex flex-row gap-4">
          <Button
            @click="handleOpenUpdateModal"
            color="success"
            variant="subtle"
          >
            <Pen :size="20" />
            Edit
          </Button>

          <Button @click="handleOpenDeleteModal" color="error" variant="subtle">
            <Trash2 :size="20" />
            Delete
          </Button>
        </div>
      </div>
      <p class="font-bold">{{ selectedNote?.title }}</p>
    </template>
  </CustomLayout>

  <Modal v-model:show="showCreateModal">
    <Form ref="form" @submit="handleAddNewNote" />
    <div class="flex flex-row justify-end gap-4">
      <Button
        color="neutral"
        variant="subtle"
        @click="showCreateModal = false"
        label="Cancel"
      >
      </Button>

      <Button color="primary" label="Save" @click="form?.submit()"></Button>
    </div>
  </Modal>
  <Modal v-model:show="showUpdateModal">
    <Form
      ref="form"
      mode="UPDATE"
      :initial-value="selectedNote"
      @submit="handleUpdateNote"
    />
    <div class="flex flex-row justify-end gap-4">
      <Button
        color="neutral"
        variant="subtle"
        @click="showUpdateModal = false"
        label="Cancel"
      >
      </Button>
      <Button color="success" label="Update" @click="form?.submit()"></Button>
    </div>
  </Modal>
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

<style scoped></style>
