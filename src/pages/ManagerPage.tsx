import React, { useState, useEffect } from "react";
import axios from "axios";

interface Timesheet {
    id: number;
    employee: {
        firstName: string;
        lastName: string;
    };
    date: string;
    startTime: string;
    endTime: string;
    reportText: string;
    status: string;
}

const ManagerPage = () => {
    const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
    const [manager, setManager] = useState<{ firstName: string; lastName: string } | null>(null);

    useEffect(() => {
        fetchTimesheets();
        fetchManagerDetails();
    }, []);

    const fetchTimesheets = async () => {
        try {
            const token = localStorage.getItem("token");
            const managerId = localStorage.getItem("userId");

            if (!managerId) {
                alert("Manager ID is missing!");
                return;
            }

            const response = await axios.get(
                `http://localhost:8080/api/manager/${managerId}/timesheets`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            setTimesheets(response.data);
        } catch (err) {
            console.error("Fetching Timesheets Error:", err);
        }
    };

    const fetchManagerDetails = async () => {
    
        const firstName = localStorage.getItem("firstName") || "";
        const lastName = localStorage.getItem("lastName") || "";
        setManager({ firstName, lastName });
    };

    const handleApprove = async (timesheetId: number) => {
        try {
            const token = localStorage.getItem("token");
            const managerId = localStorage.getItem("userId");

            if (!managerId) {
                alert("Manager ID is missing!");
                return;
            }

            await axios.put(
                `http://localhost:8080/api/manager/${managerId}/timesheets/${timesheetId}/approve`,
                {},
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            alert("Timesheet Approved!");
            fetchTimesheets();
        } catch (err) {
            console.error("Approve Error:", err);
            alert("Failed to approve timesheet!");
        }
    };

    const handleReject = async (timesheetId: number) => {
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;

        try {
            const token = localStorage.getItem("token");
            const managerId = localStorage.getItem("userId");

            if (!managerId) {
                alert("Manager ID is missing!");
                return;
            }

            await axios.put(
                `http://localhost:8080/api/manager/${managerId}/timesheets/${timesheetId}/reject`,
                { reason },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            alert("Timesheet Rejected!");
            fetchTimesheets();
        } catch (err) {
            console.error("Reject Error:", err);
            alert("Failed to reject timesheet!");
        }
    };

    return (
        <div>
            <h2>Manager Dashboard</h2>

            {timesheets.length === 0 ? (
                <div>
                    {manager && (
                        <div>
                            <h3>Manager Details</h3>
                            <p>
                                <strong>Name:</strong> {manager.firstName} {manager.lastName}
                            </p>
                        </div>
                    )}
                    <p>No timesheets available for approval.</p>
                </div>
            ) : (
                <table border={1}>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Report</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timesheets.map((timesheet) => (
                            <tr key={timesheet.id}>
                                <td>{timesheet.employee.firstName} {timesheet.employee.lastName}</td>
                                <td>{timesheet.date}</td>
                                <td>{timesheet.startTime}</td>
                                <td>{timesheet.endTime}</td>
                                <td>{timesheet.reportText}</td>
                                <td>{timesheet.status}</td>
                                <td>
                                    {timesheet.status === "PENDING" && (
                                        <>
                                            <button onClick={() => handleApprove(timesheet.id)}>✅ Approve</button>
                                            <button onClick={() => handleReject(timesheet.id)}>❌ Reject</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ManagerPage;
