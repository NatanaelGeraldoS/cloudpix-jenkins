import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { Edit, Trash2 } from "lucide-react";
import Button from "../components/Button";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import {
    deleteCertificationAction,
    getDetailCertificationAction,
    putCertificationAction,
    resetCertificationAction,
} from "../redux/actions/certificationActions";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { CertificationData } from "../redux/types/certificationTypes";
import LoadingScreen from "../components/LoadingScreen";
import { getCertificationAction } from "../redux/actions/certificationActions";
import ModalCreateEditCertification from "../components/ModalCreateEditCertification";

export function Certification() {
    const dispatch: AppDispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);

    const certification = useSelector(
        (state: RootState) => state.certification
    );

    const [certifications, setCertifications] = useState<CertificationData[]>(
        []
    );
    const [detailCertification, setDetailCertification] =
        useState<CertificationData>({
            id: "",
            name: "",
            description: "",
            organization: "",
            dateAwarded: "",
            expiration: "",
            category: "",
            imageLink: "",
            userId: "",
        } as CertificationData);

    const fetchCertification = async () => {
        try {
            setIsLoading(true);
            await dispatch(getCertificationAction() as any);
        } catch (err) {
            console.error("Get Certification failed:", err);
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to Get Certification due to an unexpected issue."
            );
            setIsLoading(false);
        }
    };

    const putCertification = async (data: {
        id: string;
        name: string;
        description: string;
        organization: string;
        dateAwarded: string;
        expiration: string;
        category: string;
        file: File;
    }) => {
        try {
            setIsLoading(true);
            dispatch(putCertificationAction(data));
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to Put Certification due to an unexpected issue."
            );
            setIsLoading(false);
        }
    };

    const deleteCertification = async (id: string) => {
        try {
            setIsLoading(true);
            await dispatch(deleteCertificationAction(id) as any);
        } catch (err) {
            console.error("Delete Certification failed:", err);
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to Delete Certification due to an unexpected issue."
            );
            setIsLoading(false);
        }
    };

    const editCertification = async (id: string) => {
        try {
            setIsLoading(true);
            await dispatch(getDetailCertificationAction(id) as any);
        } catch (err) {
            console.error("Get Detail Certification failed:", err);
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to Detail Certification due to an unexpected issue."
            );
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (certification.deleteCertification.status === 200) {
            toast.success("Certification successfully deleted");
            setIsLoading(false);
            fetchCertification();
        } else if (certification.deleteCertification.error) {
            toast.error(
                certification.deleteCertification.error ||
                    "An unknown error occurred."
            );
            setIsLoading(false);
        }

        if (certification.getCertification.status === 200) {
            setCertifications(certification.getCertification.items);
            setIsLoading(false);
        } else if (certification.getCertification.error) {
            toast.error(
                certification.getCertification.error ||
                    "An unknown error occurred."
            );
            setIsLoading(false);
        }

        if (certification.getDetailCertification.status === 200) {
            setDetailCertification(certification.getDetailCertification.item);
            setIsEdit(true);
            setIsModalOpen(true);
            setIsLoading(false);
        } else if (certification.getDetailCertification.error) {
            toast.error(
                certification.getDetailCertification.error ||
                    "An unknown error occurred."
            );
            setIsLoading(false);
        }

        if (certification.putCertification.status === 200) {
            toast.success("Certification successfully saved");
            fetchCertification();
            setIsModalOpen(false);
        } else if (certification.putCertification.error) {
            toast.error(
                certification.putCertification.error ||
                    "An unknown error occurred."
            );
            setIsLoading(false);
        }

        dispatch(resetCertificationAction());
    }, [certification]);
    useEffect(() => {
        fetchCertification();
    }, [dispatch]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const columns = [
        { label: "Name", accessor: "name", sortable: true },
        { label: "Description", accessor: "description", sortable: true },
        { label: "Organization", accessor: "organization", sortable: true },
        { label: "Date Awarded", accessor: "dateAwarded", sortable: true, render: (row: CertificationData) => <span>{formatDate(row.dateAwarded)}</span>, },
        { label: "Expiration", accessor: "expiration", sortable: true, render: (row: CertificationData) => <span>{formatDate(row.expiration)}</span>, },
        { label: "Category", accessor: "category", sortable: true },
        { label: "Image", accessor: "imageLink", sortable: true },
        {
            label: "Action",
            accessor: "action",
            sortable: false,
            render: (row: CertificationData) => (
                <div className="flex space-x-2">
                    <button
                        className="text-amber-600 hover:text-amber-900 mr-4"
                        onClick={(e) => {
                            e.stopPropagation();
                            editCertification(row.id);
                        }}
                    >
                        <Edit className="h-5 w-5" />
                    </button>
                    <button
                        className="text-red-600 hover:text-red-900"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteCertification(row.id);
                        }}
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
            ),
        },
    ];

    const data: CertificationData[] = certifications;

    // const handleRowClick = (row: CertificationData) => {
    // };
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {isLoading && <LoadingScreen />}

            <ModalCreateEditCertification
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={putCertification}
                mode={isEdit ? "edit" : "add"}
                initialData={
                    isEdit
                        ? detailCertification
                        : ({
                              id: "",
                              name: "",
                              description: "",
                              organization: "",
                              dateAwarded: "",
                              expiration: "",
                              category: "",
                              imageLink: "",
                              userId: "",
                          } as CertificationData)
                }
            />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <main className="max-w-7xl mx-auto py-3 sm:px-3 lg:px-6">
                    <div className="grid grid-cols-1 gap-6">
                        <DataTable
                            columns={columns}
                            data={data}
                            addButton={
                                <Button
                                    onClick={() => {
                                        setIsModalOpen(true);
                                        setIsEdit(false);
                                    }}
                                >
                                    Add New Certification
                                </Button>
                            }
                        />
                    </div>
                </main>
            </div>
        </>
    );
}
