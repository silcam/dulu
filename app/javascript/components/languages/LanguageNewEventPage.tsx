import React from "react";
import NewEventFormContainer from "../events/NewEventFormContainer";
import { Location, History } from "history";
import { ILanguage } from "../../models/Language";
import { LanguageBackLink } from "../shared/BreadCrumbs";

interface IProps {
  location: Location;
  history: History;
  language: ILanguage;
  basePath: string;
}

export default class LanguageNewEventPage extends React.PureComponent<
  IProps,
  {}
> {
  startEventInProps = () =>
    this.props.location.state && this.props.location.state.event;

  startEvent = () =>
    this.startEventInProps()
      ? this.props.location.state.event
      : {
          languages: [
            { id: this.props.language.id, name: this.props.language.name }
          ]
        };

  render() {
    return (
      <div>
        <LanguageBackLink language={this.props.language} />
        <NewEventFormContainer
          cancelForm={() => this.props.history.goBack()}
          startEvent={this.startEvent()}
        />
      </div>
    );
  }
}
