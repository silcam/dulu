import React from "react";
import PropTypes from "prop-types";
import DashboardSidebar from "./DashboardSidebar";
import MainContent from "./MainContent";
import NotificationsSidebar from "./NotificationsSidebar";
import Searcher from "./Searcher";
import { arrayDelete } from "../../util/arrayUtils";
import styles from "./Dashboard.css";
import Loading from "../shared/Loading";
import DuluAxios from "../../util/DuluAxios";

export default class Dashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      languages: [],
      loading: 0,
      neededProgramIds: [],
      neededClusterIds: []
    };
  }

  cache = {
    clusters: {},
    languages: {}
  };

  cacheCluster = (id, languages) => {
    this.cache.clusters[id] = languages;
    for (let language of languages) {
      this.cache.languages[language.id] = language;
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
    DuluAxios.get(`/api/languages/${id}/dashboard/`)
      .then(data => {
        this.removeLoading();
        this.cache.languages[id] = data;
        this.setState(prevState => {
          if (prevState.neededProgramIds.includes(id)) {
            let neededProgramIds = arrayDelete(prevState.neededProgramIds, id);
            return {
              languages: prevState.languages.concat([data]),
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
    DuluAxios.get(`/api/clusters/${id}/dashboard/`)
      .then(data => {
        this.removeLoading();
        this.cacheCluster(id, data.languages);
        this.setState(prevState => {
          if (prevState.neededClusterIds.includes(id)) {
            let neededClusterIds = arrayDelete(prevState.neededClusterIds, id);
            return {
              languages: prevState.languages.concat(data.languages),
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
        languages: this.cache.clusters[id]
      });
    } else {
      this.setState({
        languages: [],
        neededClusterIds: [id],
        neededProgramIds: []
      });
      this.fetchCluster(id);
    }
  };

  setSelectedProgram = id => {
    if (this.cache.languages[id]) {
      this.setState({
        neededClusterIds: [],
        neededProgramIds: [],
        languages: [this.cache.languages[id]]
      });
    } else {
      this.setState({
        neededClusterIds: [],
        neededProgramIds: [id],
        languages: []
      });
      this.fetchProgram(id);
    }
  };

  setSelectedMultiple = selection => {
    this.setState({
      neededClusterIds: [],
      neededProgramIds: [],
      languages: []
    });
    for (let clusterId of selection.clusterIds) {
      if (this.cache.clusters[clusterId]) {
        this.setState(prevState => {
          return {
            languages: prevState.languages.concat(
              this.cache.clusters[clusterId]
            )
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
    for (let languageId of selection.languageIds) {
      if (this.cache.languages[languageId]) {
        this.setState(prevState => {
          return {
            languages: prevState.languages.concat(
              this.cache.languages[languageId]
            )
          };
        });
      } else {
        this.setState(prevState => {
          return {
            neededProgramIds: prevState.neededProgramIds.concat([languageId])
          };
        });
        this.fetchProgram(languageId);
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
            updateViewPrefs={this.props.updateViewPrefs}
          />
        </div>
        <div className={styles.main}>
          <Searcher t={this.props.t} queryPath="/api/search" />
          {this.state.loading > 0 && <Loading t={this.props.t} />}
          <MainContent
            languages={this.state.languages}
            t={this.props.t}
            viewPrefs={this.props.viewPrefs}
            updateViewPrefs={this.props.updateViewPrefs}
          />
        </div>
        <div className={styles.sidebar}>
          <NotificationsSidebar t={this.props.t} />
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  t: PropTypes.func.isRequired,
  viewPrefs: PropTypes.object.isRequired,
  updateViewPrefs: PropTypes.func.isRequired
};
