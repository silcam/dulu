import translator from "./i18n";
import useAppSelector from "../reducers/useAppSelector";

export default function useTranslation() {
  const locale = useAppSelector(state => state.currentUser.ui_language);
  return translator(locale);
}
