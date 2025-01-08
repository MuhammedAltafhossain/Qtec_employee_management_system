import React from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const PerformanceReviewRow = ({ item, index, onEdit, onDelete, currentPage, itemsPerPage }) => (
    <tr className="border hover:bg-red-50 dark:hover:bg-gray-100 dark:hover:text-gray-800">
        <td className="py-2 px-4 border">
            {index + 1 + (currentPage - 1) * itemsPerPage}
        </td>
        <td className="py-2 px-4 border">{item.name}</td>
        <td className="py-2 px-4 border">{item.reviewScore}</td>
        <td className="py-2 px-4 border">
            {new Date(item.reviewDate).toLocaleDateString()}
        </td>
        <td className="py-2 px-4 border">{item.reviewNotes}</td>
        <td className="sticky right-0 bg-white dark:bg-gray-600 px-4 py-2 w-36 z-150 border">
            <button
                className="btn btn-xs bg-yellow-300 mr-2"
                onClick={() => onEdit(item)}
            >
                <FaEdit />
            </button>
            <button
                className="btn btn-xs bg-red-600 text-white"
                onClick={() => onDelete(item.id)}
            >
                <MdDeleteForever />
            </button>
        </td>
    </tr>
);

export default PerformanceReviewRow;
