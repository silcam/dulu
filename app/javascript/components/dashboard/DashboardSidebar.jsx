import React from "react";
import PropTypes from "prop-types";
import DashboardSidebarSection from "./DashboardSidebarSection";
import DuluAxios from "../../util/DuluAxios";

export default class DashboardSidebar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menu: {}
    };
  }

  componentDidMount() {
    DuluAxios.get(`/api/languages/dashboard_list/`).then(data => {
      this.setState({
        menu: data
      });
    });
  }

  onProgramSelected = language => {
    this.props.setSelectedProgram(language.id);
    this.setState({
      selection: language
    });
    this.props.updateViewPrefs({ dashboardSelection: language.selectionTag });
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
    let languages = section.languages || [];
    let subSections = section.sections || [];
    for (let subSection of subSections) {
      let subSectionClustersAndPrograms = this.sectionClustersAndPrograms(
        subSection
      );
      clusters = clusters.concat(subSectionClustersAndPrograms.clusters);
      languages = languages.concat(subSectionClustersAndPrograms.languages);
    }
    return {
      clusters: clusters,
      languages: languages
    };
  };

  onSectionSelected = section => {
    let clustersAndPrograms = this.sectionClustersAndPrograms(section);
    const clusterIds = clustersAndPrograms.clusters.map(cluster => {
      return cluster.id;
    });
    const languageIds = clustersAndPrograms.languages.map(language => {
      return language.id;
    });
    this.props.setSelectedMultiple({
      clusterIds: clusterIds,
      languageIds: languageIds
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
      menu.user.clusters.length > 0 || menu.user.languages.length > 0;
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
