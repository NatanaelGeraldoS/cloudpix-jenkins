import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


interface WidgetCounterProps {
    title: string;
    counter: number;
    Icon: React.ElementType; 
}

const WidgetCounter: React.FC<WidgetCounterProps> = ({
    title,
    counter,
    Icon,
}) => {
    const loading = useSelector((state: RootState) => state.data.loading);
    const error = useSelector((state: RootState) => state.data.error);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="bg-white dark:bg-gray-600 overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <Icon className="h-6 w-6 text-gray-200" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-300 truncate">
                                {title}
                            </dt>
                            <dd className="text-lg font-medium text-gray-100">
                                {counter.toString()}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WidgetCounter;
