import React from "react";
import PropTypes from "prop-types";
import styles from "../shared/MasterDetail.css";
import { Link } from "react-router-dom";
import AddIcon from "../shared/icons/AddIcon";
import LanguagesTable from "./LanguagesTable";
import FlexSpacer from "../shared/FlexSpacer";
import DuluAxios from "../../util/DuluAxios";
import LanguageContainer from "./LanguageContainer";
import GoBar from "../shared/GoBar";

export default class LanguagesBoard extends React.PureComponent {
  state = {};

  async componentDidMount() {
    const data = await DuluAxios.get("/api/languages");
    if (data) {
      this.props.setCan("languages", data.can);
      this.props.setLanguages(data.languages);
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.headerBar}>
          <h2>
            <Link to="/languages">{this.props.t("Languages")}</Link>
          </h2>
          {this.props.can.create && (
            <Link to="/languages/new">
              <AddIcon iconSize="large" />
            </Link>
          )}
          <GoBar />
          <FlexSpacer />
          <h3>
            <Link to="/regions">{this.props.t("Regions")}</Link>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link to="/clusters">{this.props.t("Clusters")}</Link>
          </h3>
        </div>
        <div className={styles.masterDetailContainer}>
          <div className={styles.master}>
            <LanguagesTable
              t={this.props.t}
              id={this.props.id}
              languages={this.props.languages}
              can={this.props.can}
              filter={this.state.filter}
            />
          </div>
          <div className={styles.detail}>
            {/* {this.props.action == "new" && (
              <NewLanguageForm
                t={this.props.t}
                saving={this.props.savingNew}
                addLanguage={this.addLanguage}
              />
            )} */}
            {this.props.id && (
              <LanguageContainer
                key={this.props.id}
                id={this.props.id}
                t={this.props.t}
                basePath={this.props.basePath}
                location={this.props.location}
                history={this.props.history}
                viewPrefs={this.props.viewPrefs}
                updateViewPrefs={this.props.updateViewPrefs}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

LanguagesBoard.propTypes = {
  languages: PropTypes.array.isRequired,
  setLanguages: PropTypes.func.isRequired,
  setCan: PropTypes.func.isRequired,

  can: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  action: PropTypes.string,
  id: PropTypes.number,
  basePath: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  viewPrefs: PropTypes.object.isRequired,
  updateViewPrefs: PropTypes.func.isRequired
};
