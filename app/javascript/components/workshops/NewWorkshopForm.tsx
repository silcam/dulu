import React, { useState } from "react";
import TextInput from "../shared/TextInput";
import AddIcon from "../shared/icons/AddIcon";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import useLoad from "../shared/useLoad";
import useTranslation from "../../i18n/useTranslation";

interface IProps {
  activity_id: number;
}

export default function NewWorkshopForm(props: IProps) {
  const t = useTranslation();
  const [saveLoad, saving] = useLoad();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  const createWorkshop = async () => {
    // `await` was missing: `data` was a Promise, so `if (data)` was always true and the
    // form closed even when the save failed. TypeScript 5 reports this as TS2801;
    // TypeScript 3.8 did not. This is a behaviour change -- the form now stays open on a
    // failed save, which is what the `if (data)` was always trying to express.
    const data = await saveLoad(duluAxios =>
      duluAxios.post(`/api/activities/${props.activity_id}/workshops`, {
        workshop: { name }
      })
    );
    if (data) setEditing(false);
  };

  if (editing) {
    return (
      <div>
        <TextInput
          setValue={setName}
          name="name"
          value={name}
          placeholder={t("Workshop_name")}
          handleEnter={createWorkshop}
          autoFocus
        />
        <SmallSaveAndCancel
          handleSave={createWorkshop}
          handleCancel={() => setEditing(false)}
          saveDisabled={!name}
          saveInProgress={saving}
        />
      </div>
    );
  } else {
    return <AddIcon onClick={() => setEditing(true)} />;
  }
}
