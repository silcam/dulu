import React from "react";
import SearchTextInput from "../shared/SearchTextInput";
import update from "immutability-helper";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import DuluAxios from "../../util/DuluAxios";
import CheckBoxInput from "../shared/CheckboxInput";
import { arrayDelete } from "../../util/arrayUtils";
import FuzzyDateInput from "../shared/FuzzyDateInput";
import { IParticipant } from "../../models/Participant";
import { Adder } from "../../models/TypeBucket";
import { IPerson } from "../../models/Person";
import { History } from "history";
import I18nContext from "../../contexts/I18nContext";
import P from "../shared/P";

interface NewParticipant extends IParticipant {
  person_name: string;
  person_roles: string[];
}

interface IProps {
  cancel: () => void;
  addParticipants: Adder<IParticipant>;
  addPeople: Adder<IPerson>;
  language_id?: number;
  cluster_id?: number;

  history: History;
  basePath: string;
}

interface IState {
  participant: NewParticipant;
  saving?: boolean;
}

export default class NewParticipantForm extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      participant: {
        language_id: props.language_id,
        cluster_id: props.cluster_id,
        start_date: "",
        person_name: "",
        person_roles: [],
        roles: [],
        id: 0,
        person_id: 0,
        can: {}
      }
    };
  }

  updateParticipant = (mergeParticipant: Partial<NewParticipant>) => {
    this.setState(prevState => ({
      participant: update(prevState.participant, { $merge: mergeParticipant })
    }));
  };

  addRole = (role: string) => {
    this.updateParticipant({
      roles: this.state.participant.roles.concat([role])
    });
  };

  dropRole = (role: string) => {
    this.updateParticipant({
      roles: arrayDelete(this.state.participant.roles, role)
    });
  };

  save = async () => {
    this.setState({ saving: true });
    const data = await DuluAxios.post("/api/participants", {
      participant: this.state.participant
    });
    if (data) {
      this.props.addPeople([data.person]);
      this.props.addParticipants([data.participant]);
      this.props.history.push(
        `${this.props.basePath}/participants/${data.participant.id}`
      );
    } else {
      this.setState({ saving: false });
    }
  };

  invalid = () =>
    !this.state.participant.start_date || this.state.participant.person_id < 1;

  render() {
    const participant = this.state.participant;

    return (
      <I18nContext.Consumer>
        {t => (
          <div>
            <SearchTextInput
              queryPath="/api/people/search"
              placeholder={t("Name")}
              updateValue={person =>
                this.updateParticipant({
                  person_id: person.id || 0,
                  person_name: person.name,
                  person_roles: person.roles,
                  roles: person.roles!.concat([])
                })
              }
              text={participant.person_name}
              autoFocus
            />
            <P>
              <label>{t("Start_date")}</label>
              <FuzzyDateInput
                date={participant.start_date}
                handleDateInput={date =>
                  this.updateParticipant({ start_date: date })
                }
                dateIsInvalid={() => this.updateParticipant({ start_date: "" })}
              />
            </P>
            <ul>
              {participant.person_roles.map(role => (
                <li key={role}>
                  <CheckBoxInput
                    value={participant.roles.includes(role)}
                    text={t(`roles.${role}`)}
                    setValue={checked =>
                      checked ? this.addRole(role) : this.dropRole(role)
                    }
                  />
                </li>
              ))}
            </ul>
            <SmallSaveAndCancel
              handleSave={this.save}
              handleCancel={this.props.cancel}
              saveDisabled={this.invalid()}
              saveInProgress={this.state.saving}
            />
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
