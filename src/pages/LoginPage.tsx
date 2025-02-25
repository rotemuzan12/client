import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password,
      });
      
      console.log("🔍 Login API Response:", response.data); 

      const { token, userDto } = response.data;

      if (!userDto) {
        console.error("🚨 Missing user details in response!");
        alert("Login failed: Missing user details.");
        return;
      }

      if (!userDto.id) {
        console.error("🚨 Missing user id in response!");
        alert("Login failed: Missing user id.");
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userDto.id.toString());
      localStorage.setItem('firstName', userDto.firstName);
      localStorage.setItem('lastName', userDto.lastName);
      localStorage.setItem('role', userDto.role);
      if(userDto.manager) {
        localStorage.setItem('manager', userDto.manager.firstName + ' ' + userDto.manager.lastName);
      } else {
        localStorage.setItem('managerName', 'No Manager');
      }

      console.log("Stored in localStorage:", {
        token,
        userId: localStorage.getItem("userId"),
        firstName: localStorage.getItem("firstName"),
        lastName: localStorage.getItem("lastName"),
        role: localStorage.getItem("role"),
        userType: localStorage.getItem("userType"),
        managerId: localStorage.getItem("managerId"),
    });

      alert(`Welcome ${userDto.firstName} ${userDto.lastName} !`);
      
        if (userDto.userType === 'MANAGER') {
            navigate('/manager');
        } else {
            navigate('/employee');
        }
    } catch (error) {
      console.error(error);
      alert('Login failed');
    }
  };

  return (
    <div className="page">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username: </label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;