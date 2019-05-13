import React from "react";
import styles from "../shared/MasterDetail.css";
import { Link } from "react-router-dom";
import AddIcon from "../shared/icons/AddIcon";
import LanguagesTable from "./LanguagesTable";
import FlexSpacer from "../shared/FlexSpacer";
import DuluAxios from "../../util/DuluAxios";
import LanguageContainer from "./LanguageContainer";
import GoBar from "../shared/GoBar";
import List from "../../models/List";
import { ILanguage } from "../../models/Language";
import { Adder, SetCan } from "../../models/TypeBucket";
import { ICan } from "../../actions/canActions";
import { Location, History } from "history";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  languages: List<ILanguage>;
  setLanguages: Adder<ILanguage>;
  setCan: SetCan;

  can: ICan;
  action?: string;
  id?: number;
  basePath: string;
  location: Location;
  history: History;
}

interface IState {}

export default class LanguagesBoard extends React.Component<IProps, IState> {
  state: IState = {};

  async componentDidMount() {
    const data = await DuluAxios.get("/api/languages");
    if (data) {
      this.props.setCan("languages", data.can);
      this.props.setLanguages(data.languages);
    }
  }

  render() {
    return (
      <I18nContext.Consumer>
        {t => (
          <div className={styles.container}>
            <div className={styles.headerBar}>
              <h2>
                <Link to="/languages">{t("Languages")}</Link>
              </h2>
              {this.props.can.create && (
                <Link to="/languages/new">
                  <AddIcon iconSize="large" />
                </Link>
              )}
              <GoBar />
              <FlexSpacer />
              <h3>
                <Link to="/regions">{t("Regions")}</Link>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Link to="/clusters">{t("Clusters")}</Link>
              </h3>
            </div>
            <div className={styles.masterDetailContainer}>
              <div className={styles.master}>
                <LanguagesTable
                  id={this.props.id}
                  languages={this.props.languages}
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
                    key={this.props.id + location.pathname}
                    id={this.props.id}
                    basePath={this.props.basePath}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
