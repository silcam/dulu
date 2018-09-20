import React from "react";
import PeopleTableRow from "./PeopleTableRow";
import { Link } from "react-router-dom";
import Loading from "../shared/Loading";

class PeopleTable extends React.PureComponent {
  newPersonForm = () => {
    this.props.setPerson(null);
  };

  render() {
    const people = this.props.people;
    const t = this.props.t;
    if (people.length == 0) {
      return <Loading t={t} />;
    }
    return (
      <div>
        {this.props.can.create && (
          <p style={{ paddingLeft: "8px" }}>
            <Link to="/people/new" className="btn">
              {t("Add_new_person")}
            </Link>
          </p>
        )}
        <table className="table">
          <tbody>
            {people.map(person => {
              return (
                <PeopleTableRow
                  key={person.id}
                  person={person}
                  selected={this.props.id == person.id}
                  t={t}
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
