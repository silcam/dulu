import React, { useContext } from "react";
import Activity from "../../models/Activity";
import Colors from "../../util/Colors";
import I18nContext from "../../contexts/I18nContext";
import { IReportElements, IReportActivities } from "../../models/Report";

interface IProps {
  elements: IReportElements;
  activities: IReportActivities;
}

export default function BibleBooksTable(props: IProps) {
  const t = useContext(I18nContext);
  let books = props.elements.activities.Old_testament
    ? props.activities.Old_testament
    : [];
  books = props.elements.activities.New_testament
    ? books.concat(props.activities.New_testament)
    : books;
  const rowLength = books.length / 3;
  const bookNamesStart = props.elements.activities.Old_testament ? 0 : 39;

  return (
    <table>
      <tbody>
        {[0, 1, 2].map(rowIndex => {
          let bookNames = t("bible_books").slice(
            bookNamesStart + rowIndex * rowLength,
            bookNamesStart + (rowIndex + 1) * rowLength
          );
          return (
            <tr key={rowIndex}>
              {bookNames.map((bookName: string, colIndex: number) => {
                let stage = books[rowIndex * rowLength + colIndex];
                let color = stage
                  ? Activity.translationProgress[stage].color
                  : "white";
                return (
                  <td
                    key={colIndex}
                    style={{
                      backgroundColor: color,
                      color: Colors.foreground(color)
                    }}
                  >
                    {bookName.replace(" ", "").slice(0, 3)}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
