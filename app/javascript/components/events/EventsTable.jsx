import React from "react";
import PropTypes from "prop-types";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import EventRow from "./EventRow";
import DuluAxios from "../../util/DuluAxios";
import { lastYear } from "../../util/Date";

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
    try {
      const data = await DuluAxios.get(this.props.eventsUrl, period);
      this.props.addPeople(data.people);
      this.props.addClusters(data.clusters);
      this.props.addLanguages(data.languages);
      this.props.setEventsCan(data.can);
      this.props.addEventsFor(data.events, {
        start: data.startYear ? { year: data.startYear } : undefined,
        end: period.end_year ? { year: period.end_year } : undefined
      });
    } catch (error) {
      this.props.setNetworkError(error);
    } finally {
      this.setState({ loadingMore: false });
    }
  };

  yearGroups = () => {
    return this.props.events.reduce((accum, event) => {
      const year = event.start_date.slice(0, 4);
      if (!accum[year]) accum[year] = [];
      accum[year].push(event);
      return accum;
    }, {});
  };

  render() {
    const t = this.props.t;
    const years = this.yearGroups();
    const basePath = this.props.basePath || "";

    return (
      <div>
        <h3>
          {t("Events")}
          {this.props.can.create && !this.props.noAdd && (
            <InlineAddIcon
              onClick={() => this.props.history.push(`${basePath}/events/new`)}
            />
          )}
        </h3>
        <table>
          <tbody>
            {Object.keys(years)
              .sort()
              .reverse()
              .map(year => (
                <React.Fragment key={year}>
                  <tr>
                    <th>{year}</th>
                    <td />
                  </tr>
                  {years[year].map(event => (
                    <EventRow
                      key={event.id}
                      event={event}
                      t={t}
                      basePath={basePath}
                    />
                  ))}
                </React.Fragment>
              ))}
            {!!this.props.eventsBackTo && (
              <tr>
                <td>
                  {this.state.loadingMore ? (
                    t("Loading")
                  ) : (
                    <button
                      className="link"
                      onClick={this.getEvents}
                      style={{ fontWeight: "bold" }}
                    >
                      {t("More_events")}
                    </button>
                  )}
                </td>
                <td />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
EventsTable.propTypes = {
  events: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  basePath: PropTypes.string,
  history: PropTypes.object.isRequired,
  addPeople: PropTypes.func.isRequired,
  addClusters: PropTypes.func.isRequired,
  addLanguages: PropTypes.func.isRequired,
  setEventsCan: PropTypes.func.isRequired,
  can: PropTypes.object.isRequired,
  eventsBackTo: PropTypes.number,
  // Comes from immediate parent:
  eventsUrl: PropTypes.string.isRequired,
  addEventsFor: PropTypes.func.isRequired, // (events, period) => void
  noAdd: PropTypes.bool
};
