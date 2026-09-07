import React from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../shared/Loading";
import style from "../shared/MasterDetail.css";
import { IRegion } from "../../models/Region";
import List from "../../models/List";

interface IProps {
  id?: number;
  regions: List<IRegion>;
}

export default RegionsTable;

function RegionsTable(props: IProps) {
  const navigate = useNavigate();
  const regions = props.regions;

  if (regions.length() == 0) return <Loading />;

  return (
    <div>
      <table>
        <tbody>
          {regions.map(region => (
            <tr
              key={region.id}
              className={region.id == props.id ? style.selected : undefined}
              onClick={() => navigate(`/regions/${region.id}`)}
            >
              <td>{region.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
