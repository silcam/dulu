import React from "react";

import Checkbox from "../shared/Checkbox";
import StyledButton from "../shared/StyledButton";

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
    const t = this.props.t;
    const filter = this.props.filter;
    return (
      <div>
        <small>
          <ul className="list-inline">
            <li>
              <label>{t("Filter")}:</label>
            </li>
            <li>
              <StyledButton onClick={this.clickAll} styleClass="link">
                {t("All")}
              </StyledButton>
            </li>
            <li>
              <StyledButton onClick={this.clickNone} styleClass="link">
                {t("None")}
              </StyledButton>
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
