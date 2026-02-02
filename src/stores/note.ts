import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { CustomResponse, Note } from "../types";
import { apiFetch } from "../composables/useAPI";

export const useNoteStore = defineStore("stores", () => {
  const notes = ref<Note[]>([]);
  const loading = ref(false);
  const getAllNotes = async (search?: string, pinned?: boolean) => {
    try {
      loading.value = true;
      const route = search ? `/notes?search=${search}` : "/notes";
      const routeWithPinned = pinned
        ? `${route}${search ? "&" : "?"}pinned=${pinned}`
        : route;

      const response = (await apiFetch(routeWithPinned)) as CustomResponse<
        Note[]
      >;

      if (response?.status?.success) {
        notes.value = response?.data ?? ([] as Note[]);
      }
      return response;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const getNoteById = async (id: string) => {
    try {
      const response = (await apiFetch(`/notes/${id}`)) as CustomResponse<Note>;

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const createNewNote = async (payload: Partial<Note>) => {
    try {
      const response = (await apiFetch(`/notes`, {
        body: JSON.stringify(payload),
        method: "POST",
      })) as CustomResponse<Note>;

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const updateNoteById = async (id: string, payload: Partial<Note>) => {
    try {
      const response = (await apiFetch(`/notes/${id}`, {
        body: JSON.stringify(payload),
        method: "PUT",
      })) as CustomResponse<Note>;

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNoteById = async (id: string) => {
    try {
      const response = (await apiFetch(`/notes/${id}`, {
        method: "DELETE",
      })) as CustomResponse<Note>;

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    notes,
    loading,
    getAllNotes,
    getNoteById,
    createNewNote,
    updateNoteById,
    deleteNoteById,
  };
});
