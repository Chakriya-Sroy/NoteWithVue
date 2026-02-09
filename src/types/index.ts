export interface Note {
  id: string;
  title: string;
  pinned?: boolean;
  folder_id?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Error {
  path: string;
  message: string;
}

export interface FormPayload {
  valid: boolean;
  errors: Error[];
  data: Note;
}
export interface CustomResponse<T> {
  status: {
    success: boolean;
    message: string;
    code: number;
  };
  meta?: ResponseMeta;
  message: string;
  data?: T;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResponseMeta {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
}

export type NoteWithoutId = Omit<Note, "id">;
