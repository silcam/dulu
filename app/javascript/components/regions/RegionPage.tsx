import React, { useState, useEffect } from "react";
import deepcopy from "../../util/deepcopy";
import EditActionBar from "../shared/EditActionBar";
import TextOrEditText from "../shared/TextOrEditText";
import { SearchTextGroup } from "../shared/formGroup";
import update from "immutability-helper";
import { IRegionInflated, IRegion } from "../../models/Region";
import ProgramList from "./ProgramList";
import P from "../shared/P";
import { Link } from "react-router-dom";
import { T } from "../../i18n/i18n";
import { Adder, Setter, Deleter, AnyObj } from "../../models/TypeBucket";
import { Person, fullName } from "../../models/Person";
import { ICluster } from "../../models/Cluster";
import { ILanguage } from "../../models/language";
import Loading from "../shared/Loading";
import API from "./RegionsAPI";
import { History } from "history";

interface IProps {
  t: T;
  id: number;
  region?: IRegionInflated;
  addPeople: Adder<Person>;
  addClusters: Adder<ICluster>;
  addLanguages: Adder<ILanguage>;
  setRegion: Setter<IRegion>;
  deleteRegion: Deleter;
  history: History;
}

export default function RegionPage(props: IProps) {
  const [draftRegion, setDraftRegion] = useState<IRegionInflated | undefined>(
    undefined
  );
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

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
    if (
      confirm(props.t("confirm_delete_region", { name: props.region!.name }))
    ) {
      const success = await API.delete(props.id, props.deleteRegion);
      if (success) props.history.replace("/regions");
    }
  };

  const t = props.t;
  const region = editing ? draftRegion : props.region;

  if (!region) return <Loading t={t} />;

  return (
    <div>
      <EditActionBar
        can={region.can}
        editing={editing}
        saveDisabled={invalid}
        saving={saving}
        t={t}
        edit={edit}
        save={save}
        delete={del}
        cancel={cancel}
      />
      <h2>
        <TextOrEditText
          editing={editing}
          value={region.name}
          updateValue={value => updateRegion({ name: value })}
          t={t}
          name="name"
          validateNotBlank
        />
      </h2>
      <P>
        {editing ? (
          <SearchTextGroup
            label={t("LPF")}
            queryPath="/api/people/search"
            text={region.person ? fullName(region.person) : ""}
            updateValue={(person: Person) => updateRegion({ person: person })}
            placeholder={t("Name")}
            allowBlank
          />
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
        t={t}
        updateRegion={updateRegion}
      />
      <ProgramList
        editing={editing}
        region={region}
        thing="language"
        t={t}
        updateRegion={updateRegion}
      />
    </div>
  );
}
