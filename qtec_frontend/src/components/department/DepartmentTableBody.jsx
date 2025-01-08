import React from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const DepartmentTableBody = ({
    loadData,
    currentPage,
    itemsPerPage,
    onEditClick,
    onDeleteClick,
}) => (
    <tbody className="border bg-white text-gray-900 dark:bg-gray-600 dark:text-gray-300">
        {loadData.length > 0 ? (
            loadData.map((item, index) => (
                <tr
                    key={item.id}
                    className="border hover:bg-red-50 dark:hover:bg-gray-100 dark:hover:text-gray-800"
                >
                    <td className="py-2 px-4 border">
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td className="py-2 px-4 border">{item.departmentName}</td>
                    <td className="py-2 px-4 border">{item.budget}</td>
                    <td className="py-2 px-4 border">{item.manager?.name ?? "NULL"}</td>
                    <td className="sticky right-0 bg-white dark:bg-gray-600 px-4 py-2 w-36 z-150 border">
                        <button
                            className="btn btn-xs bg-yellow-300 mr-2"
                            onClick={() => onEditClick(item)}
                        >
                            <FaEdit />
                        </button>
                        <button
                            className="btn btn-xs bg-red-600 text-white"
                            onClick={() => onDeleteClick(item.id)}
                        >
                            <MdDeleteForever />
                        </button>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="5" className="text-center py-2 border">
                    No data found
                </td>
            </tr>
        )}
    </tbody>
);

export default DepartmentTableBody;
