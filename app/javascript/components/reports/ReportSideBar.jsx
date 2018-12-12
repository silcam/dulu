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
      <P>
        <label>{t("Clusters")}</label>
        <SearchTextInput
          queryPath="/api/clusters/search"
          updateValue={props.addCluster}
          placeholder={t("Add_cluster")}
        />
        <ul>
          {report.clusters.map(cluster => (
            <li key={cluster.id}>
              {cluster.name}
              <DeleteIcon
                onClick={() => props.dropCluster(cluster.id)}
                iconSize="small"
              />
            </li>
          ))}
        </ul>
      </P>
      <P>
        <label>{t("Languages")}</label>
        <SearchTextInput
          queryPath="/api/languages/search"
          updateValue={props.addProgram}
          placeholder={t("Add_language")}
        />
        <ul>
          {report.programs.map(program => (
            <li key={program.id}>
              {program.name}
              <DeleteIcon
                onClick={() => props.dropProgram(program.id)}
                iconSize="small"
              />
            </li>
          ))}
        </ul>
      </P>
      <P>
        <label>{t("domains.Translation")}</label>
        <ul>
          {Report.lc.elements.activities.map(testament => (
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
          {Report.lc.elements.publications.map(pub => (
            <li key={pub}>
              <CheckBoxInput
                text={t(pub)}
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

ReportSideBar.propTypes = {
  t: PropTypes.func.isRequired,
  report: PropTypes.object.isRequired,
  addCluster: PropTypes.func.isRequired, // addCluster(id)
  addProgram: PropTypes.func.isRequired, // addProgram(id)
  dropCluster: PropTypes.func.isRequired, // dropCluster(id)
  dropProgram: PropTypes.func.isRequired, // dropProgram(id)
  updateElements: PropTypes.func.isRequired
};
