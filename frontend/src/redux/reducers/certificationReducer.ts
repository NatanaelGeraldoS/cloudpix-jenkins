import {
    DeleteCertificationActions,
    DeleteCertificationActionTypes,
    PutCertificationActions,
    PutCertificationActionTypes,
    GetCertificationActions,
    GetCertificationActionTypes,
    CertificationData,
    ResetCertificationActions,
    ResetCertificationActionTypes,
    GetDetailCertificationActionTypes,
    GetDetailCertificationActions,
} from "../types/certificationTypes";

interface DataState {
    getCertification: {
        items: CertificationData[];
        message: string | null;
        loading: boolean;
        error: string | null;
        status?: number;
    };
    getDetailCertification: {
        item: CertificationData;
        message: string | null;
        loading: boolean;
        error: string | null;
        status?: number;
    };
    putCertification: {
      message: string | null;
      loading: boolean;
      error: string | null;
      status?: number;
  };
    deleteCertification: {
        message: string | null;
        loading: boolean;
        error: string | null;
        status?: number;
    };
}

const initialState: DataState = {
    getCertification: {
        items: [],
        message: null,
        loading: false,
        error: null,
        status: undefined,
    },
    getDetailCertification: {
        item: {
            id:"",
            name: "",
            description: "",
            organization: "",
            dateAwarded: "",
            expiration: "",
            category: "",
            imageLink: "",
            userId:""
        } as CertificationData,
        message: null,
        loading: false,
        error: null,
        status: undefined,
    },
    putCertification: {
      message: null,
      loading: false,
      error: null,
      status: undefined,
  },
    deleteCertification: {
        message: null,
        loading: false,
        error: null,
        status: undefined,
    },
};

export const certificationReducer = (
    state = initialState,
    action: GetCertificationActions | GetDetailCertificationActions | PutCertificationActions | DeleteCertificationActions | ResetCertificationActions
): DataState => {
    switch (action.type) {
        case GetCertificationActionTypes.FETCH_GET_CERTIFICATION_REQUEST:
            return {
                ...state,
                getCertification: {
                    ...state.getCertification,
                    loading: true,
                    error: null,
                    status: undefined,
                },
            };
        case GetCertificationActionTypes.FETCH_GET_CERTIFICATION_SUCCESS:
            return {
                ...state,
                getCertification: {
                    ...state.getCertification,
                    items: action.payload,
                    message: "Certification fetched successfully!",
                    loading: false,
                    error: null,
                    status: action.status,
                },
            };
        case GetCertificationActionTypes.FETCH_GET_CERTIFICATION_FAILURE:
            return {
                ...state,
                getCertification: {
                    ...state.getCertification,
                    loading: false,
                    error: action.payload,
                    status: action.status,
                },
            };
        case GetDetailCertificationActionTypes.FETCH_GET_DETAIL_CERTIFICATION_REQUEST:
            return {
                ...state,
                getDetailCertification: {
                    ...state.getDetailCertification,
                    loading: true,
                    error: null,
                    status: undefined,
                },
            };
        case GetDetailCertificationActionTypes.FETCH_GET_DETAIL_CERTIFICATION_SUCCESS:
            return {
                ...state,
                getDetailCertification: {
                    ...state.getDetailCertification,
                    item: action.payload,
                    message: "Certification fetched successfully!",
                    loading: false,
                    error: null,
                    status: action.status,
                },
            };
        case GetDetailCertificationActionTypes.FETCH_GET_DETAIL_CERTIFICATION_FAILURE:
            return {
                ...state,
                getDetailCertification: {
                    ...state.getDetailCertification,
                    loading: false,
                    error: action.payload,
                    status: action.status,
                },
            };
        case PutCertificationActionTypes.FETCH_PUT_CERTIFICATION_REQUEST:
            return {
                ...state,
                putCertification: {
                    ...state.putCertification,
                    loading: true,
                    error: null,
                    status: undefined,
                },
            };
        case PutCertificationActionTypes.FETCH_PUT_CERTIFICATION_SUCCESS:
            return {
                ...state,
                putCertification: {
                    ...state.putCertification,
                    message: "Certification saved successfully!",
                    loading: false,
                    error: null,
                    status: action.status,
                },
            };
        case PutCertificationActionTypes.FETCH_PUT_CERTIFICATION_FAILURE:
            return {
                ...state,
                putCertification: {
                    ...state.putCertification,
                    loading: false,
                    error: action.payload,
                    status: action.status,
                },
            };

        case DeleteCertificationActionTypes.FETCH_DELETE_CERTIFICATION_REQUEST:
            return {
                ...state,
                deleteCertification: {
                    ...state.deleteCertification,
                    loading: true,
                    error: null,
                    status: undefined,
                },
            };
        case DeleteCertificationActionTypes.FETCH_DELETE_CERTIFICATION_SUCCESS:
            return {
                ...state,
                deleteCertification: {
                    ...state.deleteCertification,
                    message: "Certification deleted successfully!",
                    loading: false,
                    error: null,
                    status: action.status,
                },
            };
        case DeleteCertificationActionTypes.FETCH_DELETE_CERTIFICATION_FAILURE:
            return {
                ...state,
                deleteCertification: {
                    ...state.deleteCertification,
                    loading: false,
                    error: action.payload,
                    status: action.status,
                },
            };
        case ResetCertificationActionTypes.RESET_CERTIFICATION_STATE:
            return initialState;

        default:
            return state;
    }
};
