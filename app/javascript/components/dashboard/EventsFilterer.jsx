import React from "react";
import PropTypes from "prop-types";
import SelectInput from "../shared/SelectInput";
import selectOptionsFromObject from "../../util/selectOptionsFromObject";

export default class EventsFilterer extends React.PureComponent {
  domainOptions = () => {
    return [{ display: this.props.t("All"), value: "All" }].concat(
      selectOptionsFromObject(this.props.t("domains"))
    );
  };

  setDomainFilter = e => {
    this.props.setDomainFilter(e.target.value);
  };

  render() {
    return (
      <div style={{ marginBottom: "4px" }}>
        <label>
          {this.props.t("Filter")}
          :&nbsp;
        </label>
        <SelectInput
          value={this.props.domainFilter}
          options={this.domainOptions()}
          handleChange={this.setDomainFilter}
          extraClasses={"input-sm extraSmall form-control-inline"}
        />
      </div>
    );
  }
}

EventsFilterer.propTypes = {
  t: PropTypes.func.isRequired,
  domainFilter: PropTypes.string.isRequired,
  setDomainFilter: PropTypes.func.isRequired
};
