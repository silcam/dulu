import React from "react";
import update from "immutability-helper";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import CheckBoxInput from "../shared/CheckboxInput";
import { arrayDelete } from "../../util/arrayUtils";
import FuzzyDateInput from "../shared/FuzzyDateInput";
import { IParticipant } from "../../models/Participant";
import { IPerson } from "../../models/Person";
import { History } from "history";
import I18nContext from "../../contexts/I18nContext";
import P from "../shared/P";
import PersonPicker from "../people/PersonPicker";
import useLoad from "../shared/useLoad";

interface NewParticipant extends IParticipant {
  person_name: string;
  person_roles: string[];
}

interface IProps {
  cancel: () => void;
  language_id?: number;
  cluster_id?: number;

  history: History;
  basePath: string;
  saveLoad: ReturnType<typeof useLoad>[0];
}

export default function NewParticipantForm(props: Omit<IProps, "saveLoad">) {
  const [saveLoad] = useLoad();
  return <BaseNewParticipantForm {...props} saveLoad={saveLoad} />;
}
interface IState {
  participant: IParticipant;
  person: IPerson | null;
  saving?: boolean;
}

class BaseNewParticipantForm extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      participant: {
        language_id: props.language_id,
        cluster_id: props.cluster_id,
        start_date: "",
        roles: [],
        id: 0,
        person_id: 0,
        can: {}
      },
      person: null
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
    const data = await this.props.saveLoad(duluAxios =>
      duluAxios.post("/api/participants", {
        participant: this.state.participant
      })
    );
    if (data) {
      this.props.history.push(
        `${this.props.basePath}/participants/${data.participants[0].id}`
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
            <PersonPicker
              value={this.state.person}
              setValue={person => {
                this.setState({ person });
                this.updateParticipant({
                  person_id: person ? person.id : 0,
                  roles: person ? person.roles : []
                });
              }}
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
              {this.state.person &&
                this.state.person.roles.map(role => (
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
