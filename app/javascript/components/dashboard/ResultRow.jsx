import React from "react";
import { Link } from "react-router-dom";

function ResultRow(props) {
  const result = props.result;
  return (
    <tr>
      <td style={{ paddingLeft: props.padding }}>
        {result.route ? (
          <Link to={result.route}>{result.title}</Link>
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
