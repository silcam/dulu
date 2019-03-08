import React from "react";
import PropTypes from "prop-types";
import DuluAxios from "../../util/DuluAxios";
import { lastYear } from "../../util/Date";
import BasicEventsTable from "./BasicEventsTable";

export default class EventsTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    this.getEvents({ initialGet: true });
  }

  getEvents = async ({ initialGet = false }) => {
    this.setState({ loadingMore: true });
    const period =
      !initialGet && this.props.eventsBackTo
        ? {
            start_year: this.props.eventsBackTo - 3,
            end_year: this.props.eventsBackTo - 1
          }
        : { start_year: lastYear() };
    const data = await DuluAxios.get(this.props.eventsUrl, period);
    if (data) {
      this.props.addPeople(data.people);
      this.props.addClusters(data.clusters);
      this.props.addLanguages(data.languages);
      this.props.setCan("events", data.can);
      this.props.addEventsFor(data.events, {
        start: data.startYear ? { year: data.startYear } : undefined,
        end: period.end_year ? { year: period.end_year } : undefined
      });
    }
    this.setState({ loadingMore: false });
  };

  render() {
    return (
      <BasicEventsTable
        events={this.props.events}
        basePath={this.props.basePath}
        can={this.props.can}
        noAdd={this.props.noAdd}
        history={this.props.history}
        moreEventsState={
          this.state.loadingMore
            ? "loading"
            : this.props.eventsBackTo
            ? "button"
            : "none"
        }
        moreEvents={this.getEvents}
      />
    );
  }
}
EventsTable.propTypes = {
  events: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  basePath: PropTypes.string,
  history: PropTypes.object.isRequired,
  addPeople: PropTypes.func.isRequired,
  addClusters: PropTypes.func.isRequired,
  addLanguages: PropTypes.func.isRequired,
  setCan: PropTypes.func.isRequired,
  can: PropTypes.object.isRequired,
  eventsBackTo: PropTypes.number,
  // Comes from immediate parent:
  eventsUrl: PropTypes.string.isRequired,
  addEventsFor: PropTypes.func.isRequired, // (events, period) => void
  noAdd: PropTypes.bool
};
