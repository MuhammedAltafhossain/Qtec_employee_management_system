import React, { useEffect, useState } from "react";
import useApi from "../../constants/useHookForApiCall";
import toast from "react-hot-toast";
import PerformanceReviewTable from "../../components/PerformanceReview/PerformanceReviewTable";
import PerformanceReviewForm from "../../components/PerformanceReview/PerformanceReviewForm";

const PerformanceReview = () => {
    const makeRequest = useApi();
    const [loadData, setloadData] = useState([]);
    const [loadingTable, setLoadingTable] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [totalItems, setTotalItems] = useState(1);
    const [employeeName, setEmployeeName] = useState("");

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchData();
    }, [currentPage, itemsPerPage, employeeName]);

    const fetchData = async () => {
        setLoadingTable(true);
        try {
            const data = await makeRequest({
                method: "GET",
                url: `PerformanceReviews?search=${employeeName}&page=${currentPage}&pageSize=${itemsPerPage}`,
            });

            if (data.status === 200 && Array.isArray(data.data)) {
                setloadData(data.data);
                setTotalPages(Math.ceil(data.totalCount / itemsPerPage)); // Calculate and set total pages
                setTotalItems(data.totalCount);
            } else {
                throw new Error("Invalid data format received");
            }
        } catch (error) {
            toast.error("Failed to load Department data");
        } finally {
            setLoadingTable(false);
        }
    };

    return (
        <div className="p-6 h-screen ">
            <div className="card dark:bg-gray-800 shrink-0 shadow-lg w-full bg-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 sm:gap-4">
                    {/* View Data Section */}
                    <div className="p-6 bg-gray-100 dark:bg-gray-600 rounded-lg w-full flex">
                        <div className="w-full">
                            <div className="flex justify-between items-center">
                                <h2 className="mb-10 font-bold text-black dark:text-white">
                                    View Performance Review
                                </h2>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="btn btn-accent text-white"
                                >
                                    Add Performance Review
                                </button>
                            </div>

                            {/* Form Section */}
                            {showForm && (
                                <PerformanceReviewForm
                                    onClose={() => setShowForm(false)}
                                    fetchData={fetchData}
                                 />
                            )}


                            <div className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                <PerformanceReviewTable
                                    fetchData={fetchData}
                                    loadData={loadData}
                                    loadingTable={loadingTable}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    itemsPerPage={itemsPerPage}
                                    setItemsPerPage={setItemsPerPage}
                                    totalPages={totalPages}
                                    setSearchName={setEmployeeName}
                                    searchName={employeeName}
                                    totalItems={totalItems}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceReview;
