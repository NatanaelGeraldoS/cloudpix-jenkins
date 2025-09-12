import {
    GetMeActions,
    GetMeActionTypes,
    LoginActions,
    LoginActionTypes,
    RegisterActions,
    RegisterActionTypes,
    ResetAuthActions,
    ResetAuthActionTypes,
    User,
} from "../types/authTypes";

interface RegisterState {
    loading: boolean;
    status?: number;
    error: string | null;
}

interface LoginState {
    loading: boolean;
    user: User | null;
    authKey?: string;
    status?: number;
    error: string | null;
}

interface GetMeState {
    loading: boolean;
    user: User | null;
    status?: number;
    error: string | null;
}

interface AuthState {
    register: RegisterState;
    login: LoginState;
    getMe: GetMeState;
}

const initialState: AuthState = {
    register: {
        loading: false,
        status: undefined,
        error: null,
    },
    login: {
        loading: false,
        user: null,
        authKey: undefined,
        status: undefined,
        error: null,
    },
    getMe: {
        loading: false,
        user: null,
        status: undefined,
        error: null,
    },
};

export const authReducer = (
    state = initialState,
    action: RegisterActions | LoginActions | GetMeActions | ResetAuthActions
): AuthState => {
    switch (action.type) {
        // Register Actions
        case RegisterActionTypes.FETCH_REGISTER_REQUEST:
            return {
                ...state,
                register: { ...state.register, loading: true, error: null },
            };
        case RegisterActionTypes.FETCH_REGISTER_SUCCESS:
            return {
                ...state,
                register: {
                    ...state.register,
                    loading: false,
                    status: action.status,
                    error: null,
                },
            };
        case RegisterActionTypes.FETCH_REGISTER_FAILURE:
            return {
                ...state,
                register: {
                    ...state.register,
                    loading: false,
                    error: action.payload,
                    status: action.status,
                },
            };

        // Login Actions
        case LoginActionTypes.FETCH_LOGIN_REQUEST:
            return {
                ...state,
                login: { ...state.login, loading: true, error: null },
            };
        case LoginActionTypes.FETCH_LOGIN_SUCCESS:
            return {
                ...state,
                login: {
                    ...state.login,
                    loading: false,
                    user: action.payload.user,
                    authKey: action.payload.token,
                    status: action.status,
                    error: null,
                },
            };
        case LoginActionTypes.FETCH_LOGIN_FAILURE:
            return {
                ...state,
                login: {
                    ...state.login,
                    loading: false,
                    error: action.payload,
                    status: action.status,
                },
            };

        // GetMe Actions
        case GetMeActionTypes.FETCH_GET_ME_REQUEST:
            return {
                ...state,
                getMe: { ...state.getMe, loading: true, error: null },
            };
        case GetMeActionTypes.FETCH_GET_ME_SUCCESS:
            return {
                ...state,
                getMe: {
                    ...state.getMe,
                    loading: false,
                    user: action.payload,
                    status: action.status,
                    error: null,
                },
            };
        case GetMeActionTypes.FETCH_GET_ME_FAILURE:
            return {
                ...state,
                getMe: {
                    ...state.getMe,
                    loading: false,
                    error: action.payload,
                    status: action.status,
                },
            };

        // Reset Auth State
        case ResetAuthActionTypes.RESET_AUTH_STATE:
            return initialState;

        default:
            return state;
    }
};
