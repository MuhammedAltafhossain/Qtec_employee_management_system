import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import InputField from '../inputField/inputField';
import { useOutletContext } from 'react-router-dom';
import { CiSquareRemove } from 'react-icons/ci';
import { Select } from '../selector/selector';
import useApi from '../../constants/useHookForApiCall';

const DepartmentForm = ({ onClose, fetchData }) => {
    const makeRequest = useApi();

    const [departmentName, setDepartmentName] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [employeeData, setEmployeeData] = useState([]);
    const [budget, setBudget] = useState("");

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); // State to track errors

    const modalRef = useRef();


    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        setLoading(true);
        try {
            const data = await makeRequest({
                method: "GET",
                url: 'Employees/getAllEmployeeNames',
            });

            if (data.status === 200 && Array.isArray(data.data)) {
                setEmployeeData(data.data);
            } else {
                throw new Error("Invalid data format received");
            }
        } catch (error) {
            toast.error("Failed to load Employee data");
        } finally {
            setLoading(false);
        }
    };
    const validate = () => {
        const newErrors = {};
        if (!departmentName.trim()) {
            newErrors.departmentName = "Department Name is required.";
        }

        if (!budget > 0) {
            newErrors.budget = "Budget is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        try {
            setLoading(true);
            await makeRequest({
                method: "POST", url: "Departments", data: {
                    departmentName,
                    budget,
                    managerId : employeeId
                }
            });
            toast.success("Depatment added successfully.");
            onClose();
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div ref={modalRef} className="bg-white dark:bg-gray-700 p-6 rounded-lg w-full max-w-3xl relative">
                <div className='flex justify-between items-center'>
                    <h2 className="text-lg font-bold mb-4">Add New Department</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        aria-label="Close"
                    >
                        <CiSquareRemove size={32} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField
                            label="Department Name"
                            type="text"
                            value={departmentName}
                            onChange={(e) => {
                                setDepartmentName(e.target.value);
                                setErrors((prevErrors) => ({ ...prevErrors, departmentName: undefined }));
                            }}
                            placeholder="Department Name"
                            error={errors.departmentName}
                        />

                        <InputField
                            label="Budget"
                            type="number"
                            value={budget}
                            onChange={(e) => {
                                setBudget(e.target.value);
                                setErrors((prevErrors) => ({ ...prevErrors, budget: undefined }));
                            }}
                            placeholder="Budget"
                            error={errors.budget}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <Select
                            label="Employee"
                            options={[
                                { text: "Select Employee", value: "" }, // First option with value ""
                                ...employeeData.map((employee) => ({
                                    text: employee.name,
                                    value: employee.id,
                                })),
                            ]}
                            value={employeeId ?? ""}
                            onChange={(value) => setEmployeeId(value)}
                            key={employeeId ?? "default"}
                            error={errors.employeeId}
                        />


                    </div>







                    <div className="flex gap-4 mt-6">
                        <button className="btn btn-primary text-white w-1/4" disabled={loading}>
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                        <button type="button" onClick={onClose} className="btn btn-danger text-white w-1/4">
                            Close
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default DepartmentForm;
