import React from "react";
import { Outlet, useOutletContext, useParams } from "react-router-dom";
import { ILanguage } from "../../models/Language";
import Loading from "../shared/Loading";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

export interface LanguageContext {
  id: number;
  basePath: string;
  language: ILanguage;
}

export const useLanguageContext = () => useOutletContext<LanguageContext>();

// A layout route rather than a <Switch>: it loads the language and hands it to
// whichever child route matched. Its children are declared in MainRouter.
export default function LanguagePageRouter() {
  const id = parseInt(useParams().id!);
  const language = useAppSelector(state => state.languages.get(id));

  useLoadOnMount(`/api/languages/${id}`);

  if (language.id == 0) return <Loading />;

  const context: LanguageContext = {
    id,
    basePath: `/languages/${id}`,
    language
  };

  return <Outlet context={context} />;
}
