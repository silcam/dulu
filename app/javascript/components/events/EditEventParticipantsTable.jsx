import React from "react";
import PropTypes from "prop-types";
import SearchTextInput from "../shared/SearchTextInput";
import update from "immutability-helper";
import DeleteIcon from "../shared/icons/DeleteIcon";

export default function EditEventParticipantsTable(props) {
  const event = props.event;
  const t = props.t;

  const addCluster = (id, name) => {
    props.replaceEvent(
      update(props.event, { clusters: { $push: [{ id: id, name: name }] } })
    );
  };

  const addLanguage = (id, name) => {
    props.replaceEvent(
      update(props.event, { programs: { $push: [{ id: id, name: name }] } })
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

  return (
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
            />
          </td>
          <td>
            <SearchTextInput
              queryPath="/api/languages/search"
              updateValue={addLanguage}
              placeholder={t("Add_language")}
            />
          </td>
          <td>{t("Add")}</td>
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
        </tr>
      </tbody>
    </table>
  );
}

EditEventParticipantsTable.propTypes = {
  t: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  replaceEvent: PropTypes.func.isRequired
};
