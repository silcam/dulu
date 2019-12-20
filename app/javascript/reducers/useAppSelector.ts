import { AppState } from "./appReducer";
import { useSelector, TypedUseSelectorHook } from "react-redux";

type AppUseSelector = TypedUseSelectorHook<AppState>;

const useAppSelector: AppUseSelector = useSelector;

export default useAppSelector;
