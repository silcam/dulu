import React, { useState } from "react";
import FormGroup from "../shared/FormGroup";
import SaveButton from "../shared/SaveButton";
import CancelButton from "../shared/CancelButton";
import { History } from "history";
import TextInput from "../shared/TextInput";
import useTranslation from "../../i18n/useTranslation";
import useLoad from "../shared/useLoad";

interface IProps {
  history: History;
}

export default function NewClusterForm(props: IProps) {
  const t = useTranslation();
  const [saveLoad, saving] = useLoad();

  const [name, setName] = useState("");

  const save = async () => {
    const data = await saveLoad(duluAxios =>
      duluAxios.post("/api/clusters", { cluster: { name } })
    );
    if (data) props.history.push(`/clusters/${data.clusters[0].id}`);
  };

  return (
    <div>
      <h2>{t("New_cluster")}</h2>
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
