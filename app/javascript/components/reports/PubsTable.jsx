import React from "react";
import PropTypes from "prop-types";
import Colors from "../../util/Colors";

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
            {pubs.map(pub => (
              <td
                key={pub}
                style={{
                  backgroundColor: program.report.publications[pub]
                    ? Colors.purple
                    : "white"
                }}
              >
                {t(pub)}
              </td>
            ))}
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
