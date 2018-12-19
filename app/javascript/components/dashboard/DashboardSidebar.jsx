import axios from "axios";
import React from "react";
import PropTypes from "prop-types";
import DashboardSidebarSection from "./DashboardSidebarSection";

export default class DashboardSidebar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menu: {}
    };
  }

  componentDidMount() {
    axios.get(`/api/programs/dashboard_list/`).then(response => {
      this.setState({
        menu: response.data
      });
    });
  }

  onProgramSelected = program => {
    this.props.setSelectedProgram(program.id);
    this.setState({
      selection: program
    });
    this.props.updateViewPrefs({ dashboardSelection: program.selectionTag });
  };

  onClusterSelected = cluster => {
    this.props.setSelectedCluster(cluster.id);
    this.setState({
      selection: cluster
    });
    this.props.updateViewPrefs({ dashboardSelection: cluster.selectionTag });
  };

  sectionClustersAndPrograms = section => {
    let clusters = section.clusters || [];
    let programs = section.programs || [];
    let subSections = section.sections || [];
    for (let subSection of subSections) {
      let subSectionClustersAndPrograms = this.sectionClustersAndPrograms(
        subSection
      );
      clusters = clusters.concat(subSectionClustersAndPrograms.clusters);
      programs = programs.concat(subSectionClustersAndPrograms.programs);
    }
    return {
      clusters: clusters,
      programs: programs
    };
  };

  onSectionSelected = section => {
    let clustersAndPrograms = this.sectionClustersAndPrograms(section);
    const clusterIds = clustersAndPrograms.clusters.map(cluster => {
      return cluster.id;
    });
    const programIds = clustersAndPrograms.programs.map(program => {
      return program.id;
    });
    this.props.setSelectedMultiple({
      clusterIds: clusterIds,
      programIds: programIds
    });
    this.setState({
      selection: section
    });
    this.props.updateViewPrefs({ dashboardSelection: section.selectionTag });
  };

  render() {
    const menu = this.state.menu;
    if (!menu.user) return <div />;
    const userHasParticipants =
      menu.user.clusters.length > 0 || menu.user.programs.length > 0;
    return (
      <ul className="list-unstyled">
        {menu.countries.map(country => {
          return (
            <DashboardSidebarSection
              key={country.id}
              section={country}
              selection={this.state.selection}
              onSectionSelected={this.onSectionSelected}
              onProgramSelected={this.onProgramSelected}
              onClusterSelected={this.onClusterSelected}
              header="h3"
            />
          );
        })}
        {userHasParticipants && (
          <DashboardSidebarSection
            section={menu.user}
            selection={this.state.selection}
            onSectionSelected={this.onSectionSelected}
            onProgramSelected={this.onProgramSelected}
            onClusterSelected={this.onClusterSelected}
            header="h4"
          />
        )}
      </ul>
    );
  }
}

DashboardSidebar.propTypes = {
  // t: PropTypes.func.isRequired,
  setSelectedProgram: PropTypes.func.isRequired,
  setSelectedCluster: PropTypes.func.isRequired,
  setSelectedMultiple: PropTypes.func.isRequired,
  updateViewPrefs: PropTypes.func.isRequired
};
