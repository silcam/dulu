import React, { useContext, useState } from "react";
import { IOrganization } from "../../models/Organization";
import I18nContext from "../../contexts/I18nContext";
import { OrganizationSearchTextInput } from "../shared/SearchTextInput";
import update from "immutability-helper";
import { emptyOrganization } from "../../reducers/organizationsReducer";
import FormGroup from "../shared/FormGroup";
import TextInput from "../shared/TextInput";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import useLoad from "../shared/useLoad";
import { fixCaps } from "../../util/stringUtils";

interface IProps {
  value: IOrganization | null;
  setValue: (org: IOrganization | null) => void;
  placeholder?: string;
  autoClear?: boolean;
  autoFocus?: boolean;
}

export default function OrganizationPicker(props: IProps) {
  const t = useContext(I18nContext);

  const [showNewOrgForm, setShowNewOrgForm] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");

  const [load, loading] = useLoad();
  const save = () =>
    load(duluAxios =>
      duluAxios.post("/api/organizations", {
        organization: { short_name: newOrgName }
      })
    ).then(data => {
      if (data) {
        props.setValue(data.organizations[0]);
        setShowNewOrgForm(false);
      }
    });

  return showNewOrgForm ? (
    <div>
      <FormGroup label={t("New_organization")}>
        <TextInput
          value={newOrgName}
          setValue={setNewOrgName}
          placeholder={t("Name")}
        />
        <SmallSaveAndCancel
          handleSave={save}
          handleCancel={() => setShowNewOrgForm(false)}
          saveDisabled={!newOrgName}
          saveInProgress={loading}
        />
      </FormGroup>
    </div>
  ) : (
    <OrganizationSearchTextInput
      placeholder={
        props.placeholder === undefined ? t("Name") : props.placeholder
      }
      updateValue={org =>
        props.setValue(org ? update(emptyOrganization, { $merge: org }) : null)
      }
      text={props.value ? props.value.short_name : ""}
      autoFocus={props.autoFocus}
      addBox={props.autoClear}
      notListed={{
        label: t("Add_organization"),
        onClick: name => {
          setNewOrgName(fixCaps(name));
          setShowNewOrgForm(true);
        }
      }}
      allowBlank
    />
  );
}
