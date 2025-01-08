import React from "react";
import { FaSearch } from "react-icons/fa";

const TableControls = ({
    query,
    onSearchChange,
    itemsPerPage,
    onItemsPerPageChange,
}) => (
    <div className="flex justify-between mb-5">
        <select
            onChange={onItemsPerPageChange}
            value={itemsPerPage}
            className="h-10 w-15 border border-gray-300 bg-white text-gray-900 dark:bg-gray-600 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
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

export default TableControls;
