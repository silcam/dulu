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
    const data = saveLoad(duluAxios =>
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
