import React from "react";
import LanguagePage from "../languages/LanguagePage";
import Loading from "../shared/Loading";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  id: number;
}

// The dashboard shows a selected language inline, with no URL of its own. Under
// React Router 5 it rendered LanguagePageRouter with basePath="", which made
// every one of that router's paths unmatchable, so the fallback -- LanguagePage
// -- was the only thing it could ever show. This renders that directly, and is
// the reason dashboard.spec.js can click through the sidebar with no URL
// changing. LanguagePageRouter is now a layout route and needs a route match,
// so it cannot be reused here.
export default function DashboardLanguagePage(props: IProps) {
  const language = useAppSelector(state => state.languages.get(props.id));

  useLoadOnMount(`/api/languages/${props.id}`);

  if (language.id == 0) return <Loading />;

  return <LanguagePage language={language} basePath="" />;
}
