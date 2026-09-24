import React from "react";
import { Outlet } from "react-router-dom";

// Its <Switch> moved into MainRouter's route tree. What remains is the layout
// slot the reports pages render into.
export default function ReportsRouter() {
  return <Outlet />;
}
