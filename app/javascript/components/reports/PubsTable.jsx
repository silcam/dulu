import React from "react";
import PropTypes from "prop-types";
import Colors from "../../util/Colors";
import Report from "../../models/Report";

export default function PubsTable(props) {
  const t = props.t;
  const program = props.program;
  const pubs = Object.keys(props.elements.publications).filter(
    pub => props.elements.publications[pub]
  );
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th>{t("Published")}</th>
            {pubs.map(pub => {
              let color = program.report.publications[pub]
                ? Colors.purple
                : "white";
              return (
                <td
                  key={pub}
                  style={{
                    backgroundColor: color,
                    color: Colors.foreground(color)
                  }}
                >
                  {Report.tPubName(pub, t)}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

PubsTable.propTypes = {
  t: PropTypes.func.isRequired,
  elements: PropTypes.object.isRequired,
  program: PropTypes.object.isRequired
};
