import React, { useState, useEffect, useContext } from "react";
import deepcopy from "../../util/deepcopy";
import EditActionBar from "../shared/EditActionBar";
import TextOrEditText from "../shared/TextOrEditText";
import update from "immutability-helper";
import { IRegionInflated, IRegion } from "../../models/Region";
import ProgramList from "./ProgramList";
import P from "../shared/P";
import { Link } from "react-router-dom";
import { Adder, Setter, Deleter, AnyObj, ById } from "../../models/TypeBucket";
import { IPerson, fullName } from "../../models/Person";
import { ICluster } from "../../models/Cluster";
import { ILanguage } from "../../models/Language";
import Loading from "../shared/Loading";
import API from "./RegionsAPI";
import { History } from "history";
import I18nContext from "../../contexts/I18nContext";
import FormGroup from "../shared/FormGroup";
import { PersonPicker } from "../shared/SearchPicker";
import List from "../../models/List";

interface IProps {
  id: number;
  region: IRegionInflated;
  addPeople: Adder<IPerson>;
  addClusters: Adder<ICluster>;
  addLanguages: Adder<ILanguage>;
  setRegion: Setter<IRegion>;
  deleteRegion: Deleter;
  history: History;
  people: ById<IPerson>;
  languages: List<ILanguage>;
  clusters: List<ICluster>;
}

export default function RegionPage(props: IProps) {
  const [draftRegion, setDraftRegion] = useState<IRegionInflated | undefined>(
    undefined
  );
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const t = useContext(I18nContext);

  useEffect(() => {
    API.fetch(props.id, props);
  }, [props.id]);

  const edit = () => {
    setDraftRegion(deepcopy(props.region));
    setEditing(true);
  };

  const cancel = () => {
    setDraftRegion(undefined);
    setEditing(false);
  };

  const updateRegion = (mergeRegion: AnyObj) =>
    setDraftRegion(update(draftRegion, { $merge: mergeRegion }));

  const invalid = draftRegion && draftRegion.name.length == 0;

  const save = async () => {
    setSaving(true);
    const newRegion = API.update(draftRegion!, props);
    if (newRegion) cancel();
    setSaving(false);
  };

  const del = async () => {
    if (confirm(t("confirm_delete_region", { name: props.region!.name }))) {
      const success = await API.delete(props.id, props.deleteRegion);
      if (success) props.history.replace("/regions");
    }
  };

  const region = editing ? draftRegion : props.region;

  if (!region) return <Loading />;

  return (
    <div>
      <EditActionBar
        can={region.can}
        editing={editing}
        saveDisabled={invalid}
        saving={saving}
        edit={edit}
        save={save}
        delete={del}
        cancel={cancel}
      />
      <h2>
        <TextOrEditText
          editing={editing}
          value={region.name}
          setValue={value => updateRegion({ name: value })}
          name="name"
          validateNotBlank
        />
      </h2>
      <P>
        {editing ? (
          <FormGroup label={t("LPF")}>
            <PersonPicker
              collection={props.people}
              selectedId={region.person ? region.person.id : null}
              setSelected={person => updateRegion({ person: person })}
              placeholder={t("Name")}
              allowBlank
            />
          </FormGroup>
        ) : (
          region.person && (
            <h3>
              {t("LPF")}:{" "}
              <Link className="notBlue" to={`/people/${region.person.id}`}>
                {fullName(region.person)}
              </Link>
            </h3>
          )
        )}
      </P>
      <ProgramList
        editing={editing}
        region={region}
        thing="cluster"
        updateRegion={updateRegion}
        collection={props.clusters}
      />
      <ProgramList
        editing={editing}
        region={region}
        thing="language"
        updateRegion={updateRegion}
        collection={props.languages}
      />
    </div>
  );
}
