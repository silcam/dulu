import React, { useContext } from "react";
import { Link } from "react-router-dom";
import I18nContext from "../../contexts/I18nContext";

export type TableReport = {
  type: "plain";
  heading: string;
  table: (string | { text: string; url: string })[][];
};

interface IProps {
  report: TableReport;
}

export default function PlainTable(props: IProps) {
  const t = useContext(I18nContext);
  return (
    <div>
      <h3>{t(props.report.heading)}</h3>
      <table>
        <tbody>
          <tr>
            {props.report.table[0].map((heading, index) => (
              <th key={index}>{heading}</th>
            ))}
          </tr>
          {props.report.table.slice(1).map((row, index) => (
            <tr key={index}>
              {row.map((item, itemIndex) => (
                <td key={itemIndex}>
                  {item &&
                    (typeof item == "string" ? (
                      item
                    ) : (
                      <Link to={item.url}>{item.text}</Link>
                    ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
