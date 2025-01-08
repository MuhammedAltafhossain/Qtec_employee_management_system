import React from "react";

const TableHeader = () => {
    return (
        <thead>
            <tr className="bg-slate-100 text-gray-900 dark:bg-gray-600 dark:text-gray-300">
                <th className="px-4 py-2 border">SL</th>
                <th className="px-4 py-2 border">Department Name</th>
                <th className="px-4 py-2 border">Average Score</th>
              
            </tr>
        </thead>
    );
};

export default TableHeader;
