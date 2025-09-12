
export interface User {
id?: string;
email: string;
username?: string;
password?: string;
authorization?: string;
}

export enum LoginActionTypes {
    FETCH_LOGIN_REQUEST = "FETCH_LOGIN_REQUEST",
    FETCH_LOGIN_SUCCESS = "FETCH_LOGIN_SUCCESS",
    FETCH_LOGIN_FAILURE = "FETCH_LOGIN_FAILURE",
}

interface FetchLoginRequestAction {
    type: LoginActionTypes.FETCH_LOGIN_REQUEST;
}

interface FetchLoginSuccessAction {
    type: LoginActionTypes.FETCH_LOGIN_SUCCESS;
    payload: any;
    status?: number;
}

interface FetchLoginFailureAction {
    type: LoginActionTypes.FETCH_LOGIN_FAILURE;
    payload: string;
    status?: number;
}

export type LoginActions =
    | FetchLoginRequestAction
    | FetchLoginSuccessAction
    | FetchLoginFailureAction

export enum RegisterActionTypes {
    FETCH_REGISTER_REQUEST = "FETCH_REGISTER_REQUEST",
    FETCH_REGISTER_SUCCESS = "FETCH_REGISTER_SUCCESS",
    FETCH_REGISTER_FAILURE = "FETCH_REGISTER_FAILURE",
}

interface FetchRegisterRequestAction {
    type: RegisterActionTypes.FETCH_REGISTER_REQUEST;
}

interface FetchRegisterSuccessAction {
    type: RegisterActionTypes.FETCH_REGISTER_SUCCESS;
    payload: User;
    status?: number;
}

interface FetchRegisterFailureAction {
    type: RegisterActionTypes.FETCH_REGISTER_FAILURE;
    payload: string;
    status?: number;
}

export type RegisterActions =
    | FetchRegisterRequestAction
    | FetchRegisterSuccessAction
    | FetchRegisterFailureAction


export enum GetMeActionTypes {
    FETCH_GET_ME_REQUEST = "FETCH_GET_ME_REQUEST",
    FETCH_GET_ME_SUCCESS = "FETCH_GET_ME_SUCCESS",
    FETCH_GET_ME_FAILURE = "FETCH_GET_ME_FAILURE",
}

interface FetchGetMeRequestAction {
    type: GetMeActionTypes.FETCH_GET_ME_REQUEST;
}

interface FetchGetMeSuccessAction {
    type: GetMeActionTypes.FETCH_GET_ME_SUCCESS;
    status?: number;
    payload: User
}

interface FetchGetMeFailureAction {
    type: GetMeActionTypes.FETCH_GET_ME_FAILURE;
    payload: string;
    status?: number;
}

export type GetMeActions =
    | FetchGetMeRequestAction
    | FetchGetMeSuccessAction
    | FetchGetMeFailureAction

export enum ResetAuthActionTypes{
    RESET_AUTH_STATE = "RESET_AUTH_STATE"
}

interface FetchResetRequestAction {
    type: ResetAuthActionTypes.RESET_AUTH_STATE;
}

export type ResetAuthActions = FetchResetRequestAction
