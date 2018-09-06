import React from "react";
import axios from "axios";
import update from "immutability-helper";

import Workshop from "./Workshop";
import NewWorkshopForm from "./NewWorkshopForm";

/*
    Required props:
        number activity_id
        string authenticity_token
*/

class WorkshopActivity extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workshops: [],
      can: { create: false }
    };
  }

  componentDidMount() {
    axios
      .get(`/api/activities/${this.props.activity_id}/workshops/`)
      .then(response => {
        // console.log(response.data)
        this.setState({
          workshops: response.data.workshops,
          can: response.data.can
        });
      })
      .catch(error => console.error(error));
  }

  handleNewWorkshop = workshop => {
    this.setState((prevState, props) => {
      const workshops = update(prevState.workshops, {
        $push: [workshop]
      });
      return { workshops: workshops };
    });
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
    this.setState((prevState, props) => {
      const oldIndex = prevState.workshops.findIndex(
        ws => ws.id === workshop.id
      );
      var workshops = update(prevState.workshops, {
        $splice: [[oldIndex, 1]]
      });
      const newIndex = this.findPlaceFor(workshop, workshops);
      workshops = update(workshops, {
        $splice: [[newIndex, 0, workshop]]
      });
      return { workshops: workshops };
    });
  };

  deleteWorkshop = id => {
    axios({
      method: "delete",
      url: `/api/workshops/${id}`,
      data: {
        authenticity_token: this.props.authenticity_token
      }
    })
      .then(response => {
        this.setState((prevState, props) => {
          const i = prevState.workshops.findIndex(ws => ws.id === id);
          const workshops = update(prevState.workshops, {
            $splice: [[i, 1]]
          });
          return { workshops: workshops };
        });
      })
      .catch(error => console.error(error));
  };

  render() {
    return (
      <div>
        <h3>{this.props.t("Workshops")}</h3>
        <table className="table">
          <tbody>
            {this.state.workshops.map(workshop => {
              return (
                <Workshop
                  key={workshop.id}
                  workshop={workshop}
                  authenticity_token={this.props.authenticity_token}
                  handleUpdatedWorkshop={this.handleUpdatedWorkshop}
                  deleteWorkshop={this.deleteWorkshop}
                  displayDelete={this.state.workshops.length > 1}
                  t={this.props.t}
                />
              );
            })}
          </tbody>
        </table>
        {this.state.can.create && (
          <NewWorkshopForm
            handleNewWorkshop={this.handleNewWorkshop}
            authenticity_token={this.props.authenticity_token}
            activity_id={this.props.activity_id}
            t={this.props.t}
          />
        )}
      </div>
    );
  }
}

export default WorkshopActivity;
