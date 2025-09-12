
import { DashboardWidgetsData, GetDashboardWidgetsActions, GetDashboardWidgetsActionTypes, ResetDashboardActions, ResetDashboardActionTypes } from "../types/dashboardTypes";

interface DataState {
    getDashboardWidgetCounter: {
        item: DashboardWidgetsData;
        message: string | null;
        loading: boolean;
        error: string | null;
        status?: number;
    };
}

const initialState: DataState = {
    getDashboardWidgetCounter: {
        item: {
            certification_counter: 0,
            portfolio_counter: 0,
        } as DashboardWidgetsData,
        message: null,
        loading: false,
        error: null,
        status: undefined,
    },
};

export const dashboardReducer = (
    state = initialState,
    action: GetDashboardWidgetsActions | ResetDashboardActions
): DataState => {
    switch (action.type) {
        case GetDashboardWidgetsActionTypes.FETCH_GET_DASHBOARD_WIDGETS_REQUEST:
            return {
                ...state,
                getDashboardWidgetCounter: {
                    ...state.getDashboardWidgetCounter,
                    loading: true,
                    error: null,
                    status: undefined,
                },
            };
        case GetDashboardWidgetsActionTypes.FETCH_GET_DASHBOARD_WIDGETS_SUCCESS:
            return {
                ...state,
                getDashboardWidgetCounter: {
                    ...state.getDashboardWidgetCounter,
                    item: action.payload,
                    message: "Dashboard Widget Counter fetched successfully!",
                    loading: false,
                    error: null,
                    status: action.status,
                },
            };
        case GetDashboardWidgetsActionTypes.FETCH_GET_DASHBOARD_WIDGETS_FAILURE:
            return {
                ...state,
                getDashboardWidgetCounter: {
                    ...state.getDashboardWidgetCounter,
                    loading: false,
                    error: action.payload,
                    status: action.status,
                },
            };
        case ResetDashboardActionTypes.RESET_DASHBOARD_STATE:
            return initialState;

        default:
            return state;
    }
};
        