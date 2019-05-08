import React from "react";

const DispatchContext = React.createContext(
  (_action: { type: string; [key: string]: any }) => {}
);

export default DispatchContext;
