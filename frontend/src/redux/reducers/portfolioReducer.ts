import {
    DeletePortfolioActions,
    DeletePortfolioActionTypes,
    PutPortfolioActions,
    PutPortfolioActionTypes,
    GetPortfolioActions,
    GetPortfolioActionTypes,
    PortfolioData,
    ResetPortfolioActions,
    ResetPortfolioActionTypes,
    GetDetailPortfolioActionTypes,
    GetDetailPortfolioActions,
} from "../types/portfolioTypes";

interface DataState {
    getPortfolio: {
        items: PortfolioData[];
        message: string | null;
        loading: boolean;
        error: string | null;
        status?: number;
    };
    getDetailPortfolio: {
        item: PortfolioData;
        message: string | null;
        loading: boolean;
        error: string | null;
        status?: number;
    };
    putPortfolio: {
      message: string | null;
      loading: boolean;
      error: string | null;
      status?: number;
  };
    deletePortfolio: {
        message: string | null;
        loading: boolean;
        error: string | null;
        status?: number;
    };
}

const initialState: DataState = {
    getPortfolio: {
        items: [],
        message: null,
        loading: false,
        error: null,
        status: undefined,
    },
    getDetailPortfolio: {
        item: {
            id:"",
            title: "",
            description: "",
            keyFeatures: [],
            technologies: [],
            images: [],
            userId:"",
            type: "",
            github: "",
            previewLink: "",
        } as PortfolioData,
        message: null,
        loading: false,
        error: null,
        status: undefined,
    },
    putPortfolio: {
      message: null,
      loading: false,
      error: null,
      status: undefined,
  },
    deletePortfolio: {
        message: null,
        loading: false,
        error: null,
        status: undefined,
    },
};

export const portfolioReducer = (
    state = initialState,
    action: GetPortfolioActions | GetDetailPortfolioActions | PutPortfolioActions | DeletePortfolioActions | ResetPortfolioActions
): DataState => {
    switch (action.type) {
        case GetPortfolioActionTypes.FETCH_GET_PORTFOLIO_REQUEST:
            return {
                ...state,
                getPortfolio: {
                    ...state.getPortfolio,
                    loading: true,
                    error: null,
                    status: undefined,
                },
            };
        case GetPortfolioActionTypes.FETCH_GET_PORTFOLIO_SUCCESS:
            return {
                ...state,
                getPortfolio: {
                    ...state.getPortfolio,
                    items: action.payload,
                    message: "Portfolio fetched successfully!",
                    loading: false,
                    error: null,
                    status: action.status,
                },
            };
        case GetPortfolioActionTypes.FETCH_GET_PORTFOLIO_FAILURE:
            return {
                ...state,
                getPortfolio: {
                    ...state.getPortfolio,
                    loading: false,
                    error: action.payload,
                    status: action.status,
                },
            };
        case GetDetailPortfolioActionTypes.FETCH_GET_DETAIL_PORTFOLIO_REQUEST:
            return {
                ...state,
                getDetailPortfolio: {
                    ...state.getDetailPortfolio,
                    loading: true,
                    error: null,
                    status: undefined,
                },
            };
        case GetDetailPortfolioActionTypes.FETCH_GET_DETAIL_PORTFOLIO_SUCCESS:
            return {
                ...state,
                getDetailPortfolio: {
                    ...state.getDetailPortfolio,
                    item: action.payload,
                    message: "Portfolio fetched successfully!",
                    loading: false,
                    error: null,
                    status: action.status,
                },
            };
        case GetDetailPortfolioActionTypes.FETCH_GET_DETAIL_PORTFOLIO_FAILURE:
            return {
                ...state,
                getDetailPortfolio: {
                    ...state.getDetailPortfolio,
                    loading: false,
                    error: action.payload,
                    status: action.status,
                },
            };
        case PutPortfolioActionTypes.FETCH_PUT_PORTFOLIO_REQUEST:
            return {
                ...state,
                putPortfolio: {
                    ...state.putPortfolio,
                    loading: true,
                    error: null,
                    status: undefined,
                },
            };
        case PutPortfolioActionTypes.FETCH_PUT_PORTFOLIO_SUCCESS:
            return {
                ...state,
                putPortfolio: {
                    ...state.putPortfolio,
                    message: "Portfolio saved successfully!",
                    loading: false,
                    error: null,
                    status: action.status,
                },
            };
        case PutPortfolioActionTypes.FETCH_PUT_PORTFOLIO_FAILURE:
            return {
                ...state,
                putPortfolio: {
                    ...state.putPortfolio,
                    loading: false,
                    error: action.payload,
                    status: action.status,
                },
            };

        case DeletePortfolioActionTypes.FETCH_DELETE_PORTFOLIO_REQUEST:
            return {
                ...state,
                deletePortfolio: {
                    ...state.deletePortfolio,
                    loading: true,
                    error: null,
                    status: undefined,
                },
            };
        case DeletePortfolioActionTypes.FETCH_DELETE_PORTFOLIO_SUCCESS:
            return {
                ...state,
                deletePortfolio: {
                    ...state.deletePortfolio,
                    message: "Portfolio deleted successfully!",
                    loading: false,
                    error: null,
                    status: action.status,
                },
            };
        case DeletePortfolioActionTypes.FETCH_DELETE_PORTFOLIO_FAILURE:
            return {
                ...state,
                deletePortfolio: {
                    ...state.deletePortfolio,
                    loading: false,
                    error: action.payload,
                    status: action.status,
                },
            };
        case ResetPortfolioActionTypes.RESET_PORTFOLIO_STATE:
            return initialState;

        default:
            return state;
    }
};
