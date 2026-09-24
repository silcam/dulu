import React from "react";
import { ClusterBackLink } from "../shared/BreadCrumbs";
import ParticipantView from "../languages/ParticipantView";
import { useParams } from "react-router-dom";
import { useClusterContext } from "./ClusterPageRouter";

export default function ClusterParticipantPage() {
  const { cluster, basePath } = useClusterContext();
  const participantId = parseInt(useParams().participantId!);

  return (
    <div>
      <ClusterBackLink cluster={cluster} />
      <ParticipantView basePath={basePath} id={participantId} />
    </div>
  );
}
