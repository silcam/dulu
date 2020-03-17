import React, { useContext } from "react";
import { ILanguage } from "../../models/Language";
import useDashboardRegions, {
  LoadedCluster,
  LoadedRegion
} from "./useDashboardRegions";
import I18nContext from "../../contexts/I18nContext";
import DashboardSidebarList from "./DashboardSidebarList";
import DashboardSidebarItem from "./DashboardSidebarItem";
import { fullName } from "../../models/Person";
import { Selection } from "./Dashboard";
import Loading from "../shared/Loading";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  selection: Selection;
  setSelection: (s: Selection) => void;
}

export default function DashboardSidebar(props: IProps) {
  const t = useContext(I18nContext);
  const selection = props.selection;
  const user = useAppSelector(state => state.currentUser);
  const { regions, userPrograms } = useDashboardRegions();

  useLoadOnMount("/api/languages/dashboard_list");

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

  if (regions.length() == 0) return <Loading />;

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
          {regions.map(region => (
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
        {(userPrograms.clusters.length > 0 ||
          userPrograms.languages.length > 0) && (
          <DashboardSidebarList
            header={fullName(user)}
            indent={0}
            startExpanded
            onClick={() => props.setSelection({ type: "user" })}
            selected={isSelected("user")}
          >
            {userPrograms.clusters
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
                userPrograms.languages.map(language => (
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
