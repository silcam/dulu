import React from "react";
import styles from "../shared/MasterDetail.css";
import PeopleTable from "./PeopleTable";
import NewPersonForm from "./NewPersonForm";
import AddIcon from "../shared/icons/AddIcon";
import { Link } from "react-router-dom";
import FlexSpacer from "../shared/FlexSpacer";
import DuluAxios from "../../util/DuluAxios";
import PersonContainer from "./PersonContainer";
import GoBar from "../shared/GoBar";
import { Adder, SetCan, Setter } from "../../models/TypeBucket";
import { IPerson } from "../../models/Person";
import List from "../../models/List";
import { History } from "history";
import { ICan } from "../../actions/canActions";
import I18nContext from "../../contexts/I18nContext";
import { Locale } from "../../i18n/i18n";

interface IProps {
  setPeople: Adder<IPerson>;
  setCan: SetCan;
  addPerson: Setter<IPerson>;
  setPerson: Setter<IPerson>;
  deletePerson: (id: number) => void;
  people: List<IPerson>;
  id?: number;
  action?: string;
  history: History;
  can: ICan;
  updateLanguage: (locale: Locale) => void;
}

interface IState {}

export default class PeopleBoard extends React.PureComponent<IProps, IState> {
  state: IState = {};

  async componentDidMount() {
    const data = await DuluAxios.get("/api/people");
    if (data) {
      this.props.setCan("people", data.can);
      this.props.setPeople(data.people);
    }
  }

  render() {
    return (
      <I18nContext.Consumer>
        {t => (
          <div className={styles.container}>
            <div className={styles.headerBar}>
              <h2>
                <Link to="/people">{t("People")}</Link>
              </h2>
              {this.props.can.create && (
                <Link to="/people/new">
                  <AddIcon iconSize="large" />
                </Link>
              )}
              <GoBar />
              <FlexSpacer />
              <h3>
                <Link to="/organizations">{t("Organizations")}</Link>
              </h3>
            </div>
            <div className={styles.masterDetailContainer}>
              <div className={styles.master}>
                <PeopleTable id={this.props.id} people={this.props.people} />
              </div>
              <div className={styles.detail}>
                {this.props.action == "new" && (
                  <NewPersonForm
                    people={this.props.people}
                    addPerson={this.props.addPerson}
                    history={this.props.history}
                    can={this.props.can}
                  />
                )}
                {this.props.action == "show" && this.props.id && (
                  <PersonContainer
                    key={this.props.id}
                    id={this.props.id}
                    updateLanguage={this.props.updateLanguage}
                    history={this.props.history}
                    t={t}
                  />
                )}
                {!this.props.action && <span />}
              </div>
            </div>
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
