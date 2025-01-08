import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import InputField from "../inputField/inputField";
import { CiSquareRemove } from "react-icons/ci";
import { Select } from "../selector/selector";
import useApi from "../../constants/useHookForApiCall";
import TextAreaField from "../textAreaField/textAreaField";

const PerformanceReviewUpdateForm = ({
    onClose,
    fetchData,
    performanceReviewData,
}) => {
    const makeRequest = useApi();

    const [employeeId, setEmployeeId] = useState(
        performanceReviewData?.employeeId || ""
    );
    const [reviewDate, setReviewDate] = useState(
        performanceReviewData?.reviewDate?.split("T")[0] ||
        new Date().toISOString().split("T")[0]
    );

    const [reviewScore, setReviewScore] = useState(
        performanceReviewData?.reviewScore || ""
    );
    const [reviewNotes, setReviewNotes] = useState(
        performanceReviewData?.reviewNotes || ""
    );
    const [employeeData, setEmployeeData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const modalRef = useRef();

    const fetchEmployeeData = async () => {
        setLoading(true);
        try {
            const data = await makeRequest({
                method: "GET",
                url: "Employees/getAllEmployeeNames",
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

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!employeeId) {
            newErrors.employeeId = "Employee Name is required.";
        }
        if (
            !reviewScore.trim() ||
            isNaN(reviewScore) ||
            reviewScore < 1 ||
            reviewScore > 10
        ) {
            newErrors.reviewScore = "Review score must be a number between 1 and 10.";
        }
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
                url: `/PerformanceReviews/Update/${performanceReviewData?.id}`,
                data: {
                    employeeId,
                    reviewDate,
                    reviewScore,
                    reviewNotes,
                },
            });
            toast.success("Performance Review updated successfully.");
            onClose();
            fetchData();
        } catch (error) {
            toast.error(error.response?.error || "Error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg w-full max-w-3xl relative"
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold mb-4">Update Performance Review</h2>
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
                        <InputField
                            label="Review Date"
                            type="date"
                            value={reviewDate}
                            onChange={(e) => {
                                setReviewDate(e.target.value);
                                setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    reviewDate: undefined,
                                }));
                            }}
                            placeholder="Review Date"
                            error={errors.reviewDate}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField
                            label="Review Score"
                            type="number"
                            value={reviewScore}
                            onChange={(e) => {
                                setReviewScore(e.target.value);
                                setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    reviewScore: undefined,
                                }));
                            }}
                            placeholder="Review Score"
                            error={errors.reviewScore}
                        />
                        <TextAreaField
                            label="Review Note"
                            type="text"
                            value={reviewNotes}
                            onChange={(e) => {
                                setReviewNotes(e.target.value);
                                setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    reviewNotes: undefined,
                                }));
                            }}
                            placeholder="Review Note"
                            error={errors.reviewNotes}
                        />
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            className="btn btn-primary text-white w-1/4"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-danger text-white w-1/4"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PerformanceReviewUpdateForm;
