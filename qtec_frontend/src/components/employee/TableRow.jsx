import React from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const TableRow = ({ employee, index, onEdit, onDelete, currentPage, itemsPerPage }) => {
    return (
       
        <tr className="border hover:bg-red-50 dark:hover:bg-gray-100 dark:hover:text-gray-800">
            <td className="py-2 px-4 border">
                {index + 1 + (currentPage - 1) * itemsPerPage}
            </td>
            <td className="py-2 px-4 border">{employee.name}</td>
            <td className="py-2 px-4 border">{employee.position}</td>
            <td className="py-2 px-4 border">{employee.departmentName}</td>
            <td className="py-2 px-4 border w-56">{employee.email}</td>
            <td className="py-2 px-4 border">{employee.phone}</td>
            <td className="py-2 px-4 border">{employee.budget}</td>
            <td className="py-2 px-4 border">{employee.performanceScore}</td>
            <td className="py-2 px-4 border">
                {new Date(employee.joiningDate).toLocaleDateString()}
            </td>
            <td className="py-2 px-4 border">
                <button
                    className="btn btn-xs bg-yellow-300 mr-2"
                    onClick={() => onEdit(employee)}
                >
                    <FaEdit />
                </button>
                <button
                    className="btn btn-xs bg-red-600 text-white"
                    onClick={() => onDelete(employee.id)}
                >
                    <MdDeleteForever />
                </button>
            </td>
        </tr>
    );
};

export default TableRow;
