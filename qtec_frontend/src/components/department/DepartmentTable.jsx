import React, { useCallback, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { debounce } from "../../utils/debounce";
import CustomPagination from "../pagination/Pagination";
import TableControls from "./TableControls";
import DepartmentTableBody from "./DepartmentTableBody";
import DepartmentUpdateForm from "./DepartmentUpdateForm";
import useApi from "../../constants/useHookForApiCall";
import Loader from "../Loader/Loader";

const DepartmentTable = ({
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
  const makeRequest = useApi();
  const [query, setQuery] = useState(searchName || "");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const debouncedQuery = useCallback(
    debounce((query) => {
      setSearchName(query);
    }, 500),
    []
  );

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    debouncedQuery(value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this Department?",
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
            url: `Departments/${id}`,
          });
          if (data.status === 200) {
            toast.success(data.message);
            fetchData();
          } else {
            throw new Error("Invalid data format received");
          }
        } catch (error) {
          toast.error("Failed to delete Department");
        }
      }
    });
  };

  const handleEditClick = (department) => {
    setSelectedEmployee(department);
    setShowUpdateForm(true);
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <TableControls
        query={query}
        onSearchChange={handleSearchChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {loadingTable ? (
        <Loader />
      ) : (
        <>
          <div className="overflow-x-auto relative">
            <table className="table-fixed w-full text-left border border-double">
              <thead>
                <tr className="bg-slate-100 text-gray-900 dark:bg-gray-600 dark:text-gray-300">
                  <th className="px-4 py-2 border w-12">SL</th>
                  <th className="px-4 py-2 border w-96">Department Name</th>
                  <th className="px-4 py-2 border text-center w-36">Budget</th>
                  <th className="px-4 py-2 border text-center w-36">
                    Manager Name
                  </th>
                  <th className="sticky right-0 bg-slate-100 dark:bg-gray-600 px-4 py-2 w-16 z-150 border">
                    Action
                  </th>
                </tr>
              </thead>
              <DepartmentTableBody
                loadData={loadData}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
              />
            </table>
          </div>

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={handlePageClick}
          />
        </>
      )}

      {showUpdateForm && selectedEmployee && (
        <DepartmentUpdateForm
          onClose={() => setShowUpdateForm(false)}
          fetchData={fetchData}
          departmentData={selectedEmployee}
        />
      )}
    </div>
  );
};

export default DepartmentTable;
