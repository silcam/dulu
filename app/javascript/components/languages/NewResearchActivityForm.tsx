import React from "react";
import styles from "./ActivitiesTable.css";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import update from "immutability-helper";
import SaveIndicator from "../shared/SaveIndicator";
import FormGroup from "../shared/FormGroup";
import TextInput from "../shared/TextInput";
import I18nContext from "../../contexts/I18nContext";

interface NewResearchActivity {
  title: string;
}

interface IProps {
  cancelForm: () => void;
  addNewActivity: (a: NewResearchActivity) => void;
  saving?: boolean;
}

interface IState {
  newActivity: NewResearchActivity;
}

export default class NewResearchActivityForm extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      newActivity: {
        title: ""
      }
    };
  }

  updateNewActivity = (mergeActivity: Partial<NewResearchActivity>) => {
    this.setState(prevState => ({
      newActivity: update(prevState.newActivity, { $merge: mergeActivity })
    }));
  };

  render() {
    if (this.props.saving) return <SaveIndicator saving={true} />;

    return (
      <I18nContext.Consumer>
        {t => (
          <div className={styles.newActivityForm}>
            <FormGroup label={t("New_activity")}>
              <TextInput
                value={this.state.newActivity.title}
                placeholder={t("Title")}
                setValue={title => this.updateNewActivity({ title })}
                autoFocus
              />
            </FormGroup>
            <SmallSaveAndCancel
              handleSave={() =>
                this.props.addNewActivity(this.state.newActivity)
              }
              handleCancel={this.props.cancelForm}
              saveDisabled={this.state.newActivity.title == ""}
            />
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
