import React from "react";

import SelectInput from "../shared/SelectInput";

class EventsFilterer extends React.PureComponent {
  constructor(props) {
    super(props);
    let domainSelectOptions = [
      {
        display: props.t("All"),
        value: "All"
      }
    ];
    domainSelectOptions = domainSelectOptions.concat(
      Object.values(
        props.t("domains").map(domain => {
          return { display: domain };
        })
      )
    );
    this.state = {
      domainSelectOptions: domainSelectOptions
    };
  }

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
          options={this.state.domainSelectOptions}
          handleChange={this.setDomainFilter}
          extraClasses={"input-sm extraSmall form-control-inline"}
        />
      </div>
    );
  }
}

export default EventsFilterer;
