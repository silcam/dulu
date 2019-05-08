import React from "react";
import translator, { Locale } from "../i18n/i18n";

const I18nContext = React.createContext(translator(Locale.en));

export default I18nContext;
