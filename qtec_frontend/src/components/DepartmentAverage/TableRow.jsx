import React from "react";

const TableRow = ({ data, index, }) => {
    return (
       
        <tr className="border hover:bg-red-50 dark:hover:bg-gray-100 dark:hover:text-gray-800">
            <td className="py-2 px-4 border">
                {index + 1}
            </td>
            <td className="py-2 px-4 border">{data.departmentName}</td>
            <td className="py-2 px-4 border">{data.averagePerformanceScore}</td>
             
        </tr>
    );
};

export default TableRow;
