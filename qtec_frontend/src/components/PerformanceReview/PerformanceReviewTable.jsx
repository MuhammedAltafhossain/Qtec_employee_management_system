import React, { useCallback, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import CustomPagination from "../pagination/Pagination";
import { debounce } from "../../utils/debounce";
import PerformanceReviewRow from "./PerformanceReviewRow";
import SearchAndPaginationControls from "./SearchAndPaginationControls";
import Loader from "../Loader/Loader";
import PerformanceReviewUpdateForm from "./PerformanceReviewUpdateForm";

const PerformanceReviewTable = ({
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

  const debouncedQuery = useCallback(
    debounce((query) => setSearchName(query), 500),
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
      title: "Are you sure you want to delete this Review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = await axios.delete(`PerformanceReviews/${id}`);
          toast.success(data.message);
          fetchData();
        } catch {
          toast.error("Failed to delete Performance Reviews");
        }
      }
    });
  };

  const handleEditClick = (performance) => {
    setSelectedEmployee(performance);
    setShowUpdateForm(true);
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <SearchAndPaginationControls
        query={query}
        itemsPerPage={itemsPerPage}
        onSearchChange={handleSearchChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {loadingTable ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto relative">
          <table className="table-fixed w-full text-left border border-double">
            <thead>
              <tr className="bg-slate-100 text-gray-900 dark:bg-gray-600 dark:text-gray-300">
                <th className="px-4 py-2 border w-6">SL</th>
                <th className="px-4 py-2 border w-28">Employee Name</th>
                <th className="px-4 py-2 border text-center w-10">
                  Review Score
                </th>
                <th className="px-4 py-2 border text-center w-20">Review Date</th>
                <th className="px-4 py-2 border text-center w-48">Review Note</th>
                <th className="sticky right-0 bg-slate-100 dark:bg-gray-600 px-4 py-2 w-16 z-150 border">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loadData.length > 0 ? (
                loadData.map((item, index) => (
                  <PerformanceReviewRow
                    key={item.id}
                    item={item}
                    index={index}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-2 border">
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

      {showUpdateForm && selectedEmployee && (
        <PerformanceReviewUpdateForm
          onClose={() => setShowUpdateForm(false)}
          fetchData={fetchData}
          performanceReviewData={selectedEmployee}
        />
      )}
    </div>
  );
};

export default PerformanceReviewTable;
