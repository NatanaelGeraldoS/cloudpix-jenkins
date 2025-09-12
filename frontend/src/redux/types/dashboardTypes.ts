export interface DashboardWidgetsData {
    portfolio_counter: number;
    certification_counter: number;
}

export enum GetDashboardWidgetsActionTypes {
    FETCH_GET_DASHBOARD_WIDGETS_REQUEST = "FETCH_GET_DASHBOARD_WIDGETS_REQUEST",
    FETCH_GET_DASHBOARD_WIDGETS_SUCCESS = "FETCH_GET_DASHBOARD_WIDGETS_SUCCESS",
    FETCH_GET_DASHBOARD_WIDGETS_FAILURE = "FETCH_GET_DASHBOARD_WIDGETS_FAILURE",
}

interface FetchGetDashboardWidgetsRequestAction {
    type: GetDashboardWidgetsActionTypes.FETCH_GET_DASHBOARD_WIDGETS_REQUEST;
}

interface FetchGetDashboardWidgetsSuccessAction {
    type: GetDashboardWidgetsActionTypes.FETCH_GET_DASHBOARD_WIDGETS_SUCCESS;
    payload: DashboardWidgetsData;
    status?: number;
}

interface FetchGetDashboardWidgetsFailureAction {
    type: GetDashboardWidgetsActionTypes.FETCH_GET_DASHBOARD_WIDGETS_FAILURE;
    payload: string;
    status?: number;
}

export type GetDashboardWidgetsActions =
    | FetchGetDashboardWidgetsRequestAction
    | FetchGetDashboardWidgetsSuccessAction
    | FetchGetDashboardWidgetsFailureAction;

export enum ResetDashboardActionTypes {
    RESET_DASHBOARD_STATE = "RESET_DASHBOARD_STATE",
}

interface FetchResetDashboardRequestAction {
    type: ResetDashboardActionTypes.RESET_DASHBOARD_STATE;
}

export type ResetDashboardActions = FetchResetDashboardRequestAction;