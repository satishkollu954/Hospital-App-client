import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  Table,
  Button,
  Form,
  Spinner,
  Pagination,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const API_BASE = `${apiUrl}/admin/leave`;

export default function ViewLeaves() {
  const navigate = useNavigate();
  /* ───────────── state ──────────── */
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  /* pagination */
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  /* search */
  const [searchTerm, setSearchTerm] = useState("");

  /* ───────────── data fetch ──────────── */
  const loadLeaves = (email = "") => {
    setLoading(true);
    const url =
      email.trim() === ""
        ? API_BASE
        : `${API_BASE}?email=${encodeURIComponent(email.trim())}`;

    axios
      .get(url)
      .then((res) => {
        setLeaves(res.data);
        setPage(1); // reset to first page on new search
      })
      .catch(() => toast.error("Failed to load leaves"))
      .finally(() => setLoading(false));
  };

  useEffect(() => loadLeaves(), []);

  /* ───────────── crud ──────────── */
  const updateStatus = async (leaveId, status) => {
    try {
      await axios.put(`${API_BASE}/${leaveId}`, { status });
      toast.success("Status updated");
      setLeaves((prev) =>
        prev.map((l) => (l._id === leaveId ? { ...l, status } : l))
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  const deleteLeave = async (leaveId) => {
    if (!window.confirm("Delete this leave request?")) return;
    try {
      await axios.delete(`${API_BASE}/${leaveId}`);
      toast.success("Deleted");
      setLeaves((prev) => prev.filter((l) => l._id !== leaveId));
    } catch {
      toast.error("Failed to delete");
    }
  };

  /* ───────────── pagination helpers ──────────── */
  const pages = Math.ceil(leaves.length / itemsPerPage) || 1;
  const pagedLeaves = leaves.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  /* ───────────── search handlers ──────────── */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadLeaves(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm("");
    loadLeaves("");
  };

  /* ───────────── render ──────────── */
  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline-secondary mb-4"
      >
        ← Back
      </button>
      <h2 className="mb-4">All Doctor Leave Requests</h2>

      {/* search bar */}
      <Form onSubmit={handleSearchSubmit} className="mb-3">
        <Row className="g-2">
          <Col xs={12} md={6} lg={4}>
            <InputGroup>
              <Form.Control
                placeholder="Search by doctor email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Button type="submit" variant="primary  mb-5">
              Search
            </Button>
            <Button
              type="submit"
              variant="primary ms-3 mb-5"
              onClick={clearSearch}
              disabled={searchTerm.trim() === ""}
            >
              Clear
            </Button>
          </Col>
        </Row>
      </Form>

      {/* table */}
      {loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" />
        </div>
      ) : leaves.length === 0 ? (
        <p className="text-muted">No leave requests.</p>
      ) : (
        <>
          <Table bordered hover responsive className="align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Doctor Email</th>
                <th>Reason</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {pagedLeaves.map((leave, idx) => (
                <tr key={leave._id}>
                  <td>{(page - 1) * itemsPerPage + idx + 1}</td>
                  <td>{leave.doctorEmail}</td>
                  <td style={{ maxWidth: 300, whiteSpace: "pre-wrap" }}>
                    {leave.reason}
                  </td>
                  <td>
                    {new Date(leave.fromDate)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}
                  </td>
                  <td>
                    {new Date(leave.toDate)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}
                  </td>
                  <td>
                    <Form.Select
                      size="sm"
                      value={leave.status}
                      onChange={(e) => updateStatus(leave._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </Form.Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* pagination */}
          {pages > 1 && (
            <Row>
              <Col className="d-flex justify-content-center">
                <Pagination>
                  <Pagination.Prev
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  />
                  {[...Array(pages)].map((_, i) => (
                    <Pagination.Item
                      key={i}
                      active={i + 1 === page}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    disabled={page === pages}
                    onClick={() => setPage(page + 1)}
                  />
                </Pagination>
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
}
