import React from "react";
import PropTypes from "prop-types";
import Activity from "../../models/Activity";

export default function BibleBooksTable(props) {
  const t = props.t;
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
              {bookNames.map((bookName, colIndex) => {
                let stage = books[rowIndex * rowLength + colIndex];
                let color = stage
                  ? Activity.translationProgress[stage].color
                  : "white";
                return (
                  <td key={colIndex} style={{ backgroundColor: color }}>
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

BibleBooksTable.propTypes = {
  t: PropTypes.func.isRequired,
  elements: PropTypes.object.isRequired,
  activities: PropTypes.object.isRequired
};
