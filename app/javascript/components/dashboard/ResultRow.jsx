import React from "react";

function ResultRow(props) {
  const result = props.result;
  return (
    <tr>
      <td style={{ paddingLeft: props.padding }}>
        {result.route ? (
          <a href={result.route}>{result.title}</a>
        ) : (
          result.title
        )}
        &nbsp;
        <small>{result.description}</small>
        {/* {props.firstResult &&
                    <span className="text-muted" style={{fontStyle: 'italic'}}>
                        <br/>Press enter to go now
                    </span>
                } */}
      </td>
    </tr>
  );
}

export default ResultRow;
