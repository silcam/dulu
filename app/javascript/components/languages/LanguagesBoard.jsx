import React from "react";
import PropTypes from "prop-types";
import styles from "../shared/MasterDetail.css";
import { Link } from "react-router-dom";
import TextFilter from "../shared/TextFilter";
import AddIcon from "../shared/icons/AddIcon";
import LanguagesTable from "./LanguagesTable";
import FlexSpacer from "../shared/FlexSpacer";
import DuluAxios from "../../util/DuluAxios";
import LanguageContainer from "./LanguageContainer";

export default class LanguagesBoard extends React.PureComponent {
  state = {
    can: {}
  };

  async componentDidMount() {
    const data = await DuluAxios.get("/api/languages");
    if (data) {
      this.setState({
        can: data.can
      });
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

          <TextFilter
            placeholder={this.props.t("Find")}
            updateFilter={filter => this.setState({ filter: filter })}
          />
          {this.state.can.create && (
            <Link to="/languages/new">
              <AddIcon iconSize="large" />
            </Link>
          )}
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
              can={this.state.can}
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
                setNetworkError={this.props.setNetworkError}
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
  setNetworkError: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  action: PropTypes.string,
  id: PropTypes.number,
  basePath: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  viewPrefs: PropTypes.object.isRequired,
  updateViewPrefs: PropTypes.func.isRequired
};
