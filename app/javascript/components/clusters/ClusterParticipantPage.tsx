import React from "react";
import ParticipantContainer from "../languages/ParticipantContainer";
import { T } from "../../i18n/i18n";
import { ICluster } from "../../models/Cluster";
import { History } from "history";
import { ClusterBackLink } from "../shared/BreadCrumbs";

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
      <ParticipantContainer {...props} id={props.participantId} />
    </div>
  );
}
