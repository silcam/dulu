import React from "react";
import { useLocation } from "react-router-dom";
import { LanguageBackLink } from "../shared/BreadCrumbs";
import NewEventForm from "../events/NewEventForm";
import { useNavigate } from "react-router-dom";
import { useLanguageContext } from "./LanguagePageRouter";
import { AnyObj } from "../../models/TypeBucket";

// Was a PureComponent with no state and two derived getters, which under React
// Router 6 would have needed a wrapper purely to feed it hooks. A function
// component needs neither.
export default function LanguageNewEventPage() {
  const { language } = useLanguageContext();
  const navigate = useNavigate();
  const location = useLocation();

  // DateCell links here with the event to prefill as router state; v6 types it
  // as unknown, hence the cast.
  const state = location.state as { event?: AnyObj } | null;
  const startEvent = state && state.event
    ? state.event
    : {
        languages: [{ id: language.id, name: language.name }]
      };

  return (
    <div>
      <LanguageBackLink language={language} />
      <NewEventForm cancelForm={() => navigate(-1)} startEvent={startEvent} />
    </div>
  );
}
