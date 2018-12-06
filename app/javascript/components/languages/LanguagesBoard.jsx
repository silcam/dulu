import React from "react";
import styles from "../shared/MasterDetail.css";
import { Link } from "react-router-dom";
import TextFilter from "../shared/TextFilter";
import AddIcon from "../shared/icons/AddIcon";
import Loading from "../shared/Loading";
import thingBoard from "../shared/thingBoard";
import { languageCompare } from "../../models/language";
import LanguagesTable from "./LanguagesTable";
import LanguagePage from "./LanguagePage";

class Board extends React.PureComponent {
  state = {};

  render() {
    const selectedLanguage = this.props.selected;
    return (
      <div className={styles.container}>
        <div className={styles.headerBar}>
          <Link to="/languages">
            <h2>{this.props.t("Languages")}</h2>
          </Link>
          <TextFilter
            placeholder={this.props.t("Find")}
            updateFilter={filter => this.setState({ filter: filter })}
          />
          {this.props.can.create && (
            <Link to="/languages/new">
              <AddIcon iconSize="large" />
            </Link>
          )}
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
            {selectedLanguage &&
              (selectedLanguage.loaded ? (
                <LanguagePage
                  key={selectedLanguage.id}
                  language={selectedLanguage}
                  t={this.props.t}
                  replaceLanguage={this.props.replace}
                  setNetworkError={this.props.setNetworkError}
                  basePath={this.props.basePath}
                  location={this.props.location}
                />
              ) : (
                <Loading t={this.props.t} />
              ))}
            {!this.props.action && !selectedLanguage && (
              <span>Placeholder for Languages summary</span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const LanguagesBoard = thingBoard(Board, {
  name: "language",
  pluralName: "languages",
  compare: languageCompare
});

export default LanguagesBoard;
