import { ArrowDown, ArrowUp, Search } from "lucide-react";
import React, { useState } from "react";

type Column<T> = {
    label: string;
    accessor: keyof T;
    sortable?: boolean;
    render?: (value: any) => React.ReactNode;
};

type DataTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (row: T) => void;
    loading?: boolean;
    darkMode?: boolean;
    addButton?: React.ReactNode;
};

const DataTable = <T extends Record<string, any>>({
    columns,
    data,
    onRowClick,
    loading = false,
    darkMode = false,
    addButton,
}: DataTableProps<T>) => {
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T;
        direction: "asc" | "desc";
    } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSort = (column: keyof T) => {
        let direction: "asc" | "desc" = "asc";
        if (
            sortConfig &&
            sortConfig.key === column &&
            sortConfig.direction === "asc"
        ) {
            direction = "desc";
        }
        setSortConfig({ key: column, direction });
    };

    const sortedData = React.useMemo(() => {
        if (!sortConfig) return data;

        const { key, direction } = sortConfig;
        return [...data].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    const filteredData = React.useMemo(() => {
        if (!searchTerm) return sortedData;

        return sortedData.filter((row) =>
            columns.some((column) =>
                String(row[column.accessor])
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
        );
    }, [sortedData, searchTerm, columns]);

    const SortIcon = ({ columnKey }: { columnKey: string }) => {
        if (!sortConfig || sortConfig.key !== columnKey) {
            return (
                <div className="flex flex-col ml-1">
                    <ArrowUp className="h-4 w-4 text-gray-400" />
                    <ArrowDown className="h-4 w-4 text-gray-400" />
                </div>
            );
        }

        return (
            <div className="flex flex-col ml-1">
                {sortConfig.direction === "asc" ? (
                    <ArrowUp className="h-4 w-4 text-amber-600" />
                ) : (
                    ""
                )}
                {sortConfig.direction === "desc" ? (
                    <ArrowDown className="h-4 w-4 text-amber-600" />
                ) : (
                    ""
                )}
            </div>
        );
    };

    return (
        <div className={`w-full ${darkMode ? "dark" : ""}`}>
            <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-4 bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                       bg-white dark:bg-gray-700 dark:border-gray-600
                       text-sm text-gray-900 dark:text-white
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-500
                       focus:border-amber-500 dark:focus:border-amber-500"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {/* <button
                            onClick={() => {onButtonAddClick && onButtonAddClick()}}
                            className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 flex items-center"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add New
                        </button> */}
                        {addButton}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={String(column.accessor)}
                                        scope="col"
                                        className={`px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold tracking-wider
                              ${
                                  column.sortable
                                      ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                      : ""
                              }`}
                                        onClick={() =>
                                            column.sortable &&
                                            handleSort(column.accessor)
                                        }
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>{column.label}</span>
                                            {column.sortable && (
                                                <SortIcon
                                                    columnKey={String(column.accessor)}
                                                />
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        <div className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin h-5 w-5 text-blue-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            <span className="ml-2">
                                                Loading...
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No results found
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        onClick={() =>
                                            onRowClick && onRowClick(row)
                                        }
                                        className={`
                      ${onRowClick ? "cursor-pointer" : ""}
                      hover:bg-gray-50 dark:hover:bg-gray-700
                      transition-colors duration-150 ease-in-out
                    `}
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={String(column.accessor)}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                                            >
                                                <div className="max-w-xs break-words whitespace-pre-line line-clamp-3 overflow-hidden">
                                                 {column.render
                                                    ? column.render(row) // Pass the entire row to the render function
                                                    : row[column.accessor]}</div>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
