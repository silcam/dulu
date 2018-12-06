import React from "react";
import PropTypes from "prop-types";

export default class ReportsViewer extends React.PureComponent {
  render() {
    return <p>This is where the reports go</p>;
  }
}

ReportsViewer.propTypes = {
  t: PropTypes.func.isRequired
};
