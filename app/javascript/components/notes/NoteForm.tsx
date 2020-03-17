import React, { useState } from "react";
import { INote, NoteFor } from "../../models/Note";
import TextArea from "../shared/TextArea";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import useLoad from "../shared/useLoad";

interface IProps {
  note?: INote;
  noteFor?: NoteFor;
  setNote: (n: INote) => void;
  done: () => void;
}

export default function NoteForm(props: IProps) {
  if (!props.note && !props.noteFor)
    throw "Either `note` or `noteFor` must be provided to `NoteForm` component";

  const [saveLoad, saving] = useLoad();

  const [text, setText] = useState(props.note?.text || "");
  const valid = text.length > 0;

  const save = async () => {
    const data = await saveLoad(duluAxios =>
      props.note
        ? duluAxios.put(`/api/notes/${props.note.id}`, { text })
        : duluAxios.post("/api/notes", { ...props.noteFor, text })
    );
    if (data?.notes && data.notes[0]) {
      props.setNote(data.notes[0]);
      props.done();
    }
  };

  return (
    <div>
      <TextArea value={text} setValue={setText} />
      <SmallSaveAndCancel
        saveDisabled={!valid}
        handleCancel={props.done}
        handleSave={save}
        saveInProgress={saving}
      />
    </div>
  );
}
