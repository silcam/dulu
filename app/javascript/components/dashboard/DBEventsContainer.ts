import { connect } from "react-redux";
import * as eventActionCreators from "../../actions/eventActions";
import { addPeople } from "../../actions/peopleActions";
import { addLanguages } from "../../actions/languageActions";
import { addClusters } from "../../actions/clusterActions";
import { setCan } from "../../actions/canActions";
import Event from "../../models/Event";
import { AppState } from "../../reducers/appReducer";
import { ILanguage } from "../../models/Language";
import { overlap } from "../../util/arrayUtils";
import { lastYear } from "../../util/Date";
import DBEventsTable from "./DBEventsTable";

interface IProps {
  languageIds: number[];
}

function aggrBackTo(state: AppState, languageIds: number[]) {
  if (languageIds.length == 0) return undefined;
  let backTo = -1;
  for (let i = 0; i < languageIds.length; ++i) {
    const langBackTo =
      state.events.backTo[Event.languageBackToId(languageIds[i])];
    if (langBackTo === undefined) return undefined;
    backTo = Math.max(backTo, langBackTo);
  }
  return backTo;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => {
  const languages = ownProps.languageIds.map(id =>
    state.languages.get(id)
  ) as ILanguage[];
  const resolvedBackTo = aggrBackTo(state, ownProps.languageIds);
  const minYear = resolvedBackTo !== undefined ? resolvedBackTo : lastYear();
  return {
    events: state.events.list
      .filter(
        event =>
          (overlap(event.language_ids, ownProps.languageIds) ||
            languages.some(
              lang =>
                !!lang.cluster_id && event.cluster_ids.includes(lang.cluster_id)
            )) &&
          event.end_date >= `${minYear}`
      )
      .reverse(),
    eventsBackTo: resolvedBackTo,
    can: state.can.events
  };
};

const mapDispatchToProps = {
  ...eventActionCreators,
  addPeople,
  addLanguages,
  addClusters,
  setCan
};

const LanguageEventsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DBEventsTable);

export default LanguageEventsContainer;
