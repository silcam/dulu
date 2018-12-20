import React from "react";
import PropTypes from "prop-types";
import Activity from "../../models/Activity";
import { Link } from "react-router-dom";

export default class LanguageActivityPage extends React.PureComponent {
  activity = () =>
    Activity.findActivity(this.props.language, this.props.activityId);

  render() {
    const t = this.props.t;
    const language = this.props.language;
    const activity = this.activity();

    return (
      <div>
        <h4>
          <Link to={this.props.basePath}>{`< ${language.name}`}</Link>
        </h4>
        <h2>{Activity.name(activity, t)}</h2>
      </div>
    );
  }
}

LanguageActivityPage.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired,
  activityId: PropTypes.string.isRequired,
  basePath: PropTypes.string.isRequired
};
