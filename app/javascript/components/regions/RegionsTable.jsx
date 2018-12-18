import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Loading from "../shared/Loading";
import style from "../shared/MasterDetail.css";

export default withRouter(RegionsTable);

function RegionsTable(props) {
  const regions = props.regions;
  const t = props.t;

  if (regions.length == 0) return <Loading t={t} />;

  return (
    <div>
      <table>
        <tbody>
          {regions.map(region => (
            <tr
              key={region.id}
              className={region.id == props.id ? style.selected : undefined}
              onClick={() => props.history.push(`/regions/${region.id}`)}
            >
              <td>{region.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

RegionsTable.propTypes = {
  regions: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  id: PropTypes.string,

  // Supplied by withRouter
  history: PropTypes.object.isRequired
};
