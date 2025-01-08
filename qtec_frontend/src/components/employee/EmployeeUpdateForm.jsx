import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import InputField from '../inputField/inputField';
import { CiSquareRemove } from 'react-icons/ci';
import { Select } from '../selector/selector';
import useApi from '../../constants/useHookForApiCall';

const EmployeeUpdateForm = ({ onClose, fetchData, employeeData }) => {
    const makeRequest = useApi();
     const [name, setName] = useState(employeeData?.name || "");
    const [phone, setPhone] = useState(employeeData?.phone || "");
    const [departmentId, setDepartmentId] = useState(employeeData?.departmentId || "");
    const [joiningDate, setJoiningDate] = useState(employeeData?.joiningDate?.split("T")[0] || new Date().toISOString().split("T")[0]);
    const [email, setEmail] = useState(employeeData?.email || "");
    const [position, setPosition] = useState(employeeData?.position || "");
    const [departmentData, setDepartmentData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); // State to track errors

    const modalRef = useRef();

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

    useEffect(() => {
        fetchDepatment();
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "Employee Name is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) newErrors.email = "Valid email is required.";
        if (!phone.trim() || phone.length < 10) newErrors.phone = "Valid phone number is required.";
        if (!departmentId) newErrors.departmentId = "Department is required.";
        if (!position.trim()) newErrors.position = "Position is required.";
        if (!joiningDate.trim()) newErrors.joiningDate = "Joining Date is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);
            await makeRequest({
                method: "PUT",
                url: `/Employees/Update/${employeeData?.id}`,
                data: {
                    name,
                    email,
                    phone,
                    departmentId,
                    position,
                    joiningDate,
                },
            });
            toast.success("Employee updated successfully.");
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
                    <h2 className="text-lg font-bold mb-4">Update Employee Details</h2>
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
                            label="Employee Name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
                            }}
                            placeholder="Employee Name"
                            error={errors.name}
                        />

                        <InputField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
                            }}
                            placeholder="Email"
                            error={errors.email}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField
                            label="Phone"
                            type="text"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                setErrors((prevErrors) => ({ ...prevErrors, phone: undefined }));
                            }}
                            placeholder="Phone"
                            error={errors.phone}
                        />

                        <Select
                            label="Department"
                            options={[
                                { text: "Select Department", value: "" }, // Default option
                                ...departmentData.map((department) => ({
                                    text: department.departmentName, // Label
                                    value: department.id,           // ID
                                })),
                            ]}
                            value={departmentId || ""} // Ensure departmentId is initialized correctly
                            onChange={(value) => {
                                setDepartmentId(value); // Update the state with the selected value
                                setErrors((prevErrors) => ({ ...prevErrors, departmentId: undefined }));
                            }}
                            error={errors.departmentId}
                        />

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField
                            label="Position"
                            type="text"
                            value={position}
                            onChange={(e) => {
                                setPosition(e.target.value);
                                setErrors((prevErrors) => ({ ...prevErrors, position: undefined }));
                            }}
                            placeholder="Position"
                            error={errors.position}
                        />

                        <InputField
                            label="Joining Date"
                            type="date"
                            value={joiningDate}
                            onChange={(e) => {
                                setJoiningDate(e.target.value);
                                setErrors((prevErrors) => ({ ...prevErrors, joiningDate: undefined }));
                            }}
                            placeholder="Joining Date"
                            error={errors.joiningDate}
                        />
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button className="btn btn-primary text-white w-1/4" disabled={loading}>
                            {loading ? "Updating..." : "Update"}
                        </button>
                        <button type="button" onClick={onClose} className="btn btn-danger text-white w-1/4">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeUpdateForm;
