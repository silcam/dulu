import React from "react";

import PlusMinusButton from "../shared/PlusMinusButton";

import DashboardSidebarProgram from "./DashboardSidebarProgram";

class DashboardSidebarCluster extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: props.cluster.startExpanded
    };
  }

  componentDidMount() {
    if (this.props.cluster.startSelected) {
      this.handleClick();
    }
  }

  onPlusMinusClick = () => {
    console.log("onPlusMinusClick");
    this.setState((prevState, props) => {
      return {
        isExpanded: !prevState.isExpanded
      };
    });
  };

  handleClick = () => {
    this.setState({
      isExpanded: true
    });
    this.props.onClusterSelected(this.props.cluster);
  };

  render() {
    const cluster = this.props.cluster;
    const indent = this.props.indent || 0;
    const indentString = new Array(indent).fill("\u00A0").join("");
    return (
      <React.Fragment>
        <li className={this.props.selection == cluster ? "active" : ""}>
          {indentString}
          <PlusMinusButton
            isExpanded={this.state.isExpanded}
            handleClick={this.onPlusMinusClick}
          />
          <a href="#" onClick={this.handleClick}>
            {cluster.display_name}
          </a>
        </li>
        {this.state.isExpanded &&
          cluster.programs.map(program => {
            return (
              <DashboardSidebarProgram
                key={program.id}
                program={program}
                indent={indent + 2}
                selection={this.props.selection}
                onProgramSelected={this.props.onProgramSelected}
              />
            );
          })}
      </React.Fragment>
    );
  }
}

export default DashboardSidebarCluster;
