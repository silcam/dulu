import React, { useState, useContext } from "react";
import update from "immutability-helper";
import SaveButton from "../shared/SaveButton";
import CancelButton from "../shared/CancelButton";
import { IRegion } from "../../models/Region";
import { Adder, Setter } from "../../models/TypeBucket";
import { ICluster } from "../../models/Cluster";
import { ILanguage } from "../../models/Language";
import API from "./RegionsAPI";
import { History } from "history";
import I18nContext from "../../contexts/I18nContext";
import FormGroup from "../shared/FormGroup";
import TextInput from "../shared/TextInput";

interface IProps {
  addClusters: Adder<ICluster>;
  addLanguages: Adder<ILanguage>;
  setRegion: Setter<IRegion>;
  history: History;
}

type NewRegion = { name: string };

export default function NewRegionForm(props: IProps) {
  const [saving, setSaving] = useState(false);
  const [region, setRegion] = useState({ name: "" });
  const t = useContext(I18nContext);

  const updateRegion = (mergeRegion: NewRegion) =>
    setRegion(update(region, { $merge: mergeRegion }));

  const save = async () => {
    setSaving(true);
    const newRegion: IRegion = await API.create(region, props);
    setSaving(false);
    if (newRegion) props.history.push(`/regions/${newRegion.id}`);
  };

  return (
    <div>
      <h2>{t("New_region")}</h2>
      <FormGroup>
        <TextInput
          value={region.name}
          setValue={(name: string) => updateRegion({ name })}
          placeholder={t("Name")}
          name="name"
          autoFocus
        />
      </FormGroup>
      <SaveButton
        onClick={save}
        saveInProgress={saving}
        disabled={region.name.length == 0}
      />
      <CancelButton />
    </div>
  );
}
