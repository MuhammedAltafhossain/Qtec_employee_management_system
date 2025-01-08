import React, { useCallback, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { debounce } from "../../utils/debounce";

const SearchBar = ({ query, setQuery, setSearchName }) => {
    const debouncedQuery = useCallback(
        debounce((value) => {
            setSearchName(value);
        }, 500),
        []
    );

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setQuery(value);
        debouncedQuery(value);
    };

    return (
        <div className="relative mb-2">
            
            <input
                type="text"
                placeholder="Search Employee..."
                value={query}
                onChange={handleSearchChange}
                className="w-full pl-10 p-2 border border-gray-300 bg-white text-gray-900 dark:bg-gray-600 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch />
            </div>
        </div>
    );
};

export default SearchBar;
