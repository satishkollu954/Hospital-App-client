import React, { useState } from "react";
import "./AdminLogin.css"; // Custom styles (optional)
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";

export const AdminLogin = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [cookie, setCookie] = useCookies(["email", "role"]);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${apiUrl}/admin/login`, loginData);
      console.log("======", loginData);
      console.log(res.data);
      if (res.data.success) {
        setCookie("email", loginData.email, { path: "/" });

        // Set the role based on the email
        const role = loginData.email === "admin@gmail.com" ? "admin" : "doctor";
        setCookie("role", role, { path: "/" });

        toast.success("Login successful");

        setTimeout(() => {
          if (role === "admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/doctor-dashboard");
          }
        }, 700);
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Check credentials.");
    }
  };

  return (
    <div className="admin-login-bg d-flex justify-content-center align-items-center">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="card p-4 shadow-lg admin-login-card">
        <h3 className="text-center mb-4">Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              required
              placeholder="Enter Email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Log In
            </button>
          </div>
          <div className="mt-2">
            <Link to="/forgetPassword">Forget password</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
