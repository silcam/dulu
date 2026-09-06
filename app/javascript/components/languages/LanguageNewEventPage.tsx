import React from "react";
import { History, Location } from "history";
import { useHistory } from "react-router-dom";
import { ILanguage } from "../../models/Language";
import { LanguageBackLink } from "../shared/BreadCrumbs";
import NewEventForm from "../events/NewEventForm";

interface IOwnProps {
  location: Location;
  language: ILanguage;
  basePath: string;
}

interface IProps extends IOwnProps {
  history: History;
}

// Hooks cannot be called in a class, so the history arrives as a prop from this
// wrapper rather than from withRouter -- the shape MainRouter already uses.
export default function LanguageNewEventPage(props: IOwnProps) {
  const history = useHistory();

  return <BaseLanguageNewEventPage {...props} history={history} />;
}

class BaseLanguageNewEventPage extends React.PureComponent<
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
        <NewEventForm
          cancelForm={() => this.props.history.goBack()}
          startEvent={this.startEvent()}
        />
      </div>
    );
  }
}
