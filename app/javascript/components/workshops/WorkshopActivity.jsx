import React from "react";
import PropTypes from "prop-types";
import update from "immutability-helper";
import Workshop from "./Workshop";
import NewWorkshopForm from "./NewWorkshopForm";
import DuluAxios from "../../util/DuluAxios";
import Activity from "../../models/Activity";

export default class WorkshopActivity extends React.PureComponent {
  handleNewWorkshop = workshop => {
    this.props.setActivity(
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
    this.props.setActivity(
      update(this.props.activity, {
        workshops: {
          $set: workshops
        }
      })
    );
  };

  deleteWorkshop = async id => {
    const success = await DuluAxios.delete(`/api/workshops/${id}`);
    if (success) {
      const i = this.props.activity.workshops.findIndex(ws => ws.id === id);
      this.props.setActivity(
        update(this.props.activity, {
          workshops: { $splice: [[i, 1]] }
        })
      );
    }
  };

  render() {
    const can = this.props.activity.can || {};
    return (
      <div>
        <h2>{Activity.name(this.props.activity, this.props.t)}</h2>
        <h3>{this.props.t("Workshops")}</h3>
        <table className="table">
          <tbody>
            {this.props.activity.workshops.map(workshop => {
              return (
                <Workshop
                  key={workshop.id}
                  workshop={workshop}
                  can={can}
                  handleUpdatedWorkshop={this.handleUpdatedWorkshop}
                  deleteWorkshop={this.deleteWorkshop}
                  displayDelete={this.props.activity.workshops.length > 1}
                  t={this.props.t}
                  language={this.props.language}
                />
              );
            })}
          </tbody>
        </table>
        {can.update && (
          <NewWorkshopForm
            handleNewWorkshop={this.handleNewWorkshop}
            activity_id={this.props.activity.id}
            t={this.props.t}
          />
        )}
      </div>
    );
  }
}

WorkshopActivity.propTypes = {
  activity: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,

  language: PropTypes.object.isRequired,
  setActivity: PropTypes.func.isRequired
};
