import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchAndPaginationControls = ({
    query,
    itemsPerPage,
    onSearchChange,
    onItemsPerPageChange,
}) => (
    <div className="flex justify-between mb-5">
        <select
            onChange={onItemsPerPageChange}
            value={itemsPerPage}
            className="h-10 w-15 border border-gray-300 bg-white text-gray-900 dark:bg-gray-600 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            {[5, 10, 20, 50, 100].map((value) => (
                <option key={value} value={value}>
                    {value}
                </option>
            ))}
        </select>

        <div className="relative mb-2">
            <input
                type="text"
                placeholder="Search Employee..."
                value={query}
                onChange={onSearchChange}
                className="w-full pl-10 p-2 border border-gray-300 bg-white text-gray-900 dark:bg-gray-600 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch />
            </div>
        </div>
    </div>
);

export default SearchAndPaginationControls;
