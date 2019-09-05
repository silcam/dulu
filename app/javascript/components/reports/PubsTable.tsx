import React, { useContext } from "react";
import Colors from "../../util/Colors";
import Report, {
  IReportElements,
  IReportLanguage
} from "../../models/TranslationProgressReport";
import I18nContext from "../../contexts/I18nContext";
import TranslationProgressReport from "../../models/TranslationProgressReport";

interface IProps {
  elements: IReportElements;
  language: IReportLanguage;
}

export default function PubsTable(props: IProps) {
  const t = useContext(I18nContext);
  const language = props.language;
  const pubs = TranslationProgressReport.LanguageComparison.elements.publications.filter(
    pub => props.elements.publications[pub]
  );
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th>{t("Published")}</th>
            {pubs.map(pub => {
              let color = language.report.publications[pub]
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
