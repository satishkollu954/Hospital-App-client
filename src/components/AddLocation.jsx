import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddLocation.css";
import { ToastContainer, toast } from "react-toastify";

export const AddLocation = () => {
  const [State, setState] = useState("");
  const [branches, setBranches] = useState([
    { name: "", mapUrl: "", phone: "" },
  ]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleBranchChange = (index, field, value) => {
    const updatedBranches = [...branches];
    updatedBranches[index][field] = value;
    setBranches(updatedBranches);
  };

  const addBranch = () => {
    setBranches([...branches, { name: "", mapUrl: "", phone: "" }]);
  };

  const removeBranch = (index) => {
    const updated = branches.filter((_, i) => i !== index);
    setBranches(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const filledBranches = branches.filter((b) => b.name && b.mapUrl);

    if (!State || filledBranches.length === 0) {
      return setError("Please enter city and at least one complete branch.");
    }

    try {
      await axios.post(`${apiUrl}/admin/locations`, {
        State,
        branches: filledBranches,
      });
      setMessage("Location added successfully!");
      setState("");
      setBranches([{ name: "", mapUrl: "" }]);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add location. Try again."
      );
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h2 className="text-center text-primary mb-4">Add Hospital Location</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">
        <div className="mb-3">
          <label className="form-label">State Name</label>
          <input
            type="text"
            className="form-control"
            value={State}
            onChange={(e) => setState(e.target.value)}
            placeholder="Enter city name"
            required
          />
        </div>

        <h5 className="mt-4 mb-2">Branches</h5>
        {branches.map((branch, index) => (
          <div
            key={index}
            className="border p-3 rounded mb-3 position-relative branch-box"
          >
            <div className="row">
              <div className="col-md-5 mb-2">
                <label className="form-label">City Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={branch.name}
                  onChange={(e) =>
                    handleBranchChange(index, "name", e.target.value)
                  }
                  placeholder="e.g., RaagviCare - Banashankari"
                />
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={branch.phone}
                  onChange={(e) =>
                    handleBranchChange(index, "phone", e.target.value)
                  }
                  placeholder="e.g., +91-XXXXXXX"
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">Google Map URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={branch.mapUrl}
                  onChange={(e) =>
                    handleBranchChange(index, "mapUrl", e.target.value)
                  }
                  placeholder="https://www.google.com/maps?q=..."
                />
              </div>
              <div className="col-md-1 d-flex align-items-end justify-content-end">
                {branches.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removeBranch(index)}
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={addBranch}
        >
          + Add Another Branch
        </button>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            type="button"
            className="btn btn-outline-primary px-4 py-2 mt-4 me-4"
            onClick={() => navigate(-1)}
          >
            Back to Home
          </button>
          <button type="submit" className="btn btn-primary px-4 py-2">
            Save Location
          </button>
        </div>
      </form>
    </div>
  );
};
