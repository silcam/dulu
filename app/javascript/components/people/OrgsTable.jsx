import React from "react";

import AddButton from "../shared/AddButton";

import OrgTableRow from "./OrgTableRow";

class OrgsTable extends React.PureComponent {
  newOrgForm = () => {
    this.props.setOrg(null);
  };

  render() {
    const orgs = this.props.orgs;
    const t = this.props.t;
    if (orgs.length == 0) {
      return <p className="alertBox alertYellow">{t("Loading")}</p>;
    }
    return (
      <div>
        {this.props.can.create && (
          <p style={{ paddingLeft: "8px" }}>
            <AddButton
              text={t("Add_new_organization")}
              handleClick={this.newOrgForm}
            />
          </p>
        )}
        <table className="table">
          <tbody>
            {orgs.map(org => {
              return (
                <OrgTableRow
                  key={org.id}
                  org={org}
                  t={t}
                  setOrg={this.props.setOrg}
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

export default OrgsTable;
