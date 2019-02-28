import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import Loading from "../shared/Loading";
import style from "../shared/MasterDetail.css";
import { IRegion } from "../../models/Region";
import { RouteComponentProps } from "react-router";
import I18nContext from "../../application/I18nContext";

interface IProps extends RouteComponentProps {
  id?: number;
  regions: IRegion[];
}

export default withRouter(RegionsTable);

function RegionsTable(props: IProps) {
  const regions = props.regions;
  const t = useContext(I18nContext);

  if (regions.length == 0) return <Loading />;

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
