import React from "react";
import SearchPicker, { PickerProps } from "./SearchPicker";
import { ById, Adder, SetCan } from "../../models/TypeBucket";
import { IOrganization } from "../../models/Organization";
import { connect } from "react-redux";
import { AppState } from "../../reducers/appReducer";
import { setOrganizations } from "../../actions/organizationActions";
import { useAPIGet, setCanFor } from "../../util/useAPI";
import { IPerson, fullName } from "../../models/Person";
import { ILanguage } from "../../models/Language";
import { setLanguages } from "../../actions/languageActions";
import { setPeople } from "../../actions/peopleActions";
import { ICluster } from "../../models/Cluster";
import { setClusters } from "../../actions/clusterActions";
import { setCan } from "../../actions/canActions";

interface LangPickerProps extends PickerProps {
  languages: ById<ILanguage>;
  setLanguages: Adder<ILanguage>;
}

export const LanguagePicker = connect(
  (state: AppState) => ({
    list: state.languages.list,
    languages: state.languages.byId
  }),
  { setLanguages: setLanguages }
)((props: LangPickerProps) => {
  useAPIGet(
    "/api/languages",
    {},
    { setLanguages: props.setLanguages, setCan: () => {} }
  );
  return <SearchPicker {...props} nameOf={id => props.languages[id]!.name} />;
});

interface OrgPickerProps extends PickerProps {
  setOrganizations: Adder<IOrganization>;
  organizations: ById<IOrganization>;
}

export const OrganizationPicker = connect(
  (state: AppState) => ({
    list: state.organizations.list,
    organizations: state.organizations.byId
  }),
  { setOrganizations: setOrganizations }
)((props: OrgPickerProps) => {
  useAPIGet(
    "/api/organizations",
    {},
    { setOrganizations: props.setOrganizations, setCan: () => {} }
  );
  return (
    <SearchPicker
      {...props}
      nameOf={id => props.organizations[id]!.short_name}
    />
  );
});

interface PersonPickerProps extends PickerProps {
  people: ById<IPerson>;
  setPeople: Adder<IPerson>;
  setCan: SetCan;
}
export const PersonPicker = connect(
  (state: AppState) => ({
    list: state.people.list,
    people: state.people.byId
  }),
  { setPeople: setPeople, setCan: setCan }
)((props: PersonPickerProps) => {
  useAPIGet(
    "/api/people",
    {},
    { setPeople: props.setPeople, setCan: setCanFor(props.setCan, "people") }
  );
  return <SearchPicker {...props} nameOf={id => fullName(props.people[id]!)} />;
});

interface ClusterPickerProps extends PickerProps {
  clusters: ById<ICluster>;
  setClusters: Adder<ICluster>;
}
export const ClusterPicker = connect(
  (state: AppState) => ({
    list: state.clusters.list,
    clusters: state.clusters.byId
  }),
  { setClusters: setClusters }
)((props: ClusterPickerProps) => {
  useAPIGet(
    "/api/clusters",
    {},
    { setClusters: props.setClusters, setCan: () => {} }
  );
  return <SearchPicker {...props} nameOf={id => props.clusters[id]!.name} />;
});
