import React from "react";
import { Link } from "react-router-dom";
import { ILanguage } from "../../models/Language";
import Spacer from "./Spacer";
import { ICluster } from "../../models/Cluster";

interface IProps {
  links: [string, string][];
}

export default function BreadCrumbs(props: IProps) {
  return (
    <h4>
      {props.links.map((link, index) => (
        <span key={index}>
          <Link to={link[0]}>{`< ${link[1]}`}</Link>
          <Spacer width="12px" />
        </span>
      ))}
    </h4>
  );
}

export function LanguageBackLink(props: { language: ILanguage }) {
  return (
    <BreadCrumbs
      links={[[`/languages/${props.language.id}`, props.language.name]]}
    />
  );
}

export function ClusterBackLink(props: { cluster: ICluster }) {
  return (
    <BreadCrumbs
      links={[[`/clusters/${props.cluster.id}`, props.cluster.name]]}
    />
  );
}
