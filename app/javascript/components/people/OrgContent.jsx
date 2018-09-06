import React from "react";

import tSub from "../../util/tSub";

import CloseIconButton from "../shared/CloseIconButton";
import DangerButton from "../shared/DangerButton";
import DeleteIconButton from "../shared/DeleteIconButton";
import EditableTextSearchInput from "../shared/EditableTextSearchInput";
import EditableTextArea from "../shared/EditableTextArea";
import EditableTextBox from "../shared/EditableTextBox";
import backedModel from "../shared/backedModel";
import SaveIndicator from "../shared/SaveIndicator";

class BasicOrgContent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { deleting: false };
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.deleting &&
      this.props.organization != prevProps.organization
    ) {
      this.setState({ deleting: false });
    }
  }

  clickClose = () => {
    this.props.setSelection(null);
  };

  clickDelete = () => {
    this.setState({ deleting: true });
  };

  cancelDelete = () => {
    this.setState({ deleting: false });
  };

  deleteOrg = () => {
    const orgId = this.props.organization.id;
    this.props.delete(() => {
      this.props.deleteOrg(orgId);
    });
  };

  updateField = (field, value) => {
    this.props.update({ [field]: value });
  };

  render() {
    const t = this.props.t;
    const org = this.props.organization;

    if (org == null) {
      return <p className="alertBox alertYellow">{t("Loading")}</p>;
    }

    const editEnabled = this.props.can.update;
    const deleteWarning = tSub(t("delete_person_warning"), {
      name: org.short_name
    });
    const deleteButtonText = tSub(t("delete_person"), {
      name: org.short_name
    });

    return (
      <div>
        <h3 style={{ color: "#aaa" }}>
          <CloseIconButton handleClick={this.clickClose} />
          {this.props.can.destroy && (
            <DeleteIconButton handleClick={this.clickDelete} />
          )}
        </h3>

        {this.state.deleting && (
          <DangerButton
            handleClick={this.deleteOrg}
            handleCancel={this.cancelDelete}
            message={deleteWarning}
            buttonText={deleteButtonText}
            t={t}
          />
        )}

        <SaveIndicator
          t={t}
          saving={this.props.saving > 0}
          saved={this.props.savedChanges}
        />

        <h2>
          <EditableTextBox
            field="short_name"
            text={org.short_name}
            value={org.short_name}
            updateValue={this.updateField}
            editEnabled={editEnabled}
            validateNotBlank
            t={t}
          />
        </h2>
        <h3>
          <EditableTextBox
            field="long_name"
            text={org.long_name}
            placeholder={t("Long_name")}
            value={org.long_name || ""}
            updateValue={this.updateField}
            editEnabled={editEnabled}
            t={t}
          />
        </h3>
        <ul className="list-unstyled">
          <li>
            <strong>{t("Parent_organization")}:</strong>
            &nbsp;
            <EditableTextSearchInput
              queryPath="/api/organizations/search"
              text={org.parent.name}
              value={org.parent.id}
              field="parent_id"
              editEnabled={editEnabled}
              updateValue={this.updateField}
            />
          </li>
          <li>
            <strong>{t("Country")}:</strong>
            &nbsp;
            <EditableTextSearchInput
              queryPath="/api/countries/search"
              text={org.country.name}
              value={org.country.id}
              field="country_id"
              editEnabled={editEnabled}
              updateValue={this.updateField}
            />
          </li>
        </ul>
        <h4 />
        <h4 />
        <div>
          <EditableTextArea
            field="description"
            t={t}
            text={org.description}
            placeholder={t("Description")}
            value={org.description || ""}
            updateValue={this.updateField}
            editEnabled={editEnabled}
          />
        </div>
      </div>
    );
  }
}

const OrgContent = backedModel(
  BasicOrgContent,
  "/api/organizations",
  "organization"
);

export default OrgContent;
