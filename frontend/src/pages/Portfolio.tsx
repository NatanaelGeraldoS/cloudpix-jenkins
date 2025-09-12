import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { Edit, Trash2 } from "lucide-react";
import ModalCreateEditPortfolio from "../components/ModalCreateEditPortfolio";
import Button from "../components/Button";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import {
    deletePortfolioAction,
    getDetailPortfolioAction,
    getPortfolioAction,
    putPortfolioAction,
    resetPortfolioAction,
} from "../redux/actions/portfolioActions";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { PortfolioData } from "../redux/types/portfolioTypes";
import LoadingScreen from "../components/LoadingScreen";

export function Portfolio() {
    const dispatch: AppDispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);

    const portfolio = useSelector((state: RootState) => state.portfolio);

    const [portfolios, setPortfolios] = useState<PortfolioData[]>([]);
    const [detailPortfolio, setDetailPortfolio] = useState<PortfolioData>({
        id:"",
        title: "",
        description: "",
        type:"",
        github: "",
        previewLink: "",
        keyFeatures: [],
        technologies: [],
        images: [],
        userId:""
    } as PortfolioData);

    const fetchPortfolio = async () => {
        try {
            setIsLoading(true);
            await dispatch(getPortfolioAction() as any);
        } catch (err) {
            console.error("Get Portfolio failed:", err);
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to Get Portfolio due to an unexpected issue."
            );
            setIsLoading(false);
        }
    };

    const putPortfolio = async (data: {
        id: string;
        title: string;
        description: string;
        type: string;
        github: string;
        previewLink: string;
        keyFeatures: string[];
        technologies: string[];
        files: File[];
    }) => {
        try {
            setIsLoading(true);
            dispatch(putPortfolioAction(data));
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to Put Portfolio due to an unexpected issue."
            );
            setIsLoading(false);
        }
    };

    const deletePortfolio = async (id: string) => {
        try {
            setIsLoading(true);
            await dispatch(deletePortfolioAction(id) as any);
        } catch (err) {
            console.error("Delete Portfolio failed:", err);
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to Delete Portfolio due to an unexpected issue."
            );
            setIsLoading(false);
        }
    };

    const editPortfolio = async (id:string) =>{
        try {
            setIsLoading(true);
            await dispatch(getDetailPortfolioAction(id) as any);
        } catch (err) {
            console.error("Get Detail Portfolio failed:", err);
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to Detail Portfolio due to an unexpected issue."
            );
            setIsLoading(false);
        }
    }
    
    useEffect(() => {
        if (portfolio.deletePortfolio.status === 200) {
            toast.success("Portfolio successfully deleted");
            setIsLoading(false);
            fetchPortfolio();
        } else if (portfolio.deletePortfolio.error) {
            toast.error(
                portfolio.deletePortfolio.error || "An unknown error occurred."
            );
            setIsLoading(false);
        }

        if (portfolio.getPortfolio.status === 200) {
            setPortfolios(portfolio.getPortfolio.items);
            setIsLoading(false);
        } else if (portfolio.getPortfolio.error) {
            toast.error(
                portfolio.getPortfolio.error || "An unknown error occurred."
            );
            setIsLoading(false);
        }

        if (portfolio.getDetailPortfolio.status === 200) {
            setDetailPortfolio(portfolio.getDetailPortfolio.item);
            setIsEdit(true)
            setIsModalOpen(true)
            setIsLoading(false);
        } else if (portfolio.getDetailPortfolio.error) {
            toast.error(
                portfolio.getDetailPortfolio.error || "An unknown error occurred."
            );
            setIsLoading(false);
        }

        if (portfolio.putPortfolio.status === 200) {
            toast.success('Portfolio successfully saved')
            fetchPortfolio();
            setIsModalOpen(false);
        } else if (portfolio.putPortfolio.error) {
            toast.error(
                portfolio.putPortfolio.error || "An unknown error occurred."
            );
            setIsLoading(false);
        }

        dispatch(resetPortfolioAction());
    }, [portfolio]);
    useEffect(() => {
        fetchPortfolio();
    }, [dispatch]);

    const columns = [
        { label: "Title", accessor: "title", sortable: true },
        { label: "Description", accessor: "description", sortable: true },
        { label: "Type", accessor: "type", sortable: true },
        {
            label: "Technologies",
            accessor: "technologies",
            sortable: false,
            render: (row: PortfolioData) =>
                row?.technologies.map((tech, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 mr-3 py-1 bg-gray-100 dark:bg-amber-600 rounded-full text-sm"
                    >
                        {tech.name}
                    </span>
                )),
        },
        {
            label: "Action",
            accessor: "action",
            sortable: false,
            render: (row: PortfolioData) => (
                <div className="flex space-x-2">
                    <button
                        className="text-amber-600 hover:text-amber-900 mr-4"
                        onClick={(e) => {
                            e.stopPropagation();
                            editPortfolio(row.id);
                        }}
                    >
                        <Edit className="h-5 w-5" />
                    </button>
                    <button
                        className="text-red-600 hover:text-red-900"
                        onClick={(e) => {
                            e.stopPropagation();
                            deletePortfolio(row.id);
                        }}
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
            ),
        },
    ];

    const data: PortfolioData[] = portfolios;

    // const handleRowClick = (row: PortfolioData) => {
    // };
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {isLoading && <LoadingScreen />}
            
            <ModalCreateEditPortfolio
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={putPortfolio}
                mode={isEdit ? "edit" : "add"}
                initialData={
                    isEdit ? detailPortfolio : {
                        id: "",
                        title: "",
                        description: "",
                        type:"",
                        github: "",
                        previewLink: "",
                        keyFeatures: [],
                        technologies: [],
                        images: [],
                        userId: ""
                    } as PortfolioData
                }
            />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <main className="max-w-7xl mx-auto py-3 sm:px-3 lg:px-6">
                    <div className="grid grid-cols-1 gap-6">
                        <DataTable
                            columns={columns}
                            data={data}
                            addButton={
                                <Button onClick={() => {setIsModalOpen(true); setIsEdit(false);}}>
                                    Add New Portfolio
                                </Button>
                            }
                        />
                    </div>
                </main>
            </div>
        </>
    );
}
