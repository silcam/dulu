import React from "react";
import PeopleTableRow from "./PeopleTableRow";
import StyledLink from "../shared/StyledLink";
import { Link } from "react-router-dom";

class PeopleTable extends React.PureComponent {
  newPersonForm = () => {
    this.props.setPerson(null);
  };

  render() {
    const people = this.props.people;
    const t = this.props.t;
    if (people.length == 0) {
      return <p className="alertBox alertYellow">{t("Loading")}</p>;
    }
    return (
      <div>
        {this.props.can.create && (
          <p style={{ paddingLeft: "8px" }}>
            <StyledLink styleClass="btnBlue">
              <Link to="/people/new">{t("Add_new_person")}</Link>
            </StyledLink>
          </p>
        )}
        <table className="table">
          <tbody>
            {people.map(person => {
              return (
                <PeopleTableRow
                  key={person.id}
                  person={person}
                  selected={this.props.routeAction == person.id}
                  t={t}
                  setPerson={this.props.setPerson}
                  selection={this.props.selection}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default PeopleTable;
