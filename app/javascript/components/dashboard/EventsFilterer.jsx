import React from "react";

import SelectInput from "../../shared_components/SelectInput";

class EventsFilterer extends React.PureComponent {
  constructor(props) {
    super(props);
    let domainSelectOptions = [
      {
        display: props.strings.All,
        value: "All"
      }
    ];
    domainSelectOptions = domainSelectOptions.concat(
      Object.values(props.strings.domains).map(domain => {
        return { display: domain };
      })
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
          {this.props.strings.Filter}
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
