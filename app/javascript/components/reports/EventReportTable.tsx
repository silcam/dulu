import React, { useContext } from "react";
import { PartialModel } from "../../models/TypeBucket";
import { IEvent, emptyEventList } from "../../models/Event";
import I18nContext from "../../contexts/I18nContext";
import List from "../../models/List";
import { ICluster } from "../../models/Cluster";
import { ILanguage } from "../../models/Language";
import { IPerson, fullName } from "../../models/Person";
import CommaList from "../shared/CommaList";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { AppState } from "../../reducers/appReducer";
import StyledTable from "../shared/StyledTable";
import Truncate from "../shared/Truncate";

interface IProps {
  events: PartialModel<IEvent>[];
  clusters: List<ICluster>;
  languages: List<ILanguage>;
  people: List<IPerson>;
}

function BaseEventReportTable(props: IProps) {
  const t = useContext(I18nContext);
  const events = emptyEventList().add(props.events);
  return (
    <div>
      <h3>{t("Events")}</h3>
      <StyledTable>
        <tbody>
          <tr>
            <th>{t("Name")}</th>
            <th>{t("Start_date")}</th>
            <th>{t("End_date")}</th>
            <th>{t("Note")}</th>
            <th>{t("Clusters")}</th>
            <th>{t("Languages")}</th>
            <th>{t("People")}</th>
          </tr>
          {events.map(event => (
            <tr key={event.id}>
              <td>
                <Link to={`/events/${event.id}`}>{event.name}</Link>
              </td>
              <td>{event.start_date}</td>
              <td>{event.end_date}</td>
              <td>
                <Truncate text={event.note} />
              </td>
              <td>
                <CommaList
                  list={event.cluster_ids.map(id => props.clusters.get(id))}
                  render={cluster => (
                    <Link to={`/clusters/${cluster.id}`}>{cluster.name}</Link>
                  )}
                />
              </td>
              <td>
                <CommaList
                  list={event.language_ids.map(id => props.languages.get(id))}
                  render={lang => (
                    <Link to={`/languages/${lang.id}`}>{lang.name}</Link>
                  )}
                />
              </td>
              <td>
                <CommaList
                  list={event.event_participants.map(ep =>
                    props.people.get(ep.person_id)
                  )}
                  render={person => (
                    <Link to={`/people/${person.id}`}>{fullName(person)}</Link>
                  )}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </div>
  );
}

const EventReportTable = connect((state: AppState) => ({
  languages: state.languages,
  clusters: state.clusters,
  people: state.people
}))(BaseEventReportTable);

export default EventReportTable;
