import React, { useState } from "react";
import SearchBar from "./SearchBar";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import CustomPagination from "../pagination/Pagination";
import EmployeeUpdateForm from "./EmployeeUpdateForm";
import Loader from "../Loader/Loader";

const EmployeeTable = ({
    fetchData,
    loadData,
    loadingTable,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    setSearchName,
    searchName,
    totalItems,
}) => {
    const [query, setQuery] = useState(searchName || "");
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
        setShowUpdateForm(true);
    };

    const handleDeleteClick = (id) => {
        Swal.fire({
            title: "Are you sure you want to delete this employee?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const data = await makeRequest({
                        method: "Delete",
                        url: `Employees/${id}`,
                    });
                    console.log(data);
                    if (data.status === 200) {
                        toast.success(data.message);
                        fetchData();

                    } else {
                        throw new Error("Invalid data format received");
                    }
                } catch (error) {
                    toast.error("Failed to delete employee");
                }
            }
        });
    };

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    return (
        <div>
            <div className="flex justify-between mb-5">

                <select
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    value={itemsPerPage}
                    className="h-10 w-15 border border-gray-300 bg-white text-gray-900 dark:bg-gray-600 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>

                <SearchBar
                    query={query}
                    setQuery={setQuery}
                    setSearchName={setSearchName}
                />
            </div>

            {loadingTable ? (
                <Loader/>
            ) : (
                <div>
                    <table className="table-fixed w-full text-left border border-double">
                        <TableHeader />
                        <tbody className="border bg-white text-gray-900 dark:bg-gray-600 dark:text-gray-300">
                            {loadData.length > 0 ? (
                                loadData.map((item, index) => (
                                    <TableRow
                                        key={item.id}
                                        employee={item}
                                        index={index}
                                        currentPage={currentPage}
                                        itemsPerPage={itemsPerPage}
                                        onEdit={handleEditClick}
                                        onDelete={handleDeleteClick}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center py-2 border">
                                        No data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                onPageChange={handlePageClick}
            />

            {showUpdateForm && (
                <EmployeeUpdateForm
                    onClose={() => setShowUpdateForm(false)}
                    fetchData={fetchData}
                    employeeData={selectedEmployee}
                />
            )}
        </div>
    );
};

export default EmployeeTable;
