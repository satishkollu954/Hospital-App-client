import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import "./doctordashboard.css";

export function DoctorDashboard() {
  const [cookies, , removeCookie] = useCookies(["email", "role"]);
  const navigate = useNavigate();
  const decodedEmail = decodeURIComponent(cookies.email);
  const apiUrl = process.env.REACT_APP_API_URL;

  const [doctor, setDoctor] = useState(null);
  const [appointmentStats, setAppointmentStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveStats, setLeaveStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    fromDate: "",
    toDate: "",
    reason: "",
  });

  // Fetch leave requests periodically
  useEffect(() => {
    if (!decodedEmail) return;

    const fetchLeaves = () => {
      axios
        .get(`${apiUrl}/doctor/leave/${decodedEmail}`)
        .then((res) => {
          setLeaveRequests(res.data);
          const stats = { total: 0, pending: 0, approved: 0, rejected: 0 };
          res.data.forEach((l) => {
            stats.total++;
            stats[l.status.toLowerCase()]++;
          });
          setLeaveStats(stats);
        })
        .catch((err) => console.error("Failed to fetch leave requests", err));
    };

    fetchLeaves(); // Initial fetch
    const interval = setInterval(fetchLeaves, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [decodedEmail]);

  useEffect(() => {
    if (decodedEmail) {
      axios
        .get(`${apiUrl}/admin/appointments/count/${decodedEmail}`)
        .then((res) => setAppointmentStats(res.data))
        .catch((err) =>
          console.error("Failed to fetch appointment stats", err)
        );
    }
  }, [decodedEmail]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/admin/doctor/${decodedEmail}`)
      .then((res) => setDoctor(res.data))
      .catch((err) => console.error("Failed to load doctor info", err));
  }, [decodedEmail]);

  const handleLogoutClick = () => {
    toast.success("Signed out successfully", {
      onClose: () => {
        removeCookie("email", { path: "/" });
        removeCookie("role", { path: "/" });
        navigate("/login");
      },
      autoClose: 10,
    });
  };

  const openLeaveModal = () => setShowLeaveModal(true);
  const closeLeaveModal = () => {
    setShowLeaveModal(false);
    setLeaveForm({ fromDate: "", toDate: "", reason: "" });
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/doctor/leave`, {
        doctorEmail: decodedEmail,
        ...leaveForm,
      });
      toast.success("Leave requested Submitted");
      closeLeaveModal();
    } catch (err) {
      console.log(err);
      console.error(err);
      if (err.status === 409) {
        toast.error(err.response.data.message);
        return;
      }
      toast.error("Failed to request leave", 5000);
    }
  };

  return (
    <div className="container mt-1">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Top Buttons */}
      <div className="d-flex justify-content-end mb-3 dashboard-buttons gap-2 flex-wrap">
        <Link className="btn btn-primary mt-2" to="/doctor-appointments">
          View Appointments
        </Link>
        <Link className="btn btn-primary mt-2" to="/doctor-profile">
          Profile
        </Link>
        <button onClick={handleLogoutClick} className="btn btn-danger">
          Logout
        </button>
      </div>

      <h2 className="mb-4">Welcome, {doctor?.Name || "Doctor"}!</h2>

      <div className="row">
        {/* Appointments */}
        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-4 doctor-card">
            <h5>Total Appointments</h5>
            <h2 className="text-primary">{appointmentStats.total}</h2>
            <div className="mt-3">
              <span className="badge bg-warning me-2">
                Pending: {appointmentStats.pending}
              </span>
              <span className="badge bg-success">
                Completed: {appointmentStats.completed}
              </span>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-4 doctor-card">
            <h5>Availability</h5>
            <span
              className={`badge fs-6 ${
                doctor?.Availability ? "bg-success" : "bg-secondary"
              }`}
            >
              {doctor?.Availability ? "Available" : "Not Available"}
            </span>
          </div>
        </div>

        {/* Working Hours */}
        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-4 doctor-card">
            <h5>Working Hours</h5>
            <p className="fs-5">
              {doctor?.From || "--"} to {doctor?.To || "--"}
            </p>
          </div>
        </div>

        {/* Leave Requests */}
        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-4 doctor-card">
            <h5>Leave Requests</h5>
            <h2 className="text-primary">{leaveStats.total}</h2>
            <div className="mt-2">
              <span className="badge bg-warning me-1">
                Pending: {leaveStats.pending}
              </span>
              <span className="badge bg-success me-1">
                Approved: {leaveStats.approved}
              </span>
              <span className="badge bg-danger">
                Rejected: {leaveStats.rejected}
              </span>
            </div>
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button
                className="btn btn-outline-primary"
                onClick={openLeaveModal}
              >
                Request Leave
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={() => setShowViewModal(true)}
              >
                View Requests
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-light rounded shadow-sm">
        <p className="mb-0">
          This is your personal space to manage appointments, view and update
          your profile, and check your working schedule. Stay connected with
          your patients and manage your availability efficiently. You can also
          request leaves, monitor appointment statuses in real time, and keep
          track of your daily working hours. Use this dashboard to stay
          organized, ensure timely patient care, and maintain a smooth workflow
          throughout your day.
        </p>
      </div>

      {/* Request Leave Modal */}
      <Modal show={showLeaveModal} onHide={closeLeaveModal}>
        <Modal.Header closeButton>
          <Modal.Title>Request Leave</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleLeaveSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                required
                value={leaveForm.fromDate}
                onChange={(e) =>
                  setLeaveForm((f) => ({ ...f, fromDate: e.target.value }))
                }
                min={new Date().toISOString().split("T")[0]}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                required
                value={leaveForm.toDate}
                onChange={(e) =>
                  setLeaveForm((f) => ({ ...f, toDate: e.target.value }))
                }
                min={
                  leaveForm.fromDate || new Date().toISOString().split("T")[0]
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                value={leaveForm.reason}
                onChange={(e) =>
                  setLeaveForm((f) => ({ ...f, reason: e.target.value }))
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeLeaveModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Request
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* View Requests Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>My Leave Requests</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {leaveRequests.length === 0 ? (
            <p>No leave requests found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped text-center align-middle">
                <thead className="table-light">
                  <tr>
                    <th>S.No</th>
                    <th>Reason</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((leave, index) => (
                    <tr key={leave._id}>
                      <td>{index + 1}</td>
                      <td>{leave.reason}</td>
                      <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                      <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge ${
                            leave.status === "Approved"
                              ? "bg-success"
                              : leave.status === "Rejected"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
