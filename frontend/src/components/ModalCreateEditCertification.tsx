import React, { useState, useEffect, ChangeEvent, DragEvent } from "react";
import { XCircle } from "lucide-react";
import { CertificationData } from "../redux/types/certificationTypes";
import { getEnvironment } from "../utils/getEnvironment";

export interface FileWithPreview extends File {
    preview?: string;
}

interface ModalCreateEditCertificationProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        id?: string;
        name: string;
        description: string;
        organization: string;
        dateAwarded: string;
        expiration: string;
        category: string;
        file: FileWithPreview | null;
    }) => void;
    initialData?: CertificationData;
    mode?: "add" | "edit";
}

const ModalCreateEditCertification: React.FC<
    ModalCreateEditCertificationProps
> = ({ isOpen, onClose, onSubmit, initialData = null, mode = "add" }) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [organization, setOrganization] = useState<string>("");
    const [dateAwarded, setDateAwarded] = useState<string>("");
    const [expiration, setExpiration] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [file, setFile] = useState<FileWithPreview | null>(null);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setDescription(initialData.description || "");
            setOrganization(initialData.organization || "");
            setDateAwarded(initialData.dateAwarded ? initialData.dateAwarded.split("T")[0] : "");
            setExpiration(initialData.expiration ? initialData.expiration.split("T")[0] : "");
            setCategory(initialData.category || "")
            const imageData = initialData.imageLink
                ? ({
                      name: initialData.imageLink,
                      size: 0,
                      type: "image/jpeg",
                      preview: `${getEnvironment()}/uploads/${initialData.imageLink}`,
                  } as FileWithPreview)
                : null;
            setFile(imageData);
        }
    }, [initialData]);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = Array.from(e.dataTransfer.files).find(
            (file) =>
                file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024
        ) as FileWithPreview;

        if (droppedFile) {
            droppedFile.preview = URL.createObjectURL(droppedFile);
            setFile(droppedFile);
        }
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selectedFile = Array.from(e.target.files).find(
            (file) =>
                file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024
        ) as FileWithPreview;

        if (selectedFile) {
            selectedFile.preview = URL.createObjectURL(selectedFile);
            setFile(selectedFile);
        }
    };

    const handleSubmit = async () => {
        const formData = {
            id: initialData?.id,
            name,
            description,
            organization,
            dateAwarded,
            expiration,
            category,
            file,
        };

        onSubmit(formData);
    };

    const handleClose = () => {
        setName("");
        setDescription("");
        setOrganization("");
        setDateAwarded("");
        setExpiration("");
        setCategory("");
        setFile(null);

        onClose();
    };

    useEffect(() => {
        return () => {
            if (file?.preview) {
                URL.revokeObjectURL(file.preview);
            }
        };
    }, [file]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 dark:bg-black/80 transition-opacity" />

            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {mode === "edit" ? "Edit Item" : "Add New Item"}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100 transition-colors"
                            type="button"
                        >
                            <XCircle className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            >
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder="Enter name"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder="Enter description"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="organization"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            >
                                Organization
                            </label>
                            <input
                                id="organization"
                                type="text"
                                value={organization}
                                onChange={(e) =>
                                    setOrganization(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder="Enter Organization"
                            />
                        </div>
                        <div className="block md:flex md:gap-4">
                            <div className="w-full md:w-1/2">
                                <label
                                    htmlFor="dateAwarded"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                                >
                                    Date Awarded
                                </label>
                                <input
                                    id="dateAwarded"
                                    type="date"
                                    value={dateAwarded}
                                    onChange={(e) =>
                                        setDateAwarded(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="Enter Date Awarded"
                                />
                            </div>

                            <div className="w-full md:w-1/2 mt-6 md:mt-0">
                                <label
                                    htmlFor="expiration"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                                >
                                    Expiration
                                </label>
                                <input
                                    id="expiration"
                                    type="date"
                                    value={expiration}
                                    onChange={(e) =>
                                        setExpiration(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="Enter Expiration"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            >
                                Category
                            </label>
                            <input
                                id="category"
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder="Enter Category"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Image Upload
                            </label>
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-amber-500 bg-gray-50 dark:bg-gray-700"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileInput}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer text-gray-600 dark:text-gray-300"
                                >
                                    Drag & drop an image here, or click to
                                    select
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        (Max size: 2MB)
                                    </p>
                                </label>
                            </div>
                            {file && (
                                <div className="mt-2 flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                                    <img
                                        src={file.preview}
                                        alt="Preview"
                                        className="h-8 w-8 object-cover rounded"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {file.name}
                                    </span>
                                    <button
                                        onClick={() => setFile(null)}
                                        className="text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        <XCircle className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            type="button"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                            type="button"
                        >
                            {mode === "edit" ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalCreateEditCertification;
