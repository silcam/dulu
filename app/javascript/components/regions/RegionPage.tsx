import React, { useState } from "react";
import EditActionBar from "../shared/EditActionBar";
import TextOrEditText from "../shared/TextOrEditText";
import update from "immutability-helper";
import Region, { IRegionInflated } from "../../models/Region";
import ProgramList from "./ProgramList";
import P from "../shared/P";
import { Link } from "react-router-dom";
import { AnyObj } from "../../models/TypeBucket";
import { fullName } from "../../models/Person";
import Loading from "../shared/Loading";
import { History } from "history";
import FormGroup from "../shared/FormGroup";
import PersonPicker from "../people/PersonPicker";
import useTranslation from "../../i18n/useTranslation";
import useLoad, { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  id: number;
  history: History;
}

export default function RegionPage(props: IProps) {
  const t = useTranslation();
  const [saveLoad, saving] = useLoad();

  const storeRegion = useAppSelector(state =>
    Region.inflate(state, state.regions.get(props.id))
  );
  const languages = useAppSelector(state => state.languages);
  const clusters = useAppSelector(state => state.clusters);

  const [draftRegion, setDraftRegion] = useState<IRegionInflated | undefined>(
    undefined
  );
  const [editing, setEditing] = useState(false);

  useLoadOnMount(`/api/regions/${props.id}`);

  const edit = () => {
    setDraftRegion({ ...storeRegion });
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
    const data = await saveLoad(duluAxios =>
      duluAxios.put(`/api/regions/${props.id}`, {
        region: Region.regionParams(draftRegion!)
      })
    );
    if (data) cancel();
  };

  const del = async () => {
    if (confirm(t("confirm_delete_region", { name: storeRegion.name }))) {
      const data = await saveLoad(duluAxios =>
        duluAxios.delete(`/api/regions/${props.id}`)
      );
      if (data) props.history.replace("/regions");
    }
  };

  const region = editing ? draftRegion : storeRegion;

  if (!region || region.id == 0) return <Loading />;

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
              value={region.lpf || null}
              setValue={p => updateRegion({ lpf: p })}
            />
          </FormGroup>
        ) : (
          region.lpf && (
            <h3>
              {t("LPF")}:{" "}
              <Link className="notBlue" to={`/people/${region.lpf.id}`}>
                {fullName(region.lpf)}
              </Link>
            </h3>
          )
        )}
      </P>
      <ProgramList
        editing={editing}
        regionList={region.clusters}
        thing="cluster"
        updateRegion={updateRegion}
        collection={clusters}
      />
      <ProgramList
        editing={editing}
        regionList={region.languages}
        thing="language"
        updateRegion={updateRegion}
        collection={languages}
      />
    </div>
  );
}
