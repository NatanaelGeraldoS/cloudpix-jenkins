import axios from "axios";
import { AppDispatch } from "../store";
import {
    DeletePortfolioActionTypes,
    GetDetailPortfolioActionTypes,
    GetPortfolioActionTypes,
    PutPortfolioActionTypes,
    ResetPortfolioActionTypes,
} from "../types/portfolioTypes";
import { getEnvironment } from "../../utils/getEnvironment";

export const getPortfolioAction = () => {
    return async (dispatch: AppDispatch) => {
        const storedUser = localStorage.getItem("authorization");
        dispatch({ type: GetPortfolioActionTypes.FETCH_GET_PORTFOLIO_REQUEST });
        try {
            const response = await axios.get(getEnvironment() + "/api/portfolios", {
                headers: {
                    Authorization: `${storedUser}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status == 200) {
                dispatch({
                    type: GetPortfolioActionTypes.FETCH_GET_PORTFOLIO_SUCCESS,
                    payload: response.data,
                    status: response.status,
                });
            } else {
                dispatch({
                    type: GetPortfolioActionTypes.FETCH_GET_PORTFOLIO_FAILURE,
                    payload: response.data,
                    status: response.status,
                });
            }
        } catch (error: any) {
            dispatch({
                type: GetPortfolioActionTypes.FETCH_GET_PORTFOLIO_FAILURE,
                payload: error.response.data.message ?? error.message,
                status: error.status,
            });
        }
    };
};

export const getDetailPortfolioAction = (id: string) => {
    return async (dispatch: AppDispatch) => {
        const storedUser = localStorage.getItem("authorization");
        dispatch({ type: GetDetailPortfolioActionTypes.FETCH_GET_DETAIL_PORTFOLIO_REQUEST });
        try {
            const response = await axios.get(getEnvironment() + "/api/portfolios/get-detail-portfolio?id="+id, {
                headers: {
                    Authorization: `${storedUser}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status == 200) {
                dispatch({
                    type: GetDetailPortfolioActionTypes.FETCH_GET_DETAIL_PORTFOLIO_SUCCESS,
                    payload: response.data,
                    status: response.status,
                });
            } else {
                dispatch({
                    type: GetDetailPortfolioActionTypes.FETCH_GET_DETAIL_PORTFOLIO_FAILURE,
                    payload: response.data,
                    status: response.status,
                });
            }
        } catch (error: any) {
            dispatch({
                type: GetDetailPortfolioActionTypes.FETCH_GET_DETAIL_PORTFOLIO_FAILURE,
                payload: error.response.data.message ?? error.message,
                status: error.status,
            });
        }
    };
};

export const putPortfolioAction = (portfolioData: {
    id: string;
    title: string;
    description: string;
    type: string;
    github: string;
    previewLink: string;
    keyFeatures: string[];
    technologies: string[];
    files: File[];
}) => {
    return async (dispatch: AppDispatch) => {
        const storedUser = localStorage.getItem("authorization");

        dispatch({
            type: PutPortfolioActionTypes.FETCH_PUT_PORTFOLIO_REQUEST,
        });

        const formData = new FormData();
        formData.append("id", portfolioData.id);
        formData.append("title", portfolioData.title);
        formData.append("description", portfolioData.description);
        formData.append("type", portfolioData.type);
        formData.append("github", portfolioData.github);
        formData.append("previewLink", portfolioData.previewLink);
        formData.append(
            "technologies",
            JSON.stringify(portfolioData.technologies)
        );

        formData.append(
            "keyFeatures",
            JSON.stringify(portfolioData.keyFeatures)
        );

        portfolioData.files.forEach((file) => {
            formData.append("images", file);
        });

        try {
            const response = await axios.put(
                getEnvironment() + "/api/portfolios/put-portfolio",
                formData,
                {
                    headers: {
                        Authorization: `${storedUser}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                dispatch({
                    type: PutPortfolioActionTypes.FETCH_PUT_PORTFOLIO_SUCCESS,
                    payload: response.data,
                    status: response.status,
                });
            } else {
                dispatch({
                    type: PutPortfolioActionTypes.FETCH_PUT_PORTFOLIO_FAILURE,
                    payload: response.data,
                    status: response.status,
                });
            }
        } catch (error: any) {
            dispatch({
                type: PutPortfolioActionTypes.FETCH_PUT_PORTFOLIO_FAILURE,
                payload: error.response?.data?.message ?? error.message,
                status: error.response?.status,
            });
        }
    };
};

export const deletePortfolioAction = (id: string) => {
    return async (dispatch: AppDispatch) => {
        const storedUser = localStorage.getItem("authorization");
        dispatch({
            type: DeletePortfolioActionTypes.FETCH_DELETE_PORTFOLIO_REQUEST,
        });
        try {
            const response = await axios.delete(
                getEnvironment() + "/api/portfolios/delete-portfolio?id=" + id,
                {
                    headers: {
                        Authorization: `${storedUser}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status == 200) {
                dispatch({
                    type: DeletePortfolioActionTypes.FETCH_DELETE_PORTFOLIO_SUCCESS,
                    payload: response.data,
                    status: response.status,
                });
            } else {
                dispatch({
                    type: DeletePortfolioActionTypes.FETCH_DELETE_PORTFOLIO_FAILURE,
                    payload: response.data,
                    status: response.status,
                });
            }
        } catch (error: any) {
            dispatch({
                type: DeletePortfolioActionTypes.FETCH_DELETE_PORTFOLIO_FAILURE,
                payload: error.response.data.message ?? error.message,
                status: error.status,
            });
        }
    };
};

export const resetPortfolioAction = () => {
    return async (dispatch: AppDispatch) => {
        dispatch({
            type: ResetPortfolioActionTypes.RESET_PORTFOLIO_STATE,
        });
    };
};
