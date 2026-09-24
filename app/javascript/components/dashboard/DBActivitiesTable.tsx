import React, { useEffect, useContext, useState } from "react";
import Activity, { ActivityType } from "../../models/Activity";
import I18nContext from "../../contexts/I18nContext";
import ProgressBar from "../shared/ProgressBar";
import Spacer from "../shared/Spacer";
import Language from "../../models/Language";
import { Link } from "react-router-dom";
import SortPicker from "./SortPicker";
import sortActivities, { Sort, SortOption } from "./sortActivities";
import CommaList from "../shared/CommaList";
import StyledTable from "../shared/StyledTable";
import useLoad from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";
import { flat } from "../../util/arrayUtils";

interface IProps {
  type: ActivityType;
  languageIds: number[];
  sortOptions?: SortOption[];
  noAPILoad?: boolean; // There are 2 tables on Linguistics tab, and we don't need both to poll the same data
}

export default function DBActivitiesTable(props: IProps) {
  const t = useContext(I18nContext);
  const [load] = useLoad();

  const languages = useAppSelector(state =>
    state.languages.filter(lang => props.languageIds.includes(lang.id))
  );
  const unsortedActivities = useAppSelector(state =>
    flat(
      languages.map(lang =>
        Language.activities(state, lang.id, props.type).toArray()
      )
    )
  );

  const [sort, setSort] = useState<Sort>({ option: "Language" });
  const sortOptions = props.sortOptions || ["Language", "Stage"];
  const activities = sortActivities(sort, unsortedActivities, languages, t);

  const domain = ["Research", "Workshops"].includes(props.type)
    ? "linguistics"
    : props.type.toLocaleLowerCase();
  // Stringified because the dependency has to be one value of stable length: React
  // compares dependency lists pairwise only as far as the shorter of the two, so an
  // array spread straight into the list stops being compared at all the moment it
  // grows. (That is the bug that was live in DBParticipantsTable.) The stringify
  // moves out of the list itself so eslint can see what the dependency is.
  //
  // `domain` and `props.noAPILoad` are left out deliberately, for related but not
  // identical reasons. `domain` is computed above from `props.type`, which is a string
  // literal at every call site in MainContent, so an instance's domain never changes.
  // `noAPILoad` is an independent prop rather than anything derived, but it too is fixed
  // per instance: MainContent passes it as a bare attribute on the Workshops table and
  // omits it everywhere else. `load` is left out because useLoad returns a new closure
  // every render, and naming it would refetch on every render.
  const languageIdsKey = JSON.stringify(props.languageIds);

  /* eslint-disable react-hooks/exhaustive-deps -- see the note above */
  useEffect(() => {
    if (!props.noAPILoad) {
      props.languageIds.forEach(id =>
        load(duluAxios =>
          duluAxios.get(`/api/activities`, {
            language_id: id,
            domain
          })
        )
      );
    }
  }, [languageIdsKey]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div>
      {activities.length > 0 && (
        <SortPicker sort={sort} options={sortOptions} changeSort={setSort} />
      )}
      <StyledTable>
        <tbody>
          {activities.map(activity => (
            <tr key={activity.id}>
              <td>
                <Link to={`/languages/${activity.language_id}`}>
                  {languages.get(activity.language_id).name}
                </Link>
              </td>
              <td>
                <Link
                  to={`/languages/${activity.language_id}/activities/${activity.id}`}
                >
                  {Activity.name(activity, t)}
                </Link>
              </td>
              <td>
                <ProgressBar {...Activity.progress(activity)} />
                <Spacer width="24px" />
                {Activity.isWorkshops(activity) ? (
                  <CommaList
                    list={activity.workshops}
                    separator=" | "
                    render={ws => (
                      <span
                        style={
                          ws.completed
                            ? {
                                fontStyle: "italic",
                                color: "#666"
                              }
                            : {}
                        }
                      >
                        {ws.name}
                      </span>
                    )}
                  />
                ) : (
                  t(`stage_names.${activity.stage_name}`)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </div>
  );
}
