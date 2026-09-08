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

// @types/react 16's ReactNode included `{}`, so rendering a bare
// `string | { text, url }` type-checked even though React 16 itself threw
// "Objects are not valid as a React child" on the object branch. The 18 types
// dropped `{}` and the heading row -- which used to interpolate the cell
// directly -- stopped compiling. Both rows go through this now, so an object
// heading renders its link instead of crashing.
function Cell(props: { item: string | { text: string; url: string } }) {
  if (!props.item) return null;
  if (typeof props.item == "string") return <>{props.item}</>;
  return <Link to={props.item.url}>{props.item.text}</Link>;
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
              <th key={index}>
                <Cell item={heading} />
              </th>
            ))}
          </tr>
          {props.report.table.slice(1).map((row, index) => (
            <tr key={index}>
              {row.map((item, itemIndex) => (
                <td key={itemIndex}>
                  <Cell item={item} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
