import axios from "axios";
import { AppDispatch } from "../store";
import { GetMeActionTypes, LoginActionTypes, RegisterActionTypes, ResetAuthActionTypes, User } from "../types/authTypes";
import { getEnvironment } from "../../utils/getEnvironment";

export const registerAction = (user: User) => {
    return async (dispatch: AppDispatch) => {
        dispatch({ type: RegisterActionTypes.FETCH_REGISTER_REQUEST });
        try {
            const response = await axios.post(getEnvironment() + "/api/auth/register", {
                email : user.email,
                password: user.password,
                username: user.username
            });
            if (response.status == 200) {
                dispatch({
                    type: RegisterActionTypes.FETCH_REGISTER_SUCCESS,
                    payload: response.data,
                    status: response.status
                });
            } else {
                dispatch({
                    type: RegisterActionTypes.FETCH_REGISTER_FAILURE,
                    payload: response.data,
                    status: response.status
                });
            }
        } catch (error: any) {
            dispatch({
                type: RegisterActionTypes.FETCH_REGISTER_FAILURE,
                payload: error.response.data.message ?? error.message,
                status: error.status
            });
        }
    };
};

export const loginAction = (user: User) => {
    return async (dispatch: AppDispatch) => {
        dispatch({ type: LoginActionTypes.FETCH_LOGIN_REQUEST });
        try {
            const response = await axios.post(getEnvironment() + "/api/auth/login", {
                email : user.email,
                password: user.password
            });
            if (response.status == 200) {
                dispatch({
                    type: LoginActionTypes.FETCH_LOGIN_SUCCESS,
                    payload: response.data,
                    status: response.status
                });
            } else {
                dispatch({
                    type: LoginActionTypes.FETCH_LOGIN_FAILURE,
                    payload: response.data.message,
                    status: response.status
                });
            }
        } catch (error: any) {
            dispatch({
                type: LoginActionTypes.FETCH_LOGIN_FAILURE,
                payload: error.response.data.message ?? error.message,
                status: error.status
            });
        }
    };
};

export const getMeAction = () => {
    return async (dispatch: AppDispatch) => {
        const storedUser = localStorage.getItem("authorization");
        dispatch({ type: GetMeActionTypes.FETCH_GET_ME_REQUEST });
        try {
            const response = await axios.get(getEnvironment() + "/api/auth/me", {
                headers: {
                  Authorization: `${storedUser}`,
                  "Content-Type": "application/json",
                },
              });
            if (response.status == 200) {
                dispatch({
                    type: GetMeActionTypes.FETCH_GET_ME_SUCCESS,
                    payload: response.data,
                    status: response.status
                });
            } else {
                dispatch({
                    type: GetMeActionTypes.FETCH_GET_ME_FAILURE,
                    payload: response.data.message,
                    status: response.status
                });
            }
        } catch (error: any) {
            dispatch({
                type: GetMeActionTypes.FETCH_GET_ME_FAILURE,
                payload: error.response.data.message ?? error.message,
                status: error.status
            });
        }
    };
};

export const resetAuthAction = ()=>{
    return async (dispatch: AppDispatch) => {
        dispatch({
            type: ResetAuthActionTypes.RESET_AUTH_STATE
        });
    }
}