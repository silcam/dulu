import React from "react";
import PropTypes from "prop-types";
import P from "../shared/P";
import DeleteIcon from "../shared/icons/DeleteIcon";
import Report from "../../models/Report";
import CheckBoxInput from "../shared/CheckboxInput";
import update from "immutability-helper";
import { LanguagePicker, ClusterPicker } from "../shared/SearchPickers";

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
        <ClusterPicker
          selectedId={undefined}
          setSelected={id => props.addCluster({ id: id })}
          placeholder={t("Add_cluster")}
          autoClear
        />
      </P>
      <P>
        <label>{t("Languages")}</label>
        <ul>
          {report.languages.map(language => (
            <li key={language.id}>
              - {language.name}
              <DeleteIcon
                onClick={() => props.dropProgram(language.id)}
                iconSize="small"
              />
            </li>
          ))}
        </ul>
        <LanguagePicker
          selectedId={undefined}
          setSelected={id => props.addProgram({ id: id })}
          placeholder={t("Add_language")}
          autoClear
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
                handleCheck={checked =>
                  props.updateElements(
                    update(report.elements, {
                      activities: { [testament]: { $set: checked } }
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
                handleCheck={checked =>
                  props.updateElements(
                    update(report.elements, {
                      publications: { [pub]: { $set: checked } }
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
    (report.clusters.length > 0 || report.languages.length > 0) &&
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
