import React from "react";
import { Link } from "react-router-dom";
import ParticipantContainer from "../languages/ParticipantContainer";
import { T } from "../../i18n/i18n";
import { ICluster } from "../../models/Cluster";

interface IProps {
  t: T;
  cluster?: ICluster;
  participantId: number;
  basePath: string;
}

export default function ClusterParticipantPage(props: IProps) {
  const cluster = props.cluster;
  if (!cluster) return null;
  return (
    <div>
      <h4>
        <Link to={props.basePath}>{`< ${cluster.name}`}</Link>
      </h4>
      <ParticipantContainer
        {...props}
        id={props.participantId}
        setNetworkError={() => {}}
      />
    </div>
  );
}
