import axios from "axios";
import { useEffect, useState } from "react";
import "./AllQueries.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export function AllQueries() {
  const [state, setState] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQueryId, setSelectedQueryId] = useState(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admin/Allqueries`);
      // Add status field to each query (for dropdown control)
      const updatedData = res.data.map((item) => ({
        ...item,
        status: "Pending",
      }));
      setState(updatedData);
    } catch (err) {
      console.error("Error fetching queries:", err);
    }
  };

  const confirmDelete = (id) => {
    setSelectedQueryId(id);
    setShowModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`${apiUrl}/admin/deletequery/${selectedQueryId}`);
      setState((prev) => prev.filter((query) => query._id !== selectedQueryId));
      toast.success("Query deleted successfully");
    } catch (err) {
      console.error("Error deleting query:", err);
      toast.error("Failed to delete query");
    } finally {
      setShowModal(false);
      setSelectedQueryId(null);
    }
  };

  const handleCancelDelete = () => {
    // Revert status back to Pending
    setState((prev) =>
      prev.map((item) =>
        item._id === selectedQueryId ? { ...item, status: "Pending" } : item
      )
    );
    setShowModal(false);
    setSelectedQueryId(null);
  };

  return (
    <div className="container my-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        Back
      </button>

      <h3 className="text-center mb-4">User Queries</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-hover shadow-sm rounded">
          <thead className="table-primary text-center">
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile No.</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {state.map((data, index) => (
              <tr key={data._id || index}>
                <td>{data.fullName}</td>
                <td>{data.email}</td>
                <td>{data.contact}</td>
                <td className="text-wrap message-cell">{data.message}</td>
                <td className="text-center">
                  <select
                    className="form-select"
                    value={data.status}
                    onChange={(e) => {
                      const selected = e.target.value;
                      if (selected === "Solved") {
                        confirmDelete(data._id);
                        // Temporarily change status to "Solved" (can revert if cancelled)
                        setState((prev) =>
                          prev.map((item) =>
                            item._id === data._id
                              ? { ...item, status: "Solved" }
                              : item
                          )
                        );
                      }
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Solved">Solved</option>
                  </select>
                </td>
              </tr>
            ))}
            {state.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No queries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCancelDelete}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this query?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleCancelDelete}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger mt-3"
                  onClick={handleDeleteConfirmed}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
