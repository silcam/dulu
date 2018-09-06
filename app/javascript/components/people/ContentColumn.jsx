import React from "react";

import NewOrgForm from "./NewOrgForm";
import NewPersonForm from "./NewPersonForm";
import OrgContent from "./OrgContent";
import PersonContent from "./PersonContent";

class ContentColumn extends React.PureComponent {
  render() {
    const selection = this.props.selection;
    if (selection.type == "Person") {
      if (selection.id == null) {
        return (
          <NewPersonForm
            setSelection={this.props.setSelection}
            t={this.props.t}
            authToken={this.props.authToken}
            addPerson={this.props.addPerson}
          />
        );
      } else {
        // non-null id
        return (
          <PersonContent
            id={selection.id}
            t={this.props.t}
            setSelection={this.props.setSelection}
            setOrg={this.props.setOrg}
            deletePerson={this.props.deletePerson}
            authToken={this.props.authToken}
          />
        );
      }
    } else {
      // Organization selected
      if (selection.id == null) {
        return (
          <NewOrgForm
            setSelection={this.props.setSelection}
            t={this.props.t}
            authToken={this.props.authToken}
            addOrg={this.props.addOrg}
          />
        );
      } else {
        // Non-null id
        return (
          <OrgContent
            id={selection.id}
            t={this.props.t}
            setSelection={this.props.setSelection}
            deleteOrg={this.props.deleteOrg}
            authToken={this.props.authToken}
          />
        );
      }
    }
  }
}

export default ContentColumn;
