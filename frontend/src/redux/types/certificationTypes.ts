export interface CertificationData {
    id: string;
    name: string;
    description: string;
    organization: string;
    dateAwarded: string;
    expiration: string;
    category: string;
    imageLink: string;
    userId: string;
}

export enum GetCertificationActionTypes {
    FETCH_GET_CERTIFICATION_REQUEST = "FETCH_GET_CERTIFICATION_REQUEST",
    FETCH_GET_CERTIFICATION_SUCCESS = "FETCH_GET_CERTIFICATION_SUCCESS",
    FETCH_GET_CERTIFICATION_FAILURE = "FETCH_GET_CERTIFICATION_FAILURE",
}

interface FetchGetCertificationRequestAction {
    type: GetCertificationActionTypes.FETCH_GET_CERTIFICATION_REQUEST;
}

interface FetchGetCertificationSuccessAction {
    type: GetCertificationActionTypes.FETCH_GET_CERTIFICATION_SUCCESS;
    payload: CertificationData[];
    status?: number;
}

interface FetchGetCertificationFailureAction {
    type: GetCertificationActionTypes.FETCH_GET_CERTIFICATION_FAILURE;
    payload: string;
    status?: number;
}

export type GetCertificationActions =
    | FetchGetCertificationRequestAction
    | FetchGetCertificationSuccessAction
    | FetchGetCertificationFailureAction;

export enum GetDetailCertificationActionTypes {
    FETCH_GET_DETAIL_CERTIFICATION_REQUEST = "FETCH_GET_DETAIL_CERTIFICATION_REQUEST",
    FETCH_GET_DETAIL_CERTIFICATION_SUCCESS = "FETCH_GET_DETAIL_CERTIFICATION_SUCCESS",
    FETCH_GET_DETAIL_CERTIFICATION_FAILURE = "FETCH_GET_DETAIL_CERTIFICATION_FAILURE",
}

interface FetchGetDetailCertificationRequestAction {
    type: GetDetailCertificationActionTypes.FETCH_GET_DETAIL_CERTIFICATION_REQUEST;
}

interface FetchGetDetailCertificationSuccessAction {
    type: GetDetailCertificationActionTypes.FETCH_GET_DETAIL_CERTIFICATION_SUCCESS;
    payload: CertificationData;
    status?: number;
}

interface FetchGetDetailCertificationFailureAction {
    type: GetDetailCertificationActionTypes.FETCH_GET_DETAIL_CERTIFICATION_FAILURE;
    payload: string;
    status?: number;
}

export type GetDetailCertificationActions =
    | FetchGetDetailCertificationRequestAction
    | FetchGetDetailCertificationSuccessAction
    | FetchGetDetailCertificationFailureAction;

export enum PutCertificationActionTypes {
    FETCH_PUT_CERTIFICATION_REQUEST = "FETCH_PUT_CERTIFICATION_REQUEST",
    FETCH_PUT_CERTIFICATION_SUCCESS = "FETCH_PUT_CERTIFICATION_SUCCESS",
    FETCH_PUT_CERTIFICATION_FAILURE = "FETCH_PUT_CERTIFICATION_FAILURE",
}

interface FetchPutCertificationRequestAction {
    type: PutCertificationActionTypes.FETCH_PUT_CERTIFICATION_REQUEST;
}

interface FetchPutCertificationSuccessAction {
    type: PutCertificationActionTypes.FETCH_PUT_CERTIFICATION_SUCCESS;
    payload: CertificationData[];
    status?: number;
}

interface FetchPutCertificationFailureAction {
    type: PutCertificationActionTypes.FETCH_PUT_CERTIFICATION_FAILURE;
    payload: string;
    status?: number;
}

export type PutCertificationActions =
    | FetchPutCertificationRequestAction
    | FetchPutCertificationSuccessAction
    | FetchPutCertificationFailureAction;

export enum DeleteCertificationActionTypes {
    FETCH_DELETE_CERTIFICATION_REQUEST = "FETCH_DELETE_CERTIFICATION_REQUEST",
    FETCH_DELETE_CERTIFICATION_SUCCESS = "FETCH_DELETE_CERTIFICATION_SUCCESS",
    FETCH_DELETE_CERTIFICATION_FAILURE = "FETCH_DELETE_CERTIFICATION_FAILURE",
}

interface FetchDeleteCertificationRequestAction {
    type: DeleteCertificationActionTypes.FETCH_DELETE_CERTIFICATION_REQUEST;
}

interface FetchDeleteCertificationSuccessAction {
    type: DeleteCertificationActionTypes.FETCH_DELETE_CERTIFICATION_SUCCESS;
    payload: string;
    status?: number;
}

interface FetchDeleteCertificationFailureAction {
    type: DeleteCertificationActionTypes.FETCH_DELETE_CERTIFICATION_FAILURE;
    payload: string;
    status?: number;
}

export type DeleteCertificationActions =
    | FetchDeleteCertificationRequestAction
    | FetchDeleteCertificationSuccessAction
    | FetchDeleteCertificationFailureAction;

export enum ResetCertificationActionTypes {
    RESET_CERTIFICATION_STATE = "RESET_CERTIFICATION_STATE",
}
interface FetchResetCertificationRequestAction {
    type: ResetCertificationActionTypes.RESET_CERTIFICATION_STATE;
}

export type ResetCertificationActions = FetchResetCertificationRequestAction;
