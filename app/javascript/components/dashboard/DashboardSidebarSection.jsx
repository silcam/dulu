import React from "react";

import PlusMinusButton from "../shared/PlusMinusButton";

import DashboardSidebarCluster from "./DashboardSidebarCluster";
import DashboardSidebarProgram from "./DashboardSidebarProgram";
import style from "./Dashboard.css";

class DashboardSidebarSection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: props.section.startExpanded
    };
  }

  componentDidMount() {
    if (this.props.section.startSelected) {
      this.handleClick();
    }
  }

  onPlusMinusClick = () => {
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
    this.props.onSectionSelected(this.props.section);
  };

  render() {
    const showSections = this.state.isExpanded && this.props.section.sections;
    const showClusters = this.state.isExpanded && this.props.section.clusters;
    const showPrograms = this.state.isExpanded && this.props.section.languages;

    const indent = this.props.indent || 0;
    const indentString = new Array(indent).fill("\u00A0").join("");
    return (
      <React.Fragment>
        <li
          className={
            this.props.selection == this.props.section ? style.active : ""
          }
        >
          {indentString}
          <PlusMinusButton
            isExpanded={this.state.isExpanded}
            handleClick={this.onPlusMinusClick}
          />
          <button className="link" onClick={this.handleClick}>
            {this.props.section.name}
          </button>
        </li>
        {showSections &&
          this.props.section.sections.map(section => {
            return (
              <DashboardSidebarSection
                key={section.id}
                section={section}
                selection={this.props.selection}
                startExpanded={section.startExpanded}
                onSectionSelected={this.props.onSectionSelected}
                onClusterSelected={this.props.onClusterSelected}
                onProgramSelected={this.props.onProgramSelected}
                header="h4"
                indent={indent + 2}
              />
            );
          })}
        {showClusters &&
          this.props.section.clusters.map(cluster => {
            return (
              <DashboardSidebarCluster
                key={cluster.id}
                cluster={cluster}
                indent={indent + 2}
                selection={this.props.selection}
                onClusterSelected={this.props.onClusterSelected}
                onProgramSelected={this.props.onProgramSelected}
              />
            );
          })}
        {showPrograms &&
          this.props.section.languages.map(language => {
            return (
              <DashboardSidebarProgram
                key={language.id}
                language={language}
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

export default DashboardSidebarSection;
