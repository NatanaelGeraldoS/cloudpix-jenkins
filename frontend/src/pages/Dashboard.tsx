import { Users } from "lucide-react";
import WidgetCounter from "../components/WidgetCounter";
import { useEffect, useState } from "react";
import { getDashboardWidgetCounterAction, resetDashboardAction } from "../redux/actions/dashboardActions";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import LoadingScreen from "../components/LoadingScreen";
import { DashboardWidgetsData } from "../redux/types/dashboardTypes";

export function Dashboard() {
    const dispatch: AppDispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [widgetCounter, setWidgetCounter] = useState<DashboardWidgetsData>({certification_counter:0, portfolio_counter:0});
    const dashboard = useSelector((state: RootState) => state.dashboard);
    
    const getWidgetCounter = async () => {
        try {
            setIsLoading(true);
            await dispatch(getDashboardWidgetCounterAction() as any);
        } catch (err) {
            console.error("Get Dashboard Widget Counter failed:", err);
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to Get Dashboard Widget Counter due to an unexpected issue."
            );
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (dashboard.getDashboardWidgetCounter.status === 200) {
            setWidgetCounter(dashboard.getDashboardWidgetCounter.item)
            setIsLoading(false);
        } else if (dashboard.getDashboardWidgetCounter.error) {
            toast.error(
                dashboard.getDashboardWidgetCounter.error || "An unknown error occurred."
            );
            setIsLoading(false);
        }

        dispatch(resetDashboardAction());
    }, [dashboard]);
    useEffect(() => {
        getWidgetCounter();
    }, [dispatch]);
    return (
        <>
            {isLoading && <LoadingScreen />}
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="grid-cols-1 gap-3 grid md:grid-cols-4">
                        <WidgetCounter counter={widgetCounter.certification_counter} title="Total Certification" Icon={Users} />
                        <WidgetCounter counter={widgetCounter.portfolio_counter} title="Total Portfolio" Icon={Users} />
                    </div>
                </main>
            </div>
        </>
    );
}
