import React, { useState } from "react";
import SaveButton from "../shared/SaveButton";
import CancelButton from "../shared/CancelButton";
import { History } from "history";
import FormGroup from "../shared/FormGroup";
import TextInput from "../shared/TextInput";
import useTranslation from "../../i18n/useTranslation";
import useLoad from "../shared/useLoad";

interface IProps {
  history: History;
}

export default function NewRegionForm(props: IProps) {
  const t = useTranslation();
  const [saveLoad, saving] = useLoad();

  const [name, setName] = useState("");

  const save = async () => {
    const data = await saveLoad(duluAxios =>
      duluAxios.post("/api/regions", { region: { name } })
    );
    if (data) props.history.push(`/regions/${data.regions[0].id}`);
  };

  return (
    <div>
      <h2>{t("New_region")}</h2>
      <FormGroup>
        <TextInput
          value={name}
          setValue={setName}
          placeholder={t("Name")}
          name="name"
          autoFocus
        />
      </FormGroup>
      <SaveButton
        onClick={save}
        saveInProgress={saving}
        disabled={name.length == 0}
      />
      <CancelButton />
    </div>
  );
}
