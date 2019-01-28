import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

class TextFilter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      locationPath: props.location.pathname
    };
  }

  componentDidUpdate() {
    if (this.props.location.pathname != this.state.locationPath) {
      this.setState({
        locationPath: this.props.location.pathname,
        filter: ""
      });
      this.props.updateFilter("");
    }
  }

  updateFilter = filter => {
    this.setState({ filter: filter });
    this.props.updateFilter(filter);
  };

  handleKeyDown = e => {
    switch (e.key) {
      case "Enter":
      case "Tab":
        this.props.handleEnter();
    }
  };

  render() {
    return (
      <input
        type="text"
        value={this.state.filter}
        placeholder={this.props.placeholder}
        onChange={e => this.updateFilter(e.target.value)}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}

TextFilter.propTypes = {
  location: PropTypes.object,
  updateFilter: PropTypes.func.isRequired,
  handleEnter: PropTypes.func,
  placeholder: PropTypes.string
};

export default withRouter(TextFilter);
