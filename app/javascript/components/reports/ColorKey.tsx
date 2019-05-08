import React, { useContext } from "react";
import Activity from "../../models/Activity";
import Colors from "../../util/Colors";
import I18nContext from "../../contexts/I18nContext";

export default function ColorKey() {
  const t = useContext(I18nContext);
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
