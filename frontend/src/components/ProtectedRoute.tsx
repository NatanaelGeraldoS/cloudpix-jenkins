import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();

    if (!isLoading && !user) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            {isLoading && <LoadingScreen />}
            {children}
        </>
    );
}
