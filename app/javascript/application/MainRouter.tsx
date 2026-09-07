import React, { ErrorInfo } from "react";
import { Routes, Route, useLocation, Location } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import ReportsRouter from "../components/reports/ReportsRouter";
import ReportsLandingPage from "../components/reports/ReportsLandingPage";
import ReportViewer from "../components/reports/ReportViewer";
import SavedReportViewer from "../components/reports/SavedReportViewer";
import EventsPage, {
  EventsCalendarRoute,
  EventsIndexRedirect
} from "../components/events/EventsPage";
import EventPage from "../components/events/EventPage";
import CrashCauser from "../components/events/CrashCauser";
import ParticipantPage from "../components/participants/ParticipantPage";
import ActivityPage from "../components/activities/ActivityPage";
import ErrorMessage from "./ErrorMessage";
import axios from "axios";
import CoreData from "./CoreData";
import NotificationsPage from "../components/notifications/NotificationsPage";
import PeopleBoard from "../components/people/PeopleBoard";
import PersonPage from "../components/people/PersonPage";
import PersonEventPage from "../components/people/PersonEventPage";
import NewPersonForm from "../components/people/NewPersonForm";
import useAppSelector from "../reducers/useAppSelector";
import { User } from "../reducers/currentUserReducer";
import ClustersBoard from "../components/clusters/ClustersBoard";
import ClusterPageRouter from "../components/clusters/ClusterPageRouter";
import ClusterPage from "../components/clusters/ClusterPage";
import ClusterParticipantPage from "../components/clusters/ClusterParticipantPage";
import NewClusterForm from "../components/clusters/NewClusterForm";
import OrganizationsBoard from "../components/organizations/OrganizationsBoard";
import OrganizationPage from "../components/organizations/OrganizationPage";
import NewOrganizationForm from "../components/organizations/NewOrganizationForm";
import RegionsBoard from "../components/regions/RegionsBoard";
import RegionPage from "../components/regions/RegionPage";
import NewRegionForm from "../components/regions/NewRegionForm";
import LanguagesBoard from "../components/languages/LanguagesBoard";
import LanguagePageRouter from "../components/languages/LanguagePageRouter";
import { LanguagePageRoute } from "../components/languages/LanguagePage";
import LanguageParticipantPage from "../components/languages/LanguageParticipantPage";
import LanguageEventPage from "../components/languages/LanguageEventPage";
import LanguageNewEventPage from "../components/languages/LanguageNewEventPage";
import LanguageActivityPage from "../components/languages/LanguageActivityPage";
import DomainStatusItemPage from "../components/languages/DomainStatusItemPage";
import DomainStatusDataCollectionPage from "../components/languages/DomainStatusDataCollectionPage";

// The activity subclasses ApplicationHelper#model_path can name. Every activity
// link in a notification is built from it, so it arrives as the STI subclass
// path rather than a bare /activities/:id -- see notifications.spec.js. React
// Router 5 caught the lot with `path="/*activities/:id"`; v6 requires a splat to
// be the last segment, so the alternatives are enumerated instead. Keep this in
// step with Activity's subclasses (Rails: `Activity.descendants`).
const activityPaths = [
  "/translation_activities/:id",
  "/linguistic_activities/:id",
  "/media_activities/:id",
  "/activities/:id"
];

interface IProps {
  user: User;
  location: Location;
}

interface IState {
  hasError?: boolean;
}

export default function MainRouter() {
  const user = useAppSelector(state => state.currentUser);
  const location = useLocation();

  return <BaseMainRouter {...{ user, location }} />;
}

class BaseMainRouter extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const content = {
      error: error.toString(),
      stack: error.stack,
      componentStack: info.componentStack,
      user: this.props.user,
      // Was the history object under React Router 5, which serialised to very
      // little that was useful. v6 has no such object to hand over, and the
      // location is what the report actually wanted: where the crash happened.
      location: this.props.location
    };
    axios.post("/api/errors", { content: content });
  }

  componentDidUpdate(_prevProps: IProps, prevState: IState) {
    if (prevState.hasError) this.setState({ hasError: false });
  }

  render() {
    return this.state.hasError ? (
      <ErrorMessage />
    ) : (
      <React.Fragment>
        <Routes>
          <Route path="/languages" element={<LanguagesBoard />}>
            <Route path=":id" element={<LanguagePageRouter />}>
              <Route
                path="participants/:participantId"
                element={<LanguageParticipantPage />}
              />
              <Route path="events/new" element={<LanguageNewEventPage />} />
              <Route path="events/:eventId" element={<LanguageEventPage />} />
              <Route
                path="activities/:activityId"
                element={<LanguageActivityPage />}
              />
              <Route
                path="domain_status_items/lingdata/:collectionType"
                element={<DomainStatusDataCollectionPage />}
              />
              <Route
                path="domain_status_items/:domainStatusItemId"
                element={<DomainStatusItemPage />}
              />
              <Route path=":domain?" element={<LanguagePageRoute />} />
            </Route>
          </Route>

          <Route path="/regions" element={<RegionsBoard />}>
            <Route path="new" element={<NewRegionForm />} />
            <Route path=":id" element={<RegionPage />} />
          </Route>

          <Route path="/clusters" element={<ClustersBoard />}>
            <Route path="new" element={<NewClusterForm />} />
            <Route path=":id" element={<ClusterPageRouter />}>
              <Route
                path="participants/:participantId"
                element={<ClusterParticipantPage />}
              />
              <Route index element={<ClusterPage />} />
            </Route>
          </Route>

          <Route path="/people" element={<PeopleBoard />}>
            <Route path="new" element={<NewPersonForm />} />
            <Route
              path=":id/events/:eventId"
              element={<PersonEventPage />}
            />
            <Route path="show/:id" element={<PersonPage />} />
            <Route path=":id" element={<PersonPage />} />
          </Route>

          <Route path="/organizations" element={<OrganizationsBoard />}>
            <Route path="new" element={<NewOrganizationForm />} />
            <Route path="show/:id" element={<OrganizationPage />} />
            {/* Both spellings, because both are reachable. Links use
                /organizations/show/:id, but NewOrganizationForm navigates to
                /organizations/:id after saving -- which worked under v5 only
                because routeActionAndId() quietly rewrote a numeric first
                segment into action "show". */}
            <Route path=":id" element={<OrganizationPage />} />
          </Route>

          <Route path="/events" element={<EventsPage />}>
            <Route path="cal/:year/:month" element={<EventsCalendarRoute />} />
            <Route path="new" element={<span>To be added...</span>} />
            {/* For Testing purposes obviously! */}
            <Route path="crash-me-now" element={<CrashCauser />} />
            <Route path=":id" element={<EventPage />} />
            <Route index element={<EventsIndexRedirect />} />
            <Route path="*" element={<EventsIndexRedirect />} />
          </Route>

          <Route path="/reports" element={<ReportsRouter />}>
            <Route path="new/:type" element={<ReportViewer />} />
            <Route path=":id" element={<SavedReportViewer />} />
            <Route index element={<ReportsLandingPage />} />
          </Route>

          <Route path="/feed" element={<NotificationsPage />} />
          <Route path="/participants/:id" element={<ParticipantPage />} />
          {activityPaths.map(path => (
            <Route key={path} path={path} element={<ActivityPage />} />
          ))}
          <Route path="*" element={<Dashboard />} />
        </Routes>
        <CoreData />
      </React.Fragment>
    );
  }
}
