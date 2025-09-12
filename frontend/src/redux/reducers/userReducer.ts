// reducers/dataReducer.ts
import { DataActionTypes, DataActions } from "../actions/dataActions";

interface DataState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  loading: false,
  items: [],
  error: null,
};

export const dataReducer = (
  state = initialState,
  action: DataActions
): DataState => {
  switch (action.type) {
    case DataActionTypes.FETCH_DATA_REQUEST:
      return { ...state, loading: true, error: null };
    case DataActionTypes.FETCH_DATA_SUCCESS:
      return { ...state, loading: false, items: action.payload, error: null };
    case DataActionTypes.FETCH_DATA_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
