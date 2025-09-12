import axios from "axios";
import { AppDispatch } from "../store";
import { getEnvironment } from "../../utils/getEnvironment";
import { GetDashboardWidgetsActionTypes, ResetDashboardActionTypes } from "../types/dashboardTypes";

export const getDashboardWidgetCounterAction = () => {
    return async (dispatch: AppDispatch) => {
        const storedUser = localStorage.getItem("authorization");
        dispatch({
            type: GetDashboardWidgetsActionTypes.FETCH_GET_DASHBOARD_WIDGETS_REQUEST,
        });
        try {
            const response = await axios.get(
                getEnvironment() + "/api/dashboard/get-widgets-counter",
                {
                    headers: {
                        Authorization: `${storedUser}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status == 200) {
                dispatch({
                    type: GetDashboardWidgetsActionTypes.FETCH_GET_DASHBOARD_WIDGETS_SUCCESS,
                    payload: response.data,
                    status: response.status,
                });
            } else {
                dispatch({
                    type: GetDashboardWidgetsActionTypes.FETCH_GET_DASHBOARD_WIDGETS_FAILURE,
                    payload: response.data,
                    status: response.status,
                });
            }
        } catch (error: any) {
            dispatch({
                type: GetDashboardWidgetsActionTypes.FETCH_GET_DASHBOARD_WIDGETS_FAILURE,
                payload: error.response.data.message ?? error.message,
                status: error.status,
            });
        }
    };
};

export const resetDashboardAction = () => {
    return async (dispatch: AppDispatch) => {
        dispatch({
            type: ResetDashboardActionTypes.RESET_DASHBOARD_STATE,
        });
    };
};
