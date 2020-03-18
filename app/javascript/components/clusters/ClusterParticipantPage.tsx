import React from "react";
import { T } from "../../i18n/i18n";
import { ICluster } from "../../models/Cluster";
import { History } from "history";
import { ClusterBackLink } from "../shared/BreadCrumbs";
import ParticipantView from "../languages/ParticipantView";

interface IProps {
  t: T;
  cluster?: ICluster;
  participantId: number;
  basePath: string;
  history: History;
}

export default function ClusterParticipantPage(props: IProps) {
  const cluster = props.cluster;
  if (!cluster) return null;
  return (
    <div>
      <ClusterBackLink cluster={cluster} />
      <ParticipantView {...props} id={props.participantId} />
    </div>
  );
}
