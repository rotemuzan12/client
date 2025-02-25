import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeePage() {
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [manager, setManager] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    setUserId(localStorage.getItem('userId') || '');
    setFirstName(localStorage.getItem('firstName') || '');
    setLastName(localStorage.getItem('lastName') || '');
    setRole(localStorage.getItem('role') || '');
    setManager(localStorage.getItem('manager') || 'No Manager');
    setToken(localStorage.getItem('token') || '');

  }, []);

  const handleClockIn = async () => {
    
    try {

        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); 

        console.log("🔹 Stored userId in localStorage:", userId);
        console.log("🔹 Stored token in localStorage:", token);

        if (!userId) {
            console.error("Error: userId is missing from localStorage!");
            alert("Error: userId is missing. Please log in again.");
            return;
        }

        const clockInOutRequest = {
            userId: userId, 
            reportText: "Morning shift"
        };

        console.log("🔹 Sending Request:", clockInOutRequest); 

      const response = await axios.post('http://localhost:8080/api/employee/clock-in', clockInOutRequest,
      {
        headers: {
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        }
      });
      setMessage('Clock-in success!');
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setMessage('Clock-in failed');
    }
  };

  const handleClockOut = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); 

    const requestData = {
        reportText: "End of shift summary"
    };
    
    try {
      const response = await axios.put(`http://localhost:8080/api/employee/clock-out/${userId}`,
        requestData,
        {
            headers: {
            'Authorization': `Bearer ${token}`,  
            'Content-Type': 'application/json'  
            }
        }
      );
      setMessage('Clock-out success!');
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setMessage('Clock-out failed');
    }
  };

  return (
    <div className="page">
      <h2>Employee Page</h2>
      <p><strong>Name:</strong> {firstName} {lastName}</p>
      <p><strong>Role:</strong> {role}</p>
      <p><strong>Manager:</strong> {manager}</p>
      <p>{message}</p>
      <button onClick={handleClockIn}>Clock In</button>
      <button onClick={handleClockOut}>Clock Out</button>
    </div>
  );
}

export default EmployeePage;