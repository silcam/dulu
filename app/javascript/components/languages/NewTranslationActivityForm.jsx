import React from "react";
import PropTypes from "prop-types";
import styles from "./ActivitiesTable.css";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import update from "immutability-helper";
import SaveIndicator from "../shared/SaveIndicator";
import FormGroup from "../shared/FormGroup";
import SelectInput from "../shared/SelectInput";

export default class NewTranslationActivityForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newActivity: {
        bible_book_id: props.availableBooks[0] && props.availableBooks[0].id
      }
    };
  }

  updateNewActivity = mergeActivity => {
    this.setState(prevState => ({
      newActivity: update(prevState.newActivity, { $merge: mergeActivity })
    }));
  };

  render() {
    const t = this.props.t;
    if (this.props.saving) return <SaveIndicator saving={true} t={t} />;

    return (
      <div className={styles.newActivityForm}>
        <FormGroup label={t("New_activity")}>
          <SelectInput
            value={this.state.newActivity.bible_book_id}
            setValue={id => this.updateNewActivity({ bible_book_id: id })}
            options={this.props.availableBooks.map(book => ({
              value: book.id,
              display: book.name
            }))}
          />
        </FormGroup>
        <SmallSaveAndCancel
          handleSave={() => this.props.addNewActivity(this.state.newActivity)}
          handleCancel={this.props.cancelForm}
          t={t}
        />
      </div>
    );
  }
}

NewTranslationActivityForm.propTypes = {
  availableBooks: PropTypes.array.isRequired,
  saving: PropTypes.bool,
  t: PropTypes.func.isRequired,
  cancelForm: PropTypes.func.isRequired,
  addNewActivity: PropTypes.func.isRequired
};
