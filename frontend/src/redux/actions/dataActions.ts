import axios from "axios";
import { AppDispatch } from "../store";

// Define Action Types
export enum DataActionTypes {
  FETCH_DATA_REQUEST = "FETCH_DATA_REQUEST",
  FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS",
  FETCH_DATA_FAILURE = "FETCH_DATA_FAILURE",
}

// Define Action Interfaces
interface FetchDataRequestAction {
  type: DataActionTypes.FETCH_DATA_REQUEST;
}

interface FetchDataSuccessAction {
  type: DataActionTypes.FETCH_DATA_SUCCESS;
  payload: any[]; // Update the type based on your API response
}

interface FetchDataFailureAction {
  type: DataActionTypes.FETCH_DATA_FAILURE;
  payload: string; // For error messages
}

export type DataActions =
  | FetchDataRequestAction
  | FetchDataSuccessAction
  | FetchDataFailureAction;

// Async Action Creator
export const fetchData = () => {
  return async (dispatch: AppDispatch) => {
    dispatch({ type: DataActionTypes.FETCH_DATA_REQUEST });

    try {
      const response = await axios.get("http://jsonplaceholder.typicode.com/users");
      dispatch({
        type: DataActionTypes.FETCH_DATA_SUCCESS,
        payload: response.data,
      });
    } catch (error: any) {
      dispatch({
        type: DataActionTypes.FETCH_DATA_FAILURE,
        payload: error.message,
      });
    }
  };
};
