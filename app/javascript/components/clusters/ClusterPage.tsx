import React, { useState, useEffect, useContext } from "react";
import EditActionBar from "../shared/EditActionBar";
import deepcopy from "../../util/deepcopy";
import TextOrEditText from "../shared/TextOrEditText";
import update from "immutability-helper";
import DuluAxios from "../../util/DuluAxios";
// import styles from "./PersonPage.css";
import ClusterLanguagesTable from "./ClusterLanguagesTable";
import ParticipantsContainer from "../languages/ParticipantsContainer";
import Cluster, { IClusterInflated, ICluster } from "../../models/Cluster";
import { History } from "history";
import Loading from "../shared/Loading";
import { Deleter, Adder, ById } from "../../models/TypeBucket";
import { IPerson } from "../../models/Person";
import { ILanguage } from "../../models/Language";
import I18nContext from "../../contexts/I18nContext";
import { IParticipant } from "../../models/Participant";

interface IProps {
  id: number;
  cluster?: IClusterInflated;
  setCluster: (c: ICluster) => void;
  deleteCluster: Deleter;
  addPeople: Adder<IPerson>;
  addParticipants: Adder<IParticipant>;
  addLanguages: Adder<ILanguage>;
  basePath: string;
  history: History<any>;
  languages: ById<ILanguage>;
}

type MaybeIClusterInflated = IClusterInflated | undefined;

export default function ClusterPage(props: IProps) {
  const t = useContext(I18nContext);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftCluster, setDraftCluster] = useState<MaybeIClusterInflated>(
    undefined
  );

  const fetchCluster = async () => {
    const data = await DuluAxios.get(`/api/clusters/${props.id}`);
    if (data) {
      props.addLanguages(data.languages);
      props.setCluster(data.cluster);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCluster();
  }, []);

  const updateCluster = (mergeCluster: { [prop: string]: any }) =>
    setDraftCluster(update(draftCluster, { $merge: mergeCluster }));

  const edit = () => {
    setDraftCluster(deepcopy(props.cluster!));
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraftCluster(undefined);
  };

  const save = async () => {
    setSaving(true);
    const data = await DuluAxios.put(`/api/clusters/${props.id}`, {
      cluster: Cluster.clusterParams(draftCluster as IClusterInflated)
    });
    if (data) {
      props.addLanguages(data.languages);
      props.setCluster(data.cluster);
      cancelEdit();
    }
    setSaving(false);
  };

  const del = async () => {
    if (
      confirm(
        t("confirm_delete_cluster", {
          name: props.cluster!.name
        })
      )
    ) {
      const data = await DuluAxios.delete(`/api/clusters/${props.id}`);
      if (data) {
        props.deleteCluster(props.id);
        props.history.replace("/clusters");
      }
    }
  };

  const invalid = () => {
    return draftCluster && draftCluster.name.length == 0;
  };

  const cluster = editing ? draftCluster : props.cluster;

  if (!cluster) return <Loading />;

  return (
    <div>
      {!loading && (
        <EditActionBar
          can={cluster.can}
          editing={editing}
          saveDisabled={invalid()}
          saving={saving}
          edit={edit}
          save={save}
          delete={del}
          cancel={cancelEdit}
        />
      )}
      <h2>
        <TextOrEditText
          editing={editing}
          value={cluster.name}
          setValue={value => updateCluster({ name: value })}
          name="name"
          validateNotBlank
        />
      </h2>
      <ClusterLanguagesTable
        cluster={cluster}
        editing={editing}
        updateCluster={updateCluster}
        edit={edit}
        languages={props.languages}
      />
      {!editing && (
        <ParticipantsContainer
          cluster={cluster}
          can={cluster.can}
          basePath={props.basePath}
          history={props.history}
          t={t}
        />
      )}
    </div>
  );
}
