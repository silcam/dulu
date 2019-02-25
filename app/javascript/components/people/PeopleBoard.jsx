import React from "react";
import styles from "../shared/MasterDetail.css";
import PeopleTable from "./PeopleTable";
import NewPersonForm from "./NewPersonForm";
import AddIcon from "../shared/icons/AddIcon";
import { Link } from "react-router-dom";
import TextFilter from "../shared/TextFilter";
import FlexSpacer from "../shared/FlexSpacer";
import DuluAxios from "../../util/DuluAxios";
import PropTypes from "prop-types";
import PersonContainer from "./PersonContainer";

export default class PeopleBoard extends React.PureComponent {
  state = {
    can: {}
  };

  async componentDidMount() {
    const data = await DuluAxios.get("/api/people");
    if (data) {
      this.setState({
        can: data.can
      });
      this.props.setPeople(data.people);
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.headerBar}>
          <h2>
            <Link to="/people">{this.props.t("People")}</Link>
          </h2>
          <TextFilter
            placeholder={this.props.t("Find")}
            updateFilter={filter => this.setState({ filter: filter })}
          />
          {this.state.can.create && (
            <Link to="/people/new">
              <AddIcon iconSize="large" />
            </Link>
          )}
          <FlexSpacer />
          <h3>
            <Link to="/organizations">{this.props.t("Organizations")}</Link>
          </h3>
        </div>
        <div className={styles.masterDetailContainer}>
          <div className={styles.master}>
            <PeopleTable
              t={this.props.t}
              id={this.props.id}
              people={this.props.people}
              can={this.state.can}
              filter={this.state.filter}
            />
          </div>
          <div className={styles.detail}>
            {this.props.action == "new" && (
              <NewPersonForm
                t={this.props.t}
                people={this.props.people}
                addPerson={this.props.addPerson}
                history={this.props.history}
              />
            )}
            {this.props.action == "show" && (
              <PersonContainer
                key={this.props.id}
                id={this.props.id}
                t={this.props.t}
                updateLanguage={this.props.updateLanguage}
                history={this.props.history}
              />
            )}
            {!this.props.action && <span />}
          </div>
        </div>
      </div>
    );
  }
}

PeopleBoard.propTypes = {
  setPeople: PropTypes.func.isRequired,
  addPerson: PropTypes.func.isRequired,
  setPerson: PropTypes.func.isRequired,
  deletePerson: PropTypes.func.isRequired,

  updateLanguage: PropTypes.func.isRequired,
  people: PropTypes.array.isRequired,
  id: PropTypes.string,
  action: PropTypes.string,
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};
