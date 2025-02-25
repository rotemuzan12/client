import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('BACKEND_DEVELOPER');
  const [userType, setUserType] = useState('EMPLOYEE');
  const [managerId, setManagerId] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

        const userData = {
            username,
            password,
            firstName,
            lastName,
            role,
            userType,
            managerId: userType === 'EMPLOYEE' ? managerId : null, 
          };
            console.log("👉 userData", userData);

      
      const response = await axios.post('http://localhost:8080/api/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('Registered successfully');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <label>First Name:</label>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />

        <label>Last Name:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />

        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="BACKEND_DEVELOPER">Backend Developer</option>
          <option value="CLIENT_DEVELOPER">Client Developer</option>
          <option value="FULL_STACK_DEVELOPER">Full Stack Developer</option>
        </select>

        <label>User Type:</label>
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="EMPLOYEE">Employee</option>
          <option value="MANAGER">Manager</option>
        </select>

        {/* Show Manager ID field only if "EMPLOYEE" is selected */}
        {userType === 'EMPLOYEE' && (
          <>
            <label>Manager ID:</label>
            <input type="number" value={managerId} onChange={(e) => setManagerId(e.target.value)} required />
          </>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;