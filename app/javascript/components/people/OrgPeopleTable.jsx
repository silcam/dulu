import React from "react";

import AddOrgPersonRow from "./AddOrgPersonRow";
import OrgPeopleTableRow from "./OrgPeopleTableRow";

class OrgPeopleTable extends React.PureComponent {
  render() {
    const person = this.props.person;
    const orgPeople = this.props.person.organization_people;
    const t = this.props.t;
    const editEnabled = this.props.editEnabled;

    if (!editEnabled && orgPeople.length == 0) return null;

    return (
      <div id="orgPeopleTable">
        <h3> {t("Organizations")} </h3>
        <table className="table">
          <tbody>
            {orgPeople.map(orgPerson => {
              return (
                <OrgPeopleTableRow
                  key={orgPerson.id}
                  person={person}
                  orgPerson={orgPerson}
                  t={t}
                  editEnabled={editEnabled}
                  rawPut={this.props.rawPut}
                  rawDelete={this.props.rawDelete}
                  updateModel={this.props.updateModel}
                  setOrg={this.props.setOrg}
                />
              );
            })}
            {editEnabled && (
              <AddOrgPersonRow
                t={t}
                person={person}
                rawPost={this.props.rawPost}
                updateModel={this.props.updateModel}
              />
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default OrgPeopleTable;
