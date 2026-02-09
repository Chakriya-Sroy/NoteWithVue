<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import NoteCard from "../components/NoteCard.vue";
import Modal from "../components/Modal.vue";
import { PinIcon, PinOff, Trash2 } from "lucide-vue-next";
import CustomLayout from "../components/CustomLayout.vue";
import Button from "../components/Button.vue";
import type { Note, NoteWithoutId } from "../types";
import { useNoteStore } from "../stores/note";
import { storeToRefs } from "pinia";
import { customToastPlugin } from "../plugins/useToast";
import { QuillEditor } from "@vueup/vue-quill";
import { useFetch, watchDebounced } from "@vueuse/core";
import { useNoteAction } from "@/composables/useNoteActions";

const showCreateModal = ref(false);
const showUpdateModal = ref(false);
const showDeleteModal = ref(false);
const openNote = ref(false);

const editorRef = ref();

// Fix 1: Make selectedNote nullabl
// e instead of Partial
const selectedNote = ref<Note | null>(null);

const store = useNoteStore();

const { notes, loading, meta } = storeToRefs(store);

const { success, error } = customToastPlugin();

const {
  getAllNotes,
  getNoteById,
  updateNoteById,
  createNewNote,
  deleteNoteById,
} = store;

const noteHeader = ref("all");
const isCreatingNote = ref(false);

const handleSearch = async (val: string) => {
  await getAllNotes({ search: val });
};

const getText = (text: string) => {
  const htmlString = text;
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const textContent = doc.body.textContent;
  return textContent;
};

const isInitialLoad = ref(false);

// const handleSort = (order: string) => {
//   const sorted = [...notes.value].sort((a, b) =>
//     order === "asc"
//       ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
//       : new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
//   );

//   notes.value = sorted;
// };

const displayNotes = computed(() => {
  return noteHeader.value === "all"
    ? notes.value
    : notes.value.filter((note) => note.pinned === true);
});

const handleFetchMoreNotes = async () => {
  if (meta.value) {
    const currentpage = meta.value?.page;
    const previousNotes = [...notes.value]; // Create a copy
    if (notes.value.length < meta.value?.total) {
      await getAllNotes({ page: currentpage + 1 });
      notes.value = [...previousNotes, ...notes.value];
    }
  }
};

const submitUpdateNote = async (data: Partial<Note>) => {
  if (!selectedNote.value?.id) return;

  const id = selectedNote.value.id;
  const res = await updateNoteById(id, data);
  if (res?.status?.success) {
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

const submitCreateNote = async (data: Partial<Note>) => {
  try {
    const res = await createNewNote(data);
    if (res?.status?.success) {
      selectedNote.value = res?.data as Note; // Add type assertion
      notes.value = notes.value.map((n) =>
        n.id === "new" ? selectedNote.value : n,
      ); // Update Notes List
    } else {
      error(res?.status?.message ?? "Fail To Create Note");
    }
  } catch (err: any) {
    error(err?.message ?? "Error");
  }
};

const { deleteNote, addNewNote, pinnedNote, handleOpenNote } = useNoteAction(
  store,
  {
    onNoteSelected: (note: Note) => {
      isInitialLoad.value = true;
      openNote.value = true;
      selectedNote.value = note;
      editorRef.value?.setHTML(selectedNote.value?.content);
    },
    onNoteCreated: async (newNote: Note) => {
      isInitialLoad.value = true;
      openNote.value = true;
      selectedNote.value = newNote; // For preview
      notes.value = [newNote, ...notes.value]; // Update store immutably
      editorRef.value?.setHTML("");
    },
    onNotePinToggled: async (updatedNote: Note) => {
      selectedNote.value = updatedNote;
      await submitUpdateNote(selectedNote.value);
    },
    onDeleteError: (msg: string) => {
      error(msg);
    },
    onDeleteSuccess: async (msg: string) => {
      showDeleteModal.value = false;
      openNote.value = false;
      success(msg);
      await getAllNotes();
    },
  },
);

const handleTogglePinnedNote = () => {
  if (!selectedNote.value) {
    error("No note selected");
    return;
  }
  pinnedNote(selectedNote.value);
};

const handleAddNewNote = async () => {
  if (selectedNote.value?.id === "new") return;

  const newNote = addNewNote(noteHeader.value === "all" ? false : true);
  // submit
  const { id, ...data } = newNote;
  await submitCreateNote(data);
};

// Simplified - no need for extra arrow function wrapper
const handleDeleteNote = async () => {
  if (!selectedNote.value) {
    error("No note selected");
    return;
  }
  await deleteNote(selectedNote.value.id);
};

watchDebounced(
  () => [selectedNote.value?.content, selectedNote.value?.title],
  async (oldVal, newVal) => {
    if (isInitialLoad.value) {
      isInitialLoad.value = false;
      return;
    }

    if (!selectedNote.value) return;
    const data = selectedNote.value;
    await submitUpdateNote(data);
  },
  { debounce: 500 },
);

onMounted(async () => {
  document.title = "HomePage";
  await getAllNotes();
});
</script>

<template>
  <CustomLayout
    v-model:open="openNote"
    :items="displayNotes"
    :loading="loading"
    @add="handleAddNewNote"
    @search="handleSearch"
    @filter-header="(val) => (noteHeader = val)"
    @intersection-observer="handleFetchMoreNotes"
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
          note.id === selectedNote?.id && openNote
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
          <Button
            @click="handleTogglePinnedNote"
            color="success"
            variant="subtle"
          >
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

  <!--Modal Part-->
  <Modal v-model:show="showDeleteModal" :title="$t('dialog.delete.header')">
    <p class="text-sm text-gray-500 my-4">
      {{ $t("dialog.delete.desc", { name: selectedNote?.title }) }}
    </p>
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
        :label="loading ? `${$t('button.delete')}...` : $t('button.delete')"
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
