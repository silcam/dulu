import { ICan } from "../actions/canActions";

export interface INote {
  id: number;
  text: string;
  updated_at: number; // Epoch ms
  person_id: number; // Note author
  can: ICan;
}

export interface NoteFor {
  for_type: "Language" | "Cluster" | "Person";
  for_id: number;
}
