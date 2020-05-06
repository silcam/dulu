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
  }, [JSON.stringify(props.languageIds)]);

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
