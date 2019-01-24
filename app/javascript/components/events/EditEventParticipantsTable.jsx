import React from "react";
import PropTypes from "prop-types";
import SearchTextInput from "../shared/SearchTextInput";
import update from "immutability-helper";
import DeleteIcon from "../shared/icons/DeleteIcon";
import SelectInput from "../shared/SelectInput";
import selectOptionsFromObject from "../../util/selectOptionsFromObject";
import AddIcon from "../shared/icons/AddIcon";
import style from "./EditEventParticipantsTable.css";

export default function EditEventParticipantsTable(props) {
  const event = props.event;
  const t = props.t;

  const addCluster = cluster => {
    props.replaceEvent(update(props.event, { clusters: { $push: [cluster] } }));
  };

  const addLanguage = language => {
    props.replaceEvent(
      update(props.event, { programs: { $push: [language] } })
    );
  };

  const addPerson = person => {
    props.replaceEvent(
      update(props.event, {
        event_participants: {
          $push: [{ person_id: person.id, full_name: person.name, roles: [] }]
        }
      })
    );
  };

  const dropCluster = id => {
    const newClusters = props.event.clusters.filter(c => c.id != id);
    props.replaceEvent(
      update(props.event, { clusters: { $set: newClusters } })
    );
  };

  const dropLanguage = id => {
    const newPrograms = props.event.programs.filter(p => p.id != id);
    props.replaceEvent(
      update(props.event, { programs: { $set: newPrograms } })
    );
  };

  const dropPerson = person_id => {
    const newEventParticipants = props.event.event_participants.filter(
      p => p.person_id != person_id
    );
    props.replaceEvent(
      update(props.event, {
        event_participants: { $set: newEventParticipants }
      })
    );
  };

  const defaultNewRole = () => Object.keys(props.t("roles"))[0];

  const addRole = participant => {
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

  const updateRole = (participant, roleIndex, newRole) => {
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

  const dropRole = (participant, roleIndex) => {
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
              <SearchTextInput
                queryPath="/api/clusters/search"
                updateValue={addCluster}
                placeholder={t("Add_cluster")}
                text=""
                addBox
              />
            </td>
            <td>
              <SearchTextInput
                queryPath="/api/languages/search"
                updateValue={addLanguage}
                placeholder={t("Add_language")}
                text=""
                addBox
              />
            </td>
            <td>
              <SearchTextInput
                queryPath="/api/people/search"
                updateValue={addPerson}
                placeholder={t("Add_person")}
                text=""
                addBox
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
                  {event.programs.map(program => (
                    <tr key={program.id}>
                      <td>{program.name}</td>
                      <td>
                        <DeleteIcon
                          onClick={() => {
                            dropLanguage(program.id);
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
              <th colSpan="2">{t("Roles")}</th>
            </tr>
            {event.event_participants.map(participant => (
              <tr key={participant.person_id}>
                <td>{participant.full_name}</td>
                <td>
                  {participant.roles.map((role, roleIndex) => (
                    <span key={roleIndex}>
                      <SelectInput
                        options={selectOptionsFromObject(t("roles"))}
                        value={role}
                        handleChange={e =>
                          updateRole(participant, roleIndex, e.target.value)
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

EditEventParticipantsTable.propTypes = {
  t: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  replaceEvent: PropTypes.func.isRequired
};
