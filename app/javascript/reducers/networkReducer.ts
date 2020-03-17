function freshState() {
  return {
    connectionError: false,
    serverError: false,
    loadingCount: 0
  };
}
type State = ReturnType<typeof freshState>;

export default function networkReducer(
  state = freshState(),
  action: NetworkAction
) {
  switch (action.type) {
    case "NETWORK_ADD_LOADING":
      return { ...state, loadingCount: state.loadingCount + 1 };
    case "NETWORK_SUBTRACT_LOADING":
      return { ...state, loadingCount: state.loadingCount - 1 };
    case "SET_NETWORK_ERROR_STATE":
      return { ...state, ...action.payload };
  }
  return state;
}

export function networkAddLoadingAction(): NetworkAction {
  return { type: "NETWORK_ADD_LOADING" };
}

export function networkSubtractLoadingAction(): NetworkAction {
  return { type: "NETWORK_SUBTRACT_LOADING" };
}

export function setNetworkErrorStateAction(
  payload: Partial<Pick<State, "connectionError" | "serverError">>
): NetworkAction {
  return { type: "SET_NETWORK_ERROR_STATE", payload };
}
type NetworkAction =
  | { type: "NETWORK_ADD_LOADING" }
  | { type: "NETWORK_SUBTRACT_LOADING" }
  | {
      type: "SET_NETWORK_ERROR_STATE";
      payload: { connectionError?: boolean; serverError?: boolean };
    }
  | { type: "OTHER" };
