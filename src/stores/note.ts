import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { CustomResponse, Note,ResponseMeta } from "../types";
import { apiFetch } from "../composables/useAPI";

export const useNoteStore = defineStore("stores", () => {
  interface GetNotesQuery{
    search?:string;
    pinned?:boolean;
    limit?:number;
    page?:number;
  }

  const notes = ref<Note[]>([]);
  const meta=ref<ResponseMeta>();
  const loading = ref(false);


  const getAllNotes = async (query?:GetNotesQuery) => {
    try {
      loading.value = true;

      const route = query?.search ? `/notes?search=${query?.search}&limit=${query?.limit ?? 10}&page=${query?.page ?? 1}` : `/notes?limit=${query?.limit ?? 10}&page=${query?.page ?? 1}`;

      const routeWithPinned = query?.pinned
        ? `${route}&pinned=${query?.pinned}`
        : route;

      const response = (await apiFetch(routeWithPinned)) as CustomResponse<
        Note[]
      >;

      if (response?.status?.success) {
        notes.value = response?.data ?? ([] as Note[]);
        meta.value=response?.meta;
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
      loading.value = true;
      const response = (await apiFetch(`/notes/${id}`, {
        method: "DELETE",
      })) as CustomResponse<Note>;
      return response;
    } catch (error) {
      loading.value = false;
      console.error(error);
    } finally {
      loading.value = false;

    }
  };

  return {
    notes,
    loading,
    meta,
    getAllNotes,
    getNoteById,
    createNewNote,
    updateNoteById,
    deleteNoteById,

  };
});
