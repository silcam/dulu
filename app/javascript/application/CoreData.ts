import { useContext, useState, useEffect } from "react";
import DispatchContext from "../contexts/DispatchContext";
import DuluAxios from "../util/DuluAxios";
import { setLanguages } from "../actions/languageActions";
import { setClusters } from "../actions/clusterActions";
import { setPeople } from "../actions/peopleActions";
import { setOrganizations } from "../actions/organizationActions";
import { setRegions } from "../actions/regionActions";

export default function CoreData() {
  const dispatch = useContext(DispatchContext);
  const [lastUpdate, setLastUpdate] = useState(0);
  // Update at intervals of 5 minutes
  const updateNeeded = Date.now().valueOf() - lastUpdate > 5 * 60 * 1000;

  useEffect(() => {
    if (updateNeeded) {
      setLastUpdate(Date.now().valueOf());

      DuluAxios.get("/api/clusters").then(data => {
        data && dispatch(setClusters(data.clusters));
      });

      DuluAxios.get("/api/languages").then(data => {
        data && dispatch(setLanguages(data.languages));
      });

      DuluAxios.get("/api/people").then(data => {
        data && dispatch(setPeople(data.people));
      });

      DuluAxios.get("/api/organizations").then(data => {
        data && dispatch(setOrganizations(data.organizations));
      });

      DuluAxios.get("/api/regions").then(data => {
        data && dispatch(setRegions(data.regions));
      });
    }
  });

  return null;
}
