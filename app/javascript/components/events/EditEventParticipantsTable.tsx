import React, { useContext } from "react";
import update from "immutability-helper";
import DeleteIcon from "../shared/icons/DeleteIcon";
import SelectInput from "../shared/SelectInput";
import AddIcon from "../shared/icons/AddIcon";
import style from "./EditEventParticipantsTable.css";
import { IEventInflated, IEventParticipantExtended } from "../../models/Event";
import I18nContext from "../../contexts/I18nContext";
import { ICluster } from "../../models/Cluster";
import { ILanguage } from "../../models/Language";
import { AppState } from "../../reducers/appReducer";
import { connect } from "react-redux";
import { IPerson, fullName } from "../../models/Person";
import { SearchPickerAutoClear } from "../shared/SearchPicker";
import List from "../../models/List";
import PersonPicker from "../people/PersonPicker";

interface IProps {
  event: IEventInflated;
  replaceEvent: (event: IEventInflated) => void;
  languages: List<ILanguage>;
  clusters: List<ICluster>;
  people: List<IPerson>;
}

function BaseEditEventParticipantsTable(props: IProps) {
  const event = props.event;
  const t = useContext(I18nContext);

  const addCluster = (cluster: ICluster) => {
    props.replaceEvent(update(props.event, { clusters: { $push: [cluster] } }));
  };

  const addLanguage = (language: ILanguage) => {
    props.replaceEvent(
      update(props.event, { languages: { $push: [language] } })
    );
  };

  const addPerson = (person: IPerson) => {
    props.replaceEvent(
      update(props.event, {
        event_participants: {
          $push: [
            { person_id: person.id, full_name: fullName(person), roles: [] }
          ]
        }
      })
    );
  };

  const dropCluster = (id: number) => {
    const newClusters = props.event.clusters.filter(c => c.id != id);
    props.replaceEvent(
      update(props.event, { clusters: { $set: newClusters } })
    );
  };

  const dropLanguage = (id: number) => {
    const newPrograms = props.event.languages.filter(p => p.id != id);
    props.replaceEvent(
      update(props.event, { languages: { $set: newPrograms } })
    );
  };

  const dropPerson = (person_id: number) => {
    const newEventParticipants = props.event.event_participants.filter(
      p => p.person_id != person_id
    );
    props.replaceEvent(
      update(props.event, {
        event_participants: { $set: newEventParticipants }
      })
    );
  };

  const defaultNewRole = () => Object.keys(t("roles"))[0];

  const addRole = (participant: IEventParticipantExtended) => {
    const index = props.event.event_participants.indexOf(participant);
    props.replaceEvent(
      update(props.event, {
        event_participants: {
          [index]: {
            roles: { $push: [defaultNewRole()] }
          }
        }
      })
    );
  };

  const updateRole = (
    participant: IEventParticipantExtended,
    roleIndex: number,
    newRole: string
  ) => {
    const index = props.event.event_participants.indexOf(participant);
    props.replaceEvent(
      update(props.event, {
        event_participants: {
          [index]: {
            roles: {
              [roleIndex]: { $set: newRole }
            }
          }
        }
      })
    );
  };

  const dropRole = (
    participant: IEventParticipantExtended,
    roleIndex: number
  ) => {
    const index = props.event.event_participants.indexOf(participant);
    props.replaceEvent(
      update(props.event, {
        event_participants: {
          [index]: {
            roles: {
              $splice: [[roleIndex, 1]]
            }
          }
        }
      })
    );
  };

  return (
    <div className={style.container}>
      <table>
        <tbody>
          <tr>
            <th>{t("Clusters")}</th>
            <th>{t("Languages")}</th>
            <th>{t("People")}</th>
          </tr>
          <tr>
            <td>
              <SearchPickerAutoClear
                collection={props.clusters}
                setSelected={addCluster}
                placeholder={t("Add_cluster")}
              />
            </td>
            <td>
              <SearchPickerAutoClear
                collection={props.languages}
                setSelected={addLanguage}
                placeholder={t("Add_language")}
              />
            </td>
            <td>
              <PersonPicker
                value={null}
                setValue={p => p && addPerson(p)}
                placeholder={t("Add_person")}
                autoClear
              />
            </td>
          </tr>
          <tr>
            <td>
              <table>
                <tbody>
                  {event.clusters.map(cluster => (
                    <tr key={cluster.id}>
                      <td>{cluster.name}</td>
                      <td>
                        <DeleteIcon
                          onClick={() => {
                            dropCluster(cluster.id);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
            <td>
              <table>
                <tbody>
                  {event.languages.map(language => (
                    <tr key={language.id}>
                      <td>{language.name}</td>
                      <td>
                        <DeleteIcon
                          onClick={() => {
                            dropLanguage(language.id);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
            <td>
              <table>
                <tbody>
                  {event.event_participants.map(participant => (
                    <tr key={participant.person_id}>
                      <td>{participant.full_name}</td>
                      <td>
                        <DeleteIcon
                          onClick={() => {
                            dropPerson(participant.person_id);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      {event.event_participants.length > 0 && (
        <table className={style.rolesTable}>
          <tbody>
            <tr>
              <th colSpan={2}>{t("Roles")}</th>
            </tr>
            {event.event_participants.map(participant => (
              <tr key={participant.person_id}>
                <td>{participant.full_name}</td>
                <td>
                  {participant.roles.map((role, roleIndex) => (
                    <span key={roleIndex}>
                      <SelectInput
                        options={SelectInput.fromObjectOptions(t("roles"))}
                        value={role}
                        setValue={newRole =>
                          updateRole(participant, roleIndex, newRole)
                        }
                      />
                      <DeleteIcon
                        onClick={() => dropRole(participant, roleIndex)}
                      />
                      <br />
                    </span>
                  ))}
                  <AddIcon onClick={() => addRole(participant)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const EditEventParticipantsTable = connect((state: AppState) => ({
  languages: state.languages,
  clusters: state.clusters,
  people: state.people
}))(BaseEditEventParticipantsTable);

export default EditEventParticipantsTable;
