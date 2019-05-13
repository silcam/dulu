import React from "react";
import update from "immutability-helper";
import Workshop from "./Workshop";
import NewWorkshopForm from "./NewWorkshopForm";
import DuluAxios from "../../util/DuluAxios";
import Activity, { IActivity } from "../../models/Activity";
import VSpacer from "../shared/VSpacer";
import ActivityViewPeople, {
  IProps as ActivityViewPeopleProps
} from "../languages/ActivityViewPeople";
import { ILanguage } from "../../models/Language";
import { Setter } from "../../models/TypeBucket";
import { IWorkshop } from "../../models/Workshop";
import I18nContext from "../../contexts/I18nContext";

interface IProps extends ActivityViewPeopleProps {
  activity: IActivity;
  language: ILanguage;
  setActivity: Setter<IActivity>;
}

interface IState {}

export default class WorkshopActivity extends React.PureComponent<
  IProps,
  IState
> {
  handleNewWorkshop = (workshop: IWorkshop) => {
    this.props.setActivity(
      update(this.props.activity, { workshops: { $push: [workshop] } })
    );
  };

  findPlaceFor = (workshop: IWorkshop, workshops: IWorkshop[]) => {
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
        workshop.date < workshops[i].date!
      ) {
        return i;
      }
    }
    return workshops.length;
  };

  handleUpdatedWorkshop = (workshop: IWorkshop) => {
    const oldIndex = this.props.activity.workshops.findIndex(
      ws => ws.id === workshop.id
    );
    let workshops = update(this.props.activity.workshops, {
      $splice: [[oldIndex, 1]]
    });
    const newIndex = this.findPlaceFor(workshop, workshops as IWorkshop[]);
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

  deleteWorkshop = async (id: number) => {
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
      <I18nContext.Consumer>
        {t => (
          <div>
            <h2>{Activity.name(this.props.activity, t)}</h2>
            <h3>{t("Workshops")}</h3>
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
              />
            )}
            <VSpacer height={40} />
            <ActivityViewPeople {...this.props} />
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
