import React from "react";
import PropTypes from "prop-types";
import update from "immutability-helper";
import Workshop from "./Workshop";
import NewWorkshopForm from "./NewWorkshopForm";
import DuluAxios from "../../util/DuluAxios";

export default class WorkshopActivity extends React.PureComponent {
  handleNewWorkshop = workshop => {
    this.props.replaceActivity(
      update(this.props.activity, { workshops: { $push: [workshop] } })
    );
  };

  findPlaceFor = (workshop, workshops) => {
    var i;
    for (i = 0; i < workshops.length; ++i) {
      if (workshop.date && !workshops[i].date) {
        return i;
      }
      if (
        !workshop.date &&
        !workshops[i].date &&
        workshop.id < workshops[i].id
      ) {
        return i;
      }
      if (
        workshop.date &&
        workshops[i].date &&
        workshop.date < workshops[i].date
      ) {
        return i;
      }
    }
    return workshops.length;
  };

  handleUpdatedWorkshop = workshop => {
    const oldIndex = this.props.activity.workshops.findIndex(
      ws => ws.id === workshop.id
    );
    let workshops = update(this.props.activity.workshops, {
      $splice: [[oldIndex, 1]]
    });
    const newIndex = this.findPlaceFor(workshop, workshops);
    workshops = update(workshops, {
      $splice: [[newIndex, 0, workshop]]
    });
    this.props.replaceActivity(
      update(this.props.activity, {
        workshops: {
          $set: workshops
        }
      })
    );
  };

  deleteWorkshop = async id => {
    try {
      await DuluAxios.delete(`/api/workshops/${id}`);
      const i = this.props.activity.workshops.findIndex(ws => ws.id === id);
      this.props.replaceActivity(
        update(this.props.activity, {
          workshops: { $splice: [[i, 1]] }
        })
      );
    } catch (error) {
      this.props.setNetworkError(error);
    }
  };

  render() {
    return (
      <div>
        <h3>{this.props.t("Workshops")}</h3>
        <table className="table">
          <tbody>
            {this.props.activity.workshops.map(workshop => {
              return (
                <Workshop
                  key={workshop.id}
                  workshop={workshop}
                  handleUpdatedWorkshop={this.handleUpdatedWorkshop}
                  deleteWorkshop={this.deleteWorkshop}
                  displayDelete={this.props.activity.workshops.length > 1}
                  setNetworkError={this.props.setNetworkError}
                  t={this.props.t}
                  language={this.props.language}
                />
              );
            })}
          </tbody>
        </table>
        {this.props.can.update && (
          <NewWorkshopForm
            handleNewWorkshop={this.handleNewWorkshop}
            activity_id={this.props.activity.id}
            t={this.props.t}
            setNetworkError={this.props.setNetworkError}
          />
        )}
      </div>
    );
  }
}

WorkshopActivity.propTypes = {
  activity: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  can: PropTypes.object.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  replaceActivity: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired
};
