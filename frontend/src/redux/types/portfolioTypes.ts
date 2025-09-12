export interface technology {
    id: string;
    name: string;
    portfolioId: string;
    userId: string;
}
export interface Image {
    id: string;
    filename: string;
    portfolioId: string;
    userId: string;
}
export interface KeyFeature {
    id: string;
    description: string;
    portfolioId: string;
    userId: string;
}

export interface PortfolioData {
    id: string;
    title: string;
    description: string;
    type: string;
    github: string;
    previewLink: string;
    keyFeatures: KeyFeature[];
    technologies: technology[];
    images: Image[];
    userId: string;
}

export enum GetPortfolioActionTypes {
    FETCH_GET_PORTFOLIO_REQUEST = "FETCH_GET_PORTFOLIO_REQUEST",
    FETCH_GET_PORTFOLIO_SUCCESS = "FETCH_GET_PORTFOLIO_SUCCESS",
    FETCH_GET_PORTFOLIO_FAILURE = "FETCH_GET_PORTFOLIO_FAILURE",
}

interface FetchGetPortfolioRequestAction {
    type: GetPortfolioActionTypes.FETCH_GET_PORTFOLIO_REQUEST;
}

interface FetchGetPortfolioSuccessAction {
    type: GetPortfolioActionTypes.FETCH_GET_PORTFOLIO_SUCCESS;
    payload: PortfolioData[];
    status?: number;
}

interface FetchGetPortfolioFailureAction {
    type: GetPortfolioActionTypes.FETCH_GET_PORTFOLIO_FAILURE;
    payload: string;
    status?: number;
}

export type GetPortfolioActions =
    | FetchGetPortfolioRequestAction
    | FetchGetPortfolioSuccessAction
    | FetchGetPortfolioFailureAction;

export enum GetDetailPortfolioActionTypes {
    FETCH_GET_DETAIL_PORTFOLIO_REQUEST = "FETCH_GET_DETAIL_PORTFOLIO_REQUEST",
    FETCH_GET_DETAIL_PORTFOLIO_SUCCESS = "FETCH_GET_DETAIL_PORTFOLIO_SUCCESS",
    FETCH_GET_DETAIL_PORTFOLIO_FAILURE = "FETCH_GET_DETAIL_PORTFOLIO_FAILURE",
}

interface FetchGetDetailPortfolioRequestAction {
    type: GetDetailPortfolioActionTypes.FETCH_GET_DETAIL_PORTFOLIO_REQUEST;
}

interface FetchGetDetailPortfolioSuccessAction {
    type: GetDetailPortfolioActionTypes.FETCH_GET_DETAIL_PORTFOLIO_SUCCESS;
    payload: PortfolioData;
    status?: number;
}

interface FetchGetDetailPortfolioFailureAction {
    type: GetDetailPortfolioActionTypes.FETCH_GET_DETAIL_PORTFOLIO_FAILURE;
    payload: string;
    status?: number;
}

export type GetDetailPortfolioActions =
    | FetchGetDetailPortfolioRequestAction
    | FetchGetDetailPortfolioSuccessAction
    | FetchGetDetailPortfolioFailureAction;

export enum PutPortfolioActionTypes {
    FETCH_PUT_PORTFOLIO_REQUEST = "FETCH_PUT_PORTFOLIO_REQUEST",
    FETCH_PUT_PORTFOLIO_SUCCESS = "FETCH_PUT_PORTFOLIO_SUCCESS",
    FETCH_PUT_PORTFOLIO_FAILURE = "FETCH_PUT_PORTFOLIO_FAILURE",
}

interface FetchPutPortfolioRequestAction {
    type: PutPortfolioActionTypes.FETCH_PUT_PORTFOLIO_REQUEST;
}

interface FetchPutPortfolioSuccessAction {
    type: PutPortfolioActionTypes.FETCH_PUT_PORTFOLIO_SUCCESS;
    payload: PortfolioData[];
    status?: number;
}

interface FetchPutPortfolioFailureAction {
    type: PutPortfolioActionTypes.FETCH_PUT_PORTFOLIO_FAILURE;
    payload: string;
    status?: number;
}

export type PutPortfolioActions =
    | FetchPutPortfolioRequestAction
    | FetchPutPortfolioSuccessAction
    | FetchPutPortfolioFailureAction;

export enum DeletePortfolioActionTypes {
    FETCH_DELETE_PORTFOLIO_REQUEST = "FETCH_DELETE_PORTFOLIO_REQUEST",
    FETCH_DELETE_PORTFOLIO_SUCCESS = "FETCH_DELETE_PORTFOLIO_SUCCESS",
    FETCH_DELETE_PORTFOLIO_FAILURE = "FETCH_DELETE_PORTFOLIO_FAILURE",
}

interface FetchDeletePortfolioRequestAction {
    type: DeletePortfolioActionTypes.FETCH_DELETE_PORTFOLIO_REQUEST;
}

interface FetchDeletePortfolioSuccessAction {
    type: DeletePortfolioActionTypes.FETCH_DELETE_PORTFOLIO_SUCCESS;
    payload: string;
    status?: number;
}

interface FetchDeletePortfolioFailureAction {
    type: DeletePortfolioActionTypes.FETCH_DELETE_PORTFOLIO_FAILURE;
    payload: string;
    status?: number;
}

export type DeletePortfolioActions =
    | FetchDeletePortfolioRequestAction
    | FetchDeletePortfolioSuccessAction
    | FetchDeletePortfolioFailureAction;

export enum ResetPortfolioActionTypes {
    RESET_PORTFOLIO_STATE = "RESET_PORTFOLIO_STATE",
}
interface FetchResetPortfolioRequestAction {
    type: ResetPortfolioActionTypes.RESET_PORTFOLIO_STATE;
}

export type ResetPortfolioActions = FetchResetPortfolioRequestAction;
