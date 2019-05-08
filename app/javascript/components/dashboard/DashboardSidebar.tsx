import React, { useEffect, useContext } from "react";
import DuluAxios from "../../util/DuluAxios";
import { Adder } from "../../models/TypeBucket";
import { IRegion } from "../../models/Region";
import { ICluster } from "../../models/Cluster";
import { ILanguage } from "../../models/Language";
import { User } from "../../application/DuluApp";
import { LoadedCluster, LoadedRegion } from "./DashboardSidebarContainer";
import I18nContext from "../../contexts/I18nContext";
import DashboardSidebarList from "./DashboardSidebarList";
import DashboardSidebarItem from "./DashboardSidebarItem";
import { fullName, IPerson } from "../../models/Person";
import { Selection } from "./Dashboard";
import Loading from "../shared/Loading";
import { IParticipant } from "../../models/Participant";

interface IProps {
  selection: Selection;
  user: User;
  userPrograms: {
    clusters: LoadedCluster[];
    languages: ILanguage[];
  };
  regions: LoadedRegion[];
  setSelection: (s: Selection) => void;
  setRegions: Adder<IRegion>;
  setClusters: Adder<ICluster>;
  setLanguages: Adder<ILanguage>;
  addPeople: Adder<IPerson>;
  addParticipants: Adder<IParticipant>;
}

export default function DashboardSidebar(props: IProps) {
  const t = useContext(I18nContext);
  const selection = props.selection;
  useEffect(() => fetchDashboardList(props), []);

  const languageSelector = (language: ILanguage) => () =>
    props.setSelection({ type: "language", id: language.id });

  const clusterSelector = (cluster: LoadedCluster) => () =>
    props.setSelection({ type: "cluster", id: cluster.id });

  const regionSelector = (region: LoadedRegion) => () =>
    props.setSelection({ type: "region", id: region.id });

  const isSelected = (type: string, id?: number) => {
    switch (selection.type) {
      case "cameroon":
      case "user":
        return type == selection.type;
      default:
        return type == selection.type && id == selection.id;
    }
  };

  const regionStartExpanded = (region: LoadedRegion) =>
    region.clusters.some(c => isSelected("cluster", c.id)) ||
    region.languages.some(l => isSelected("language", l.id)) ||
    region.clusters.some(c => clusterStartExpanded(c));

  const clusterStartExpanded = (cluster: LoadedCluster) =>
    cluster.languages.some(l => isSelected("language", l.id));

  if (props.regions.length == 0) return <Loading />;

  return (
    <div>
      <ul>
        <DashboardSidebarList
          header={t("Cameroon")}
          indent={0}
          startExpanded
          onClick={() => props.setSelection({ type: "cameroon" })}
          selected={isSelected("cameroon")}
        >
          {props.regions.map(region => (
            <DashboardSidebarList
              key={region.id}
              header={region.name}
              indent={15}
              onClick={regionSelector(region)}
              selected={isSelected("region", region.id)}
              startExpanded={regionStartExpanded(region)}
            >
              {region.clusters
                .map(cluster => (
                  <DashboardSidebarList
                    key={cluster.id}
                    header={cluster.name}
                    indent={30}
                    onClick={clusterSelector(cluster)}
                    selected={isSelected("cluster", cluster.id)}
                    startExpanded={clusterStartExpanded(cluster)}
                  >
                    {cluster.languages.map(language => (
                      <DashboardSidebarItem
                        key={language.id}
                        header={language.name}
                        indent={45}
                        onClick={languageSelector(language)}
                        selected={isSelected("language", language.id)}
                      />
                    ))}
                  </DashboardSidebarList>
                ))
                .concat(
                  region.languages.map(language => (
                    <DashboardSidebarItem
                      key={language.id}
                      header={language.name}
                      indent={45}
                      onClick={languageSelector(language)}
                      selected={isSelected("language", language.id)}
                    />
                  ))
                )}
            </DashboardSidebarList>
          ))}
        </DashboardSidebarList>
        {(props.userPrograms.clusters.length > 0 ||
          props.userPrograms.languages.length > 0) && (
          <DashboardSidebarList
            header={fullName(props.user)}
            indent={0}
            startExpanded
            onClick={() => props.setSelection({ type: "user" })}
            selected={isSelected("user")}
          >
            {props.userPrograms.clusters
              .map(cluster => (
                <DashboardSidebarList
                  key={cluster.id}
                  header={cluster.name}
                  indent={15}
                  onClick={clusterSelector(cluster)}
                  selected={isSelected("cluster", cluster.id)}
                >
                  {cluster.languages.map(language => (
                    <DashboardSidebarItem
                      key={language.id}
                      header={language.name}
                      indent={30}
                      onClick={languageSelector(language)}
                      selected={isSelected("language", language.id)}
                    />
                  ))}
                </DashboardSidebarList>
              ))
              .concat(
                props.userPrograms.languages.map(language => (
                  <DashboardSidebarItem
                    key={language.id}
                    header={language.name}
                    indent={30}
                    onClick={languageSelector(language)}
                    selected={isSelected("language", language.id)}
                  />
                ))
              )}
          </DashboardSidebarList>
        )}
      </ul>
    </div>
  );
}

function fetchDashboardList(props: IProps) {
  DuluAxios.get("/api/languages/dashboard_list").then(data => {
    if (data) {
      props.setClusters(data.clusters);
      props.setLanguages(data.languages);
      props.addPeople([data.user]);
      props.addParticipants(data.user_participants);
      props.setRegions(data.regions);
    }
  });
}
