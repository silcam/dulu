import React from "react";
import PropTypes from "prop-types";
import thingBoard from "../shared/thingBoard";
import Region from "../../models/Region";
import style from "../shared/MasterDetail.css";
import RegionsTable from "./RegionsTable";
import AddIcon from "../shared/icons/AddIcon";
import FlexSpacer from "../shared/FlexSpacer";
import { Link } from "react-router-dom";
import NewRegionForm from "./NewRegionForm";
import RegionPage from "./RegionPage";

class _RegionsBoard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const t = this.props.t;
    const selectedRegion = this.props.selected;

    return (
      <div className={style.container}>
        <div className={style.headerBar}>
          <h2>{t("Regions")}</h2>
          {this.props.can.create && (
            <Link to="/regions/new">
              <AddIcon iconSize="large" />
            </Link>
          )}
          <FlexSpacer />
          <h3>
            <Link to="/clusters">{t("Clusters")}</Link>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link to={"/languages"}>{t("Languages")}</Link>
          </h3>
        </div>
        <div className={style.masterDetailContainer}>
          <div className={style.master}>
            <RegionsTable
              t={t}
              id={this.props.id}
              regions={this.props.regions}
              can={this.props.can}
            />
          </div>
          <div className={style.detail}>
            {this.props.action == "new" && (
              <NewRegionForm
                t={t}
                saving={this.props.savingNow}
                addRegion={this.props.add}
              />
            )}
            {selectedRegion && selectedRegion.loaded && (
              <RegionPage
                key={selectedRegion.id}
                region={selectedRegion}
                t={t}
                replaceRegion={this.props.replace}
                setNetworkError={this.props.setNetworkError}
                basePath={this.props.basePath}
                deleteRegion={this.props.delete}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const RegionsBoard = thingBoard(_RegionsBoard, {
  name: "region",
  compare: Region.compare
});

_RegionsBoard.propTypes = {
  t: PropTypes.func.isRequired,
  id: PropTypes.string,
  setNetworkError: PropTypes.func.isRequired,
  basePath: PropTypes.string.isRequired,

  // Supplied by thingBoard
  regions: PropTypes.array,
  can: PropTypes.object,
  selected: PropTypes.object,
  replace: PropTypes.func,
  action: PropTypes.string,
  savingNow: PropTypes.bool,
  add: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired
};

export default RegionsBoard;
