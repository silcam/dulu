import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ActivityContainer from "./ActivityContainer";

export default class LanguageActivityPage extends React.PureComponent {
  render() {
    return (
      <div>
        <h4>
          <Link to={this.props.basePath}>{`< ${
            this.props.language.name
          }`}</Link>
        </h4>
        <ActivityContainer {...this.props} />
      </div>
    );
  }
}

LanguageActivityPage.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired,
  activityId: PropTypes.string.isRequired,
  basePath: PropTypes.string.isRequired,
  setNetworkError: PropTypes.func.isRequired
};
