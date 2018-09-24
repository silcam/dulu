import axios from "axios";
import React from "react";

import DashboardSidebar from "./DashboardSidebar";
import MainContent from "./MainContent";
import NotificationsSidebar from "./NotificationsSidebar";
import Searcher from "./Searcher";
import { arrayDelete } from "../../util/arrayUtils";
import styles from "./Dashboard.css";

class Dashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      programs: [],
      loading: 0,
      neededProgramIds: [],
      neededClusterIds: []
    };
  }

  cache = {
    clusters: {},
    programs: {}
  };

  cacheCluster = (id, programs) => {
    this.cache.clusters[id] = programs;
    for (let program of programs) {
      this.cache.programs[program.id] = program;
    }
  };

  addLoading = () => {
    this.setState(prevState => {
      return {
        loading: prevState.loading + 1
      };
    });
  };

  removeLoading = () => {
    this.setState(prevState => {
      return {
        loading: prevState.loading - 1
      };
    });
  };

  fetchProgram = id => {
    this.addLoading();
    axios
      .get(`/api/programs/${id}/dashboard/`)
      .then(response => {
        this.removeLoading();
        this.cache.programs[id] = response.data;
        this.setState(prevState => {
          if (prevState.neededProgramIds.includes(id)) {
            let neededProgramIds = arrayDelete(prevState.neededProgramIds, id);
            return {
              programs: prevState.programs.concat([response.data]),
              neededProgramIds: neededProgramIds
            };
          }
          return null;
        });
      })
      .catch(error => {
        console.error(error);
        this.removeLoading();
      });
  };

  fetchCluster = id => {
    this.addLoading();
    axios
      .get(`/api/clusters/${id}/dashboard/`)
      .then(response => {
        this.removeLoading();
        this.cacheCluster(id, response.data.programs);
        this.setState(prevState => {
          if (prevState.neededClusterIds.includes(id)) {
            let neededClusterIds = arrayDelete(prevState.neededClusterIds, id);
            return {
              programs: prevState.programs.concat(response.data.programs),
              neededClusterIds: neededClusterIds
            };
          }
          return null;
        });
      })
      .catch(error => {
        console.error(error);
        this.removeLoading();
      });
  };

  setSelectedCluster = id => {
    if (this.cache.clusters[id]) {
      this.setState({
        neededClusterIds: [],
        neededProgramIds: [],
        programs: this.cache.clusters[id]
      });
    } else {
      this.setState({
        programs: [],
        neededClusterIds: [id],
        neededProgramIds: []
      });
      this.fetchCluster(id);
    }
  };

  setSelectedProgram = id => {
    if (this.cache.programs[id]) {
      this.setState({
        neededClusterIds: [],
        neededProgramIds: [],
        programs: [this.cache.programs[id]]
      });
    } else {
      this.setState({
        neededClusterIds: [],
        neededProgramIds: [id],
        programs: []
      });
      this.fetchProgram(id);
    }
  };

  setSelectedMultiple = selection => {
    this.setState({
      neededClusterIds: [],
      neededProgramIds: [],
      programs: []
    });
    for (let clusterId of selection.clusterIds) {
      if (this.cache.clusters[clusterId]) {
        this.setState(prevState => {
          return {
            programs: prevState.programs.concat(this.cache.clusters[clusterId])
          };
        });
      } else {
        this.setState(prevState => {
          return {
            neededClusterIds: prevState.neededClusterIds.concat([clusterId])
          };
        });
        this.fetchCluster(clusterId);
      }
    }
    for (let programId of selection.programIds) {
      if (this.cache.programs[programId]) {
        this.setState(prevState => {
          return {
            programs: prevState.programs.concat(this.cache.programs[programId])
          };
        });
      } else {
        this.setState(prevState => {
          return {
            neededProgramIds: prevState.neededProgramIds.concat([programId])
          };
        });
        this.fetchProgram(programId);
      }
    }
  };

  render() {
    return (
      <div className="fullHeight">
        <div className={styles.leftSidebar}>
          <DashboardSidebar
            setSelectedProgram={this.setSelectedProgram}
            setSelectedCluster={this.setSelectedCluster}
            setSelectedMultiple={this.setSelectedMultiple}
          />
        </div>
        <div className={styles.main}>
          <Searcher t={this.props.t} queryPath="/api/search" />
          {this.state.loading > 0 && (
            <p className="alertBox alertYellow">{this.props.t("Loading")}</p>
          )}
          <MainContent
            programs={this.state.programs}
            t={this.props.t}
            viewPrefs={this.props.viewPrefs}
          />
        </div>
        <div className={styles.sidebar}>
          <NotificationsSidebar t={this.props.t} />
        </div>
      </div>
    );
  }
}

export default Dashboard;
