import { useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import DispatchContext from "../contexts/DispatchContext";
import DuluAxios from "../util/DuluAxios";
import { loadAction } from "../reducers/LoadAction";

const REFRESH_MS = 5 * 60 * 1000;

// The collections GoBar searches out of the store rather than fetching for itself.
// Note it searches five -- languages, people, organizations, clusters and regions --
// and only the first three are loaded here; clusters and regions reach the store only
// if the user visits their boards. See UPGRADE_PLAN 8f item 6.
const CORE_PATHS = ["/api/languages", "/api/people", "/api/organizations"];

// Refreshes those collections when the user navigates, at most once every five
// minutes. Deliberate, and worth stating because both obvious "fixes" are worse:
//
//   - A setInterval would poll from every open tab forever, including tabs nobody is
//     looking at, to keep a cache warm that only GoBar reads.
//   - Loading once on mount would leave an active user on a page-load snapshot.
//
// Gating on navigation spends requests only when someone is actually using the app.
//
// This is the behaviour the previous implementation had, arrived at by accident: the
// clock was checked during render against a `lastUpdate` in state, inside an effect
// with no dependency array, so it ran after every render and the refresh happened to
// coincide with navigation (CoreData re-renders with BaseMainRouter, which calls
// useLocation). Same semantics here, declared rather than emergent -- which is what
// makes react-hooks/purity, /set-state-in-effect and /exhaustive-deps go quiet.
//
// The timestamp is a ref, not state: it is bookkeeping between effect runs and
// nothing renders it, so putting it in state only bought an extra render pass. It is
// read and written inside the effect, never during render.
//
// `dispatch` is store.dispatch from DispatchContext (application/index.js), a stable
// reference for the store's lifetime, so it never re-triggers this on its own.
export default function CoreData() {
  const dispatch = useContext(DispatchContext);
  const { pathname } = useLocation();
  const lastUpdate = useRef(0);

  useEffect(() => {
    const now = Date.now();
    // Fires on mount too: lastUpdate starts at 0, so the first run is always due.
    if (now - lastUpdate.current < REFRESH_MS) return;
    lastUpdate.current = now;

    CORE_PATHS.forEach(path =>
      DuluAxios.get(path).then(data => {
        if (data) dispatch(loadAction(data));
      })
    );
  }, [pathname, dispatch]);

  return null;
}
