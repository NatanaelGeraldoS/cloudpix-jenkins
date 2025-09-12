import axios from "axios";
import { AppDispatch } from "../store";
import {
    DeleteCertificationActionTypes,
    GetDetailCertificationActionTypes,
    GetCertificationActionTypes,
    PutCertificationActionTypes,
    ResetCertificationActionTypes,
} from "../types/certificationTypes";
import { getEnvironment } from "../../utils/getEnvironment";

export const getCertificationAction = () => {
    return async (dispatch: AppDispatch) => {
        const storedUser = localStorage.getItem("authorization");
        dispatch({
            type: GetCertificationActionTypes.FETCH_GET_CERTIFICATION_REQUEST,
        });
        try {
            const response = await axios.get(
                getEnvironment() + "/api/certifications",
                {
                    headers: {
                        Authorization: `${storedUser}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status == 200) {
                dispatch({
                    type: GetCertificationActionTypes.FETCH_GET_CERTIFICATION_SUCCESS,
                    payload: response.data,
                    status: response.status,
                });
            } else {
                dispatch({
                    type: GetCertificationActionTypes.FETCH_GET_CERTIFICATION_FAILURE,
                    payload: response.data,
                    status: response.status,
                });
            }
        } catch (error: any) {
            dispatch({
                type: GetCertificationActionTypes.FETCH_GET_CERTIFICATION_FAILURE,
                payload: error.response.data.message ?? error.message,
                status: error.status,
            });
        }
    };
};

export const getDetailCertificationAction = (id: string) => {
    return async (dispatch: AppDispatch) => {
        const storedUser = localStorage.getItem("authorization");
        dispatch({
            type: GetDetailCertificationActionTypes.FETCH_GET_DETAIL_CERTIFICATION_REQUEST,
        });
        try {
            const response = await axios.get(
                getEnvironment() +
                    "/api/certifications/get-detail-certification?id=" +
                    id,
                {
                    headers: {
                        Authorization: `${storedUser}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status == 200) {
                dispatch({
                    type: GetDetailCertificationActionTypes.FETCH_GET_DETAIL_CERTIFICATION_SUCCESS,
                    payload: response.data,
                    status: response.status,
                });
            } else {
                dispatch({
                    type: GetDetailCertificationActionTypes.FETCH_GET_DETAIL_CERTIFICATION_FAILURE,
                    payload: response.data,
                    status: response.status,
                });
            }
        } catch (error: any) {
            dispatch({
                type: GetDetailCertificationActionTypes.FETCH_GET_DETAIL_CERTIFICATION_FAILURE,
                payload: error.response.data.message ?? error.message,
                status: error.status,
            });
        }
    };
};

export const putCertificationAction = (certificationData: {
    id: string;
    name: string;
    description: string;
    organization: string;
    dateAwarded: string;
    expiration: string;
    category: string;
    file: File;
}) => {
    return async (dispatch: AppDispatch) => {
        const storedUser = localStorage.getItem("authorization");

        dispatch({
            type: PutCertificationActionTypes.FETCH_PUT_CERTIFICATION_REQUEST,
        });

        const formData = new FormData();
        formData.append("id", certificationData.id);
        formData.append("name", certificationData.name);
        formData.append("description", certificationData.description);
        formData.append("organization", certificationData.organization);
        formData.append("dateAwarded", certificationData.dateAwarded);
        formData.append("expiration", certificationData.expiration);
        formData.append("category", certificationData.category);
        if (certificationData.file) {
            formData.append("image", certificationData.file);
        }

        try {
            const response = await axios.put(
                getEnvironment() + "/api/certifications/put-certification",
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
                    type: PutCertificationActionTypes.FETCH_PUT_CERTIFICATION_SUCCESS,
                    payload: response.data,
                    status: response.status,
                });
            } else {
                dispatch({
                    type: PutCertificationActionTypes.FETCH_PUT_CERTIFICATION_FAILURE,
                    payload: response.data,
                    status: response.status,
                });
            }
        } catch (error: any) {
            dispatch({
                type: PutCertificationActionTypes.FETCH_PUT_CERTIFICATION_FAILURE,
                payload: error.response?.data?.message ?? error.message,
                status: error.response?.status,
            });
        }
    };
};

export const deleteCertificationAction = (id: string) => {
    return async (dispatch: AppDispatch) => {
        const storedUser = localStorage.getItem("authorization");
        dispatch({
            type: DeleteCertificationActionTypes.FETCH_DELETE_CERTIFICATION_REQUEST,
        });
        try {
            const response = await axios.delete(
                getEnvironment() +
                    "/api/certifications/delete-certification?id=" +
                    id,
                {
                    headers: {
                        Authorization: `${storedUser}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status == 200) {
                dispatch({
                    type: DeleteCertificationActionTypes.FETCH_DELETE_CERTIFICATION_SUCCESS,
                    payload: response.data,
                    status: response.status,
                });
            } else {
                dispatch({
                    type: DeleteCertificationActionTypes.FETCH_DELETE_CERTIFICATION_FAILURE,
                    payload: response.data,
                    status: response.status,
                });
            }
        } catch (error: any) {
            dispatch({
                type: DeleteCertificationActionTypes.FETCH_DELETE_CERTIFICATION_FAILURE,
                payload: error.response.data.message ?? error.message,
                status: error.status,
            });
        }
    };
};

export const resetCertificationAction = () => {
    return async (dispatch: AppDispatch) => {
        dispatch({
            type: ResetCertificationActionTypes.RESET_CERTIFICATION_STATE,
        });
    };
};
