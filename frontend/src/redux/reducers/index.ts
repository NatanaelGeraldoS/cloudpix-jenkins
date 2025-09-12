import { combineReducers } from "redux";
import { dataReducer } from "./userReducer";
import { authReducer } from "./authReducer";
import { portfolioReducer } from "./portfolioReducer";
import { certificationReducer } from "./certificationReducer";
import { dashboardReducer } from "./dashboardReducer";

export const rootReducer = combineReducers({
  data: dataReducer,
  auth: authReducer,
  portfolio: portfolioReducer,
  certification: certificationReducer,
  dashboard: dashboardReducer
});