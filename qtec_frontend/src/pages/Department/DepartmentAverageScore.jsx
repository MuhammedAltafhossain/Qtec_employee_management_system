import React, { useEffect, useState } from "react";
import useApi from "../../constants/useHookForApiCall";
import toast from "react-hot-toast";
import EmployeeTable from "../../components/department/DepartmentTable";
import DepartmentForm from "../../components/department/DepartmentForm";
import { Select } from "../../components/selector/selector";
import DepartmentAverageTable from "../../components/DepartmentAverage/DepartmentAverageTable";

const DepartmentAverageScore = () => {
    const makeRequest = useApi();
    const [loadData, setloadData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [departmentData, setDepartmentData] = useState([]);
    const [departmentId, setDepartmentId] = useState([]);

     const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchDepatment()
    }, []);

 

    const fetchDepatment = async () => {
        setLoading(true);
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
            setLoading(false);
        }
    };

    const handleFilterSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const data = await makeRequest({
                method: "GET",
                url: `Departments/departmentAverage/${departmentId}`,
            });

            if (data.status === 200 && Array.isArray(data.data)) {
                setloadData(data.data);
            } else {
                throw new Error("Invalid data format received");
            }
        } catch (error) {
            toast.error("Failed to load Department data");
        } finally {
            setLoading(false);
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
                                    View Department Average Score
                                </h2>

                            </div>

                            <div className="flex justify-center items-center mb-10">
                                <form
                                    onSubmit={handleFilterSubmit}
                                    className="flex flex-row flex-wrap items-center gap-4"
                                >
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
                                <DepartmentAverageTable
                                    loadData={loadData}
                                    loadingTable={loading}
                                 />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentAverageScore;
