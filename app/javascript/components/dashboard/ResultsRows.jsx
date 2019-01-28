import React from "react";

import ResultRow from "./ResultRow";

function ResultsRows(props) {
  return (
    <React.Fragment>
      {props.results.map((result, index) => {
        return (
          <React.Fragment key={result.title + result.route}>
            <ResultRow
              result={result}
              padding={props.padding}
              firstResult={index == 0}
            />
            {result.subresults && (
              <ResultsRows results={result.subresults} padding="30px" />
            )}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
}

export default ResultsRows;
