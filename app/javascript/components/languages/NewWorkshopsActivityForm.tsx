import React from "react";
import styles from "./ActivitiesTable.css";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import update from "immutability-helper";
import SaveIndicator from "../shared/SaveIndicator";
import TextInput from "../shared/TextInput";
import AddIcon from "../shared/icons/AddIcon";
import FormGroup from "../shared/FormGroup";
import I18nContext from "../../contexts/I18nContext";

interface IWorkshop {
  number: number;
  name: string;
}

interface NewWorkshopsActivity {
  title: string;
  workshops_attributes: IWorkshop[];
}

interface IProps {
  saving?: boolean;
  cancelForm: () => void;
  addNewActivity: (a: NewWorkshopsActivity) => void;
}

interface IState {
  newActivity: NewWorkshopsActivity;
}

export default class NewWorkshopsActivityForm extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      newActivity: {
        title: "",
        workshops_attributes: [{ number: 1, name: "" }]
      }
    };
  }

  updateNewActivity = (mergeActivity: Partial<NewWorkshopsActivity>) => {
    this.setState(prevState => ({
      newActivity: update(prevState.newActivity, { $merge: mergeActivity })
    }));
  };

  addWorkshop = () => {
    this.setState(prevState => {
      const newNumber = prevState.newActivity.workshops_attributes.length + 1;
      return {
        newActivity: update(prevState.newActivity, {
          workshops_attributes: { $push: [{ number: newNumber, name: "" }] }
        })
      };
    });
  };

  updateWorkshop = (workshop: IWorkshop) => {
    this.setState(prevState => {
      const wsIndex = workshop.number - 1;
      return {
        newActivity: update(prevState.newActivity, {
          workshops_attributes: { [wsIndex]: { $set: workshop } }
        })
      };
    });
  };

  render() {
    if (this.props.saving) return <SaveIndicator saving={true} />;

    return (
      <I18nContext.Consumer>
        {t => (
          <div className={styles.newActivityForm}>
            <FormGroup label={t("New_activity")}>
              <TextInput
                placeholder={t("Title")}
                value={this.state.newActivity.title}
                setValue={title => this.updateNewActivity({ title })}
                autoFocus
              />
            </FormGroup>
            <label>{t("Workshops")}</label>
            <table className={styles.workshopsTable}>
              <tbody>
                {this.state.newActivity.workshops_attributes.map(workshop => (
                  <tr key={workshop.number}>
                    <td>{workshop.number + ":"}</td>
                    <td style={{ width: "100%" }}>
                      <TextInput
                        placeholder={t("Name")}
                        value={workshop.name}
                        setValue={name =>
                          this.updateWorkshop({
                            number: workshop.number,
                            name
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <AddIcon onClick={this.addWorkshop} />
            <SmallSaveAndCancel
              handleSave={() =>
                this.props.addNewActivity(this.state.newActivity)
              }
              handleCancel={this.props.cancelForm}
            />
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
