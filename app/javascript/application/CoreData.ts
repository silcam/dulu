import { useContext, useState, useEffect } from "react";
import DispatchContext from "../contexts/DispatchContext";
import DuluAxios from "../util/DuluAxios";
import { loadAction } from "../reducers/LoadAction";

export default function CoreData() {
  const dispatch = useContext(DispatchContext);
  const [lastUpdate, setLastUpdate] = useState(0);
  // Update at intervals of 5 minutes
  const updateNeeded = Date.now().valueOf() - lastUpdate > 5 * 60 * 1000;

  useEffect(() => {
    if (updateNeeded) {
      setLastUpdate(Date.now().valueOf());

      DuluAxios.get("/api/languages").then(data => {
        data && dispatch(loadAction(data));
      });

      DuluAxios.get("/api/people").then(data => {
        data && dispatch(loadAction(data));
      });

      DuluAxios.get("/api/organizations").then(data => {
        data && dispatch(loadAction(data));
      });
    }
  });

  return null;
}
