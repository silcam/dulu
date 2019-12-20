import React, { useContext, useState } from "react";
import SaveButton from "../shared/SaveButton";
import CancelButton from "../shared/CancelButton";
import ValidatedTextInput from "../shared/ValidatedTextInput";
import FormGroup from "../shared/FormGroup";
import TextInput from "../shared/TextInput";
import TextArea from "../shared/TextArea";
import { History } from "history";
import I18nContext from "../../contexts/I18nContext";
import useLoad from "../shared/useLoad";

interface IProps {
  history: History;
}

export default function NewOrganizationForm(props: IProps) {
  const t = useContext(I18nContext);

  const [shortName, setShortName] = useState("");
  const [longName, setLongName] = useState("");
  const [description, setDescription] = useState("");
  const newOrgValid = shortName.length > 0;

  const [load, loading] = useLoad();
  const save = async () => {
    if (newOrgValid) {
      const data = await load(duluAxios =>
        duluAxios.post("/api/organizations", {
          organization: {
            short_name: shortName,
            long_name: longName,
            description
          }
        })
      );
      if (data)
        props.history.push(`/organizations/${data.organizations[0].id}`);
    }
  };

  return (
    <div>
      <div onKeyDown={e => e.key == "Enter" && save()}>
        <h3>{t("New_organization")}</h3>

        <FormGroup label={t("Short_name")}>
          <ValidatedTextInput
            setValue={setShortName}
            name="short_name"
            value={shortName}
            validateNotBlank
            autoFocus
          />
        </FormGroup>

        <FormGroup label={t("Long_name")}>
          <TextInput setValue={setLongName} name="long_name" value={longName} />
        </FormGroup>
      </div>

      <FormGroup label={t("Description")}>
        <TextArea
          setValue={setDescription}
          name="description"
          value={description}
        />
      </FormGroup>

      <p>
        <SaveButton
          onClick={save}
          saveInProgress={loading}
          disabled={!newOrgValid}
        />

        <CancelButton />
      </p>
    </div>
  );
}
