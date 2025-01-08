import React from "react";

const TableHeader = () => {
    return (
        <thead>
            <tr className="bg-slate-100 text-gray-900 dark:bg-gray-600 dark:text-gray-300">
                <th className="px-4 py-2 border">SL</th>
                <th className="px-4 py-2 border">Employee Name</th>
                <th className="px-4 py-2 border">Position</th>
                <th className="px-4 py-2 border">Department</th>
                <th className="px-4 py-2 border w-1/4">Email</th>
                <th className="px-4 py-2 border">Phone No</th>
                <th className="px-4 py-2 border">Budget</th>
                <th className="px-4 py-2 border">Score</th>
                <th className="px-4 py-2 border">Joining Date</th>
                <th className="px-4 py-2 border">Action</th>
            </tr>
        </thead>
    );
};

export default TableHeader;
