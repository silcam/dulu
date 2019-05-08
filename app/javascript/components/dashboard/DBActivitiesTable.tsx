import React, { useEffect, useContext, useState } from "react";
import DuluAxios from "../../util/DuluAxios";
import { Adder } from "../../models/TypeBucket";
import Activity, { IActivity } from "../../models/Activity";
import I18nContext from "../../contexts/I18nContext";
import ProgressBar from "../shared/ProgressBar";
import Spacer from "../shared/Spacer";
import { ILanguage } from "../../models/Language";
import { Link } from "react-router-dom";
import SortPicker from "./SortPicker";
import sortActivities, { Sort, SortOption } from "./sortActivities";
import CommaList from "../shared/CommaList";
import StyledTable from "../shared/StyledTable";

interface IProps {
  languageIds: number[];
  languages: { [id: string]: ILanguage | undefined };
  activities: IActivity[];
  addActivities: Adder<IActivity>;
  sortOptions?: SortOption[];
  noAPILoad?: boolean; // There are 2 tables on Linguistics tab, and we don't need both to poll the same data
}

export default function DBActivitiesTable(props: IProps) {
  const t = useContext(I18nContext);
  const [sort, setSort] = useState<Sort>({ option: "Language" });

  useEffect(() => {
    if (!props.noAPILoad) fetchActivities(props);
  }, [JSON.stringify(props.languageIds)]);

  const sortOptions = props.sortOptions || ["Language", "Stage"];
  const activities = sortActivities(sort, props.activities, props.languages);

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
                  {props.languages[activity.language_id]!.name}
                </Link>
              </td>
              <td>
                <Link
                  to={`/languages/${activity.language_id}/activities/${
                    activity.id
                  }`}
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

async function fetchActivities(props: IProps) {
  return Promise.all(
    props.languageIds.map(async id => {
      const data = await DuluAxios.get(`/api/activities`, {
        language_id: id
        // domain: "translation"
      });
      if (data) {
        props.addActivities(data.translation_activities);
        props.addActivities(data.media_activities);
        props.addActivities(data.workshops_activities);
        props.addActivities(data.research_activities);
      }
    })
  );
}
