import React, { useEffect, useState } from "react";
import InputField from "../../components/inputField/inputField";
import EmployeeForm from "../../components/employee/EmployeeForm";
import useApi from "../../constants/useHookForApiCall";
import toast from "react-hot-toast";
import EmployeeTable from "../../components/employee/EmployeeTable";
import { Select } from "../../components/selector/selector";

const Employee = () => {
    const makeRequest = useApi();
    const [loadData, setloadData] = useState([]);
    const [loadingTable, setLoadingTable] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [totalItems, setTotalItems] = useState(1);
    const [employeeName, setEmployeeName] = useState("");
    const [employeeNameSearch, setEmployeeNameSearch] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [departmentData, setDepartmentData] = useState([]);
    const [position, setPosition] = useState("");
    const [minScore, setMinScore] = useState("");
    const [maxScore, setMaxScore] = useState("");

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchData();
        fetchDepatment();
    }, [currentPage, itemsPerPage, employeeName]);

    const fetchData = async () => {
        setLoadingTable(true);
        try {
            const data = await makeRequest({
                method: "GET",
                url: `Employees/search?name=${employeeName || employeeNameSearch}&departmentId=${departmentId}&position=${position}&minScore=${minScore}&maxScore=${maxScore}&page=${currentPage}&pageSize=${itemsPerPage}`,
            });
            if (data.status === 200 && Array.isArray(data.employees)) {
                setloadData(data.employees);
                setTotalPages(Math.ceil(data.totalItems / itemsPerPage)); // Calculate and set total pages
                setTotalItems(data.totalItems);
            } else {
                throw new Error("Invalid data format received");
            }
        } catch (error) {
            toast.error("Failed to load Employee data");
        } finally {
            setLoadingTable(false);
        }
    };

    const fetchDepatment = async () => {
        setLoadingTable(true);
        try {
            const data = await makeRequest({
                method: "GET",
                url: 'Departments',
            });

            
            if (data.status == 200 && Array.isArray(data.data)) {
                setDepartmentData(data.data);
            } else {
                throw new Error("Invalid data format received");
            }
        } catch (error) {
            toast.error("Failed to load Department data");
        } finally {
            setLoadingTable(false);
        }
    };

    const handleFilterSubmit = (e) => { 
        e.preventDefault();
        if (loading) return;

        let hasError = false;
        const newErrors = {};

        if (minScore !== "" && isNaN(Number(minScore))) {
            newErrors.minScore = "Min Score must be a number";
            hasError = true;
        }

        if (maxScore !== "" && isNaN(Number(maxScore))) {
            newErrors.maxScore = "Max Score must be a number";
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        fetchData();
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
                                    View Employee
                                </h2>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="btn btn-accent text-white"
                                >
                                    Add Product
                                </button>
                            </div>

                            {/* Form Section */}
                            {showForm && (
                                <EmployeeForm
                                     onClose={() => setShowForm(false)}
                                    fetchData={fetchData}
                                    departmentData={departmentData}
                                />
                            )}

                            <div className="flex justify-center items-center mb-10">
                                <form
                                    onSubmit={handleFilterSubmit}
                                    className="flex flex-row flex-wrap items-center gap-4"
                                >
                                    {/* Employee Name Input */}
                                    <InputField
                                        label="Employee Name"
                                        type="text"
                                        value={employeeNameSearch}
                                        onChange={(e) => {
                                            setEmployeeNameSearch(e.target.value);
                                            setErrors((prevErrors) => ({
                                                ...prevErrors,
                                                employeeNameSearch: undefined,
                                            }));
                                        }}
                                        placeholder="Employee Name"
                                        error={errors.employeeNameSearch}
                                    />

                                    <InputField
                                        label="Position"
                                        type="text"
                                        value={position}
                                        onChange={(e) => {
                                            setPosition(e.target.value);
                                            setErrors((prevErrors) => ({
                                                ...prevErrors,
                                                setPosition: undefined,
                                            }));
                                        }}
                                        placeholder="Position"
                                        error={errors.position}
                                    />

                                    {/* Department Select */}
                                    <div className="w-56">
                                        <Select
                                            className="w-56"
                                            label="Department"
                                            options={[
                                                { text: "Select Department", value: "" }, // First option with value ""
                                                ...departmentData.map((department) => ({
                                                    text: department.departmentName,
                                                    value: department.id,
                                                })),
                                            ]}
                                            value={departmentId ?? ""}
                                            onChange={(value) => setDepartmentId(value)}
                                            key={departmentId ?? "default_role"}
                                        />
                                    </div>
                                    



                                    {/* Min Score Input */}
                                    <InputField
                                        label="Min Score"
                                        type="text"
                                        value={minScore}
                                        onChange={(e) => {
                                            setMinScore(e.target.value);
                                            setErrors((prevErrors) => ({
                                                ...prevErrors,
                                                minScore: undefined,
                                            }));
                                        }}
                                        placeholder="Min Score"
                                        error={errors.minScore}
                                    />

                                    {/* Max Score Input */}
                                    <InputField
                                        label="Max Score"
                                        type="text"
                                        value={maxScore}
                                        onChange={(e) => {
                                            setMaxScore(e.target.value);
                                            setErrors((prevErrors) => ({
                                                ...prevErrors,
                                                maxScore: undefined,
                                            }));
                                        }}
                                        placeholder="Max Score"
                                        error={errors.maxScore}
                                    />

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary text-white mt-6"
                                        disabled={loading}
                                    >
                                        {loading ? "Searching..." : "Search"}
                                    </button>
                                </form>
                            </div>

                            <div className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                <EmployeeTable
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

export default Employee;
