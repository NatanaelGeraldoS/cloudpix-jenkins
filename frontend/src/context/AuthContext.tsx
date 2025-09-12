import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
    getMeAction,
    loginAction,
    registerAction,
    resetAuthAction,
} from "../redux/actions/authActions";
import { User } from "../redux/types/authTypes";
import toast from "react-hot-toast";
import { RootState } from "../redux/store";

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector((state: RootState) => state.auth);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const fetchUser = async (authKey: string) => {
        if (authKey) {
            try {
                setIsLoading(true);
                await dispatch(getMeAction());
            } catch (error) {
                localStorage.removeItem("authorization");
                toast.error("An unknown error occurred.");
                setIsLoading(false);
            }
        }
    };
    useEffect(() => {
        const authKey = localStorage.getItem("authorization");
        if (authKey) {
            fetchUser(authKey);
        }
        else
            setIsLoading(false);
    }, []);

    useEffect(() => {
        if (auth.getMe.status === 200 && auth.getMe.user && !user) {
            setUser(auth.getMe.user);
            setIsLoading(false);
        }
        else if (auth.getMe.error) {
            localStorage.removeItem("authorization");
            toast.error(auth.getMe.error || "An unknown error occurred.");
            setIsLoading(false);
        }

        if (auth.login.status === 200 && auth.login.authKey) {
            localStorage.setItem("authorization", auth.login.authKey);
            fetchUser(auth.login.authKey)
            navigate("/dashboard");
            setIsLoading(false);
        } else if (auth.login.error) {
            toast.error(auth.login.error || "An unknown error occurred.");
            setIsLoading(false);
        }
        dispatch(resetAuthAction());
    }, [auth, navigate]);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const user: User = { email, password };
            await dispatch(loginAction(user) as any);
        } catch (err) {
            console.error("Login failed:", err);
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to login due to an unexpected issue."
            );
            setIsLoading(false);
        }
    };

    const register = async (
        email: string,
        password: string,
        username: string
    ) => {
        try {
            setIsLoading(true);
            const user: User = { email, password, username };
            await dispatch(registerAction(user) as any);
            toast.success("Registration successful! Please log in.");
            navigate("/login");
            setIsLoading(false);
        } catch (err) {
            console.error("Registration failed:", err);
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to register due to an unexpected issue."
            );
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("authorization");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider
            value={{ user, login, register, logout, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
