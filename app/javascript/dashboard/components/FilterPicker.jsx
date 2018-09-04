import React from "react";

import Checkbox from "../../shared_components/Checkbox";

class FilterPicker extends React.PureComponent {
  newFilterAll = value => {
    let newFilter = {};
    for (const option in this.props.filter) {
      newFilter[option] = value;
    }
    return newFilter;
  };

  clickAll = e => {
    this.props.updateFilter(this.newFilterAll(true));
    e.target.blur();
  };

  clickNone = e => {
    this.props.updateFilter(this.newFilterAll(false));
    e.target.blur();
  };

  handleChange = e => {
    let newFilter = {};
    for (const option in this.props.filter) {
      if (e.target.value == option) {
        newFilter[option] = e.target.checked;
      } else {
        newFilter[option] = this.props.filter[option];
      }
    }
    this.props.updateFilter(newFilter);
  };

  render() {
    const strings = this.props.strings;
    const filter = this.props.filter;
    return (
      <div>
        <small>
          <ul className="list-inline">
            <li>
              <label>{strings.Filter}:</label>
            </li>
            <li>
              <button onClick={this.clickAll} className="btn-link">
                {strings.All}
              </button>
            </li>
            <li>
              <button onClick={this.clickNone} className="btn-link">
                {strings.None}
              </button>
            </li>
          </ul>
          <ul className="list-inline">
            {Object.keys(filter).map(option => {
              return (
                <li key={option}>
                  <Checkbox
                    checked={filter[option]}
                    handleChange={this.handleChange}
                    label={option}
                    value={option}
                  />
                </li>
              );
            })}
          </ul>
        </small>
      </div>
    );
  }
}

export default FilterPicker;
