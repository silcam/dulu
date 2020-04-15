import React, { useState, useContext } from "react";
import EditActionBar from "../shared/EditActionBar";
import TextOrEditText from "../shared/TextOrEditText";
import update from "immutability-helper";
// import styles from "./PersonPage.css";
import ClusterLanguagesTable from "./ClusterLanguagesTable";
import ParticipantsContainer from "../languages/ParticipantsContainer";
import Cluster, { IClusterInflated } from "../../models/Cluster";
import { History } from "history";
import Loading from "../shared/Loading";
import I18nContext from "../../contexts/I18nContext";
import useLoad, { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  id: number;
  basePath: string;
  history: History<any>;
  loading: boolean;
}

type MaybeIClusterInflated = IClusterInflated | undefined;

export default function ClusterPage(props: IProps) {
  const t = useContext(I18nContext);
  const [saveLoad, saving] = useLoad();
  const [editing, setEditing] = useState(false);

  const stateCluster = useAppSelector(state =>
    Cluster.inflate(state, state.clusters.get(props.id))
  );

  const [draftCluster, setDraftCluster] = useState<MaybeIClusterInflated>(
    undefined
  );

  const updateCluster = (mergeCluster: { [prop: string]: any }) =>
    setDraftCluster(update(draftCluster, { $merge: mergeCluster }));

  const edit = () => {
    setDraftCluster({ ...stateCluster });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraftCluster(undefined);
  };

  const save = async () => {
    const data = await saveLoad(duluAxios =>
      duluAxios.put(`/api/clusters/${props.id}`, {
        cluster: Cluster.clusterParams(draftCluster as IClusterInflated)
      })
    );
    if (data) cancelEdit();
  };

  const del = async () => {
    if (
      confirm(
        t("confirm_delete_cluster", {
          name: stateCluster.name
        })
      )
    ) {
      const data = await saveLoad(duluAxios =>
        duluAxios.delete(`/api/clusters/${props.id}`)
      );
      if (data) {
        props.history.replace("/clusters");
      }
    }
  };

  const invalid = () => {
    return draftCluster && draftCluster.name.length == 0;
  };

  const cluster = editing ? draftCluster : stateCluster;

  if (!cluster || cluster.id == 0) return <Loading />;

  if (!cluster.languages.map)
    console.error(
      `Cluster Languages: ${cluster.languages}\n${JSON.stringify(
        cluster.languages
      )}`
    );

  return (
    <div className="padBottom">
      {!props.loading && (
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
      />
      {!editing && (
        <ParticipantsContainer
          cluster={cluster}
          can={cluster.can}
          basePath={props.basePath}
          history={props.history}
        />
      )}
    </div>
  );
}
