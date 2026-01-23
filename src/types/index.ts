export interface Note {
  id: string;
  title: string;
  pinned?: boolean;
  folder_id?:string;
  content?: string;
  createdAt: string;
  updatedAt: string;
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
export interface CustomResponse<T>{
  success:boolean;
  message:string;
  data?:T
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}