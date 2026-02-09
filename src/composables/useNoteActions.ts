import type { Note } from "@/types";
import { storeToRefs } from "pinia";
import type { Ref } from "vue";
import { useNoteStore } from "@/stores/note";

type NoteStore = ReturnType<typeof useNoteStore>;

interface UseNoteActionCallbacks {
  onNoteSelected?: (note: Note) => void;
  onNoteCreated?: (note: Note) => void;
  onNotePinToggled?: (note: Note) => void;
  onSuccess?: (msg: string) => void;
  onError?: (msg: string) => void;
  onDeleteError?: (msg: string) => void;
  onDeleteSuccess?: (meg: string) => void;
}

export const useNoteAction = (
  store: NoteStore,
  callbacks: UseNoteActionCallbacks = {},
) => {
  const { notes } = storeToRefs(store);

  const {
    deleteNoteById,
  } = store;

  // Create new note without mutating existing refs
  const addNewNote = (isPinned: boolean = false) => {
    const newNote: Note = {
      id: "new",
      title: "New Note",
      content: "",
      pinned: isPinned,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Notify via callback instead of mutating external refs
    callbacks.onNoteCreated?.(newNote);

    // Exclude id
    return newNote;
  };

  // Open note by returning it, not mutating refs
  const handleOpenNote = (id: string) => {
    const foundNote = notes.value.find((note) => note.id === id);

    if (foundNote) {
      // Return note via callback instead of setting external ref
      callbacks.onNoteSelected?.(foundNote);
      return foundNote;
    }

    return null;
  };

  // Toggle pin immutably
  const pinnedNote = (note: Note) => {
    const updatedNote: Note = {
      ...note,
      pinned: !note.pinned,
    };

    // Update in store
    notes.value = notes.value.map((n) => (n.id === note.id ? updatedNote : n));

    // Notify via callback
    callbacks.onNotePinToggled?.(updatedNote);
  };

  const deleteNote = async (
    id: string
  ) => {
    const res = await deleteNoteById(id);

    if (res?.status?.success) {
      // Update in store
      notes.value = notes.value.filter((n) => n.id !== id);
      // Notify via callback
      callbacks.onDeleteSuccess?.(res?.status?.message);
    } else {
      callbacks.onDeleteError?.(res?.status?.message ?? "Fail To Delete Note");
    }
  };

  return {
    addNewNote,
    handleOpenNote,
    pinnedNote,
    deleteNote,
  };
};
