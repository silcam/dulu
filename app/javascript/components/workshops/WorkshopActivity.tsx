import React from "react";
import Workshop from "./Workshop";
import NewWorkshopForm from "./NewWorkshopForm";
import Activity, { IActivity } from "../../models/Activity";
import VSpacer from "../shared/VSpacer";
import ActivityViewPeople from "../languages/ActivityViewPeople";
import { ILanguage } from "../../models/Language";
import { IWorkshop } from "../../models/Workshop";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  activity: IActivity;
  language: ILanguage;
  basePath: string;
}

interface IState {}

export default class WorkshopActivity extends React.PureComponent<
  IProps,
  IState
> {
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
                      displayDelete={this.props.activity.workshops.length > 1}
                      language={this.props.language}
                    />
                  );
                })}
              </tbody>
            </table>
            {can.update && (
              <NewWorkshopForm activity_id={this.props.activity.id} />
            )}
            <VSpacer height={40} />
            <ActivityViewPeople {...this.props} />
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
