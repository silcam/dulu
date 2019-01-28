import React from "react";
import PropTypes from "prop-types";
import Activity from "../../models/Activity";
import Colors from "../../util/Colors";

export default function ColorKey(props) {
  const t = props.t;
  return (
    <table>
      <tbody>
        <tr>
          {Object.keys(Activity.translationProgress)
            .slice(1)
            .map(stage => (
              <td
                key={stage}
                style={{
                  backgroundColor: Activity.translationProgress[stage].color,
                  color: Colors.foreground(
                    Activity.translationProgress[stage].color
                  )
                }}
              >
                {t(`stage_names.${stage}`)}
              </td>
            ))}
        </tr>
      </tbody>
    </table>
  );
}

ColorKey.propTypes = {
  t: PropTypes.func.isRequired
};
