import React from "react";
import PropTypes from "prop-types";
import SearchTextInput from "../shared/SearchTextInput";
import P from "../shared/P";
import DeleteIcon from "../shared/icons/DeleteIcon";
import Report from "../../models/Report";
import CheckBoxInput from "../shared/CheckboxInput";
import update from "immutability-helper";

export default function ReportSideBar(props) {
  const t = props.t;
  const report = props.report;

  return (
    <div>
      <h3>{t("Report_options")}</h3>
      {showSaveButton(report) && (
        <button onClick={props.save}>{t("Save")}</button>
      )}
      <P>
        <label>{t("Clusters")}</label>
        <ul>
          {report.clusters.map(cluster => (
            <li key={cluster.id}>
              - {cluster.name}
              <DeleteIcon
                onClick={() => props.dropCluster(cluster.id)}
                iconSize="small"
              />
            </li>
          ))}
        </ul>
        <SearchTextInput
          queryPath="/api/clusters/search"
          updateValue={props.addCluster}
          placeholder={t("Add_cluster")}
          text=""
        />
      </P>
      <P>
        <label>{t("Languages")}</label>
        <ul>
          {report.programs.map(program => (
            <li key={program.id}>
              - {program.name}
              <DeleteIcon
                onClick={() => props.dropProgram(program.id)}
                iconSize="small"
              />
            </li>
          ))}
        </ul>
        <SearchTextInput
          queryPath="/api/languages/search"
          updateValue={props.addProgram}
          placeholder={t("Add_language")}
          text=""
        />
      </P>
      <P>
        <label>{t("domains.Translation")}</label>
        <ul>
          {Report.LanguageComparison.elements.activities.map(testament => (
            <li key={testament}>
              <CheckBoxInput
                text={t(testament)}
                value={report.elements.activities[testament]}
                handleCheck={e =>
                  props.updateElements(
                    update(report.elements, {
                      activities: { [testament]: { $set: e.target.checked } }
                    })
                  )
                }
              />
            </li>
          ))}
        </ul>
      </P>
      <P>
        <label>{t("Publications")}</label>
        <ul>
          {Report.LanguageComparison.elements.publications.map(pub => (
            <li key={pub}>
              <CheckBoxInput
                text={Report.tPubName(pub, t)}
                value={report.elements.publications[pub] || false}
                handleCheck={e =>
                  props.updateElements(
                    update(report.elements, {
                      publications: { [pub]: { $set: e.target.checked } }
                    })
                  )
                }
              />
            </li>
          ))}
        </ul>
      </P>
    </div>
  );
}

function showSaveButton(report) {
  return (
    (report.clusters.length > 0 || report.programs.length > 0) &&
    (Object.keys(report.elements.activities).some(
      testament => report.elements.activities[testament]
    ) ||
      Object.keys(report.elements.publications).some(
        pub => report.elements.publications[pub]
      ))
  );
}

ReportSideBar.propTypes = {
  t: PropTypes.func.isRequired,
  report: PropTypes.object.isRequired,
  addCluster: PropTypes.func.isRequired, // addCluster(id)
  addProgram: PropTypes.func.isRequired, // addProgram(id)
  dropCluster: PropTypes.func.isRequired, // dropCluster(id)
  dropProgram: PropTypes.func.isRequired, // dropProgram(id)
  updateElements: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired
};
