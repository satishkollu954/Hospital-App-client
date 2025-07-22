import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export function ALLDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [originalDoctor, setOriginalDoctor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDoctorEmail, setSelectedDoctorEmail] = useState(null);
  const doctorsPerPage = 8;

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/admin/alldoctors`)
      .then((res) => {
        setDoctors(res.data);
        setFilteredDoctors(res.data);
      })
      .catch((err) => console.error("Error fetching doctors", err));
  }, []);

  const handleViewClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditDoctor(null);
    setOriginalDoctor(null);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = doctors.filter((doc) =>
      doc.Name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditDoctor({ ...selectedDoctor });
    setOriginalDoctor({ ...selectedDoctor });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const isDoctorChanged = () => {
    return JSON.stringify(editDoctor) !== JSON.stringify(originalDoctor);
  };

  const handleEditSave = () => {
    axios
      .put(`${apiUrl}/admin/updatedoctor/${editDoctor.Email}`, editDoctor)
      .then(() => {
        toast.success("Doctor updated successfully");

        const updatedList = doctors.map((doc) =>
          doc.Email === editDoctor.Email ? editDoctor : doc
        );
        setDoctors(updatedList);
        setFilteredDoctors(updatedList);
        setIsEditing(false);
        setEditDoctor(null);
        setOriginalDoctor(null);
        setShowModal(false);
      })
      .catch(() => alert("Update failed"));
  };

  const confirmDeleteDoctor = (email) => {
    setShowModal(false); // 👈 Close the existing view/edit modal
    setSelectedDoctorEmail(email);
    setShowConfirmModal(true); // Then open the delete confirmation modal
  };

  const handleDelete = () => {
    axios
      .delete(`${apiUrl}/admin/deletedoctor/${selectedDoctorEmail}`)
      .then(() => {
        const updatedList = doctors.filter(
          (doc) => doc.Email !== selectedDoctorEmail
        );
        setDoctors(updatedList);
        setFilteredDoctors(updatedList);
        toast.success("Doctor deleted successfully");
      })
      .catch(() => toast.error("Failed to delete doctor"))
      .finally(() => {
        setShowConfirmModal(false);
        setSelectedDoctorEmail(null);
      });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <h3 className="mb-3">
        <Link
          to="/admin-dashboard"
          className="bi bi-arrow-left-circle fs-3"
        ></Link>{" "}
        All Doctors
      </h3>
      <div>
        <Form.Control
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={handleSearch}
          className="mb-4 w-50"
        />
      </div>
      <div className="container-fluid">
        <div className="row g-4">
          {currentDoctors.map((doctor, index) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={`${apiUrl}/uploads/${doctor.image}`}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{doctor.Name}</Card.Title>
                  <Card.Text>
                    <strong>Specialization:</strong> {doctor.Specialization}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => handleViewClick(doctor)}
                  >
                    View
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedDoctor?.Name}'s Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isEditing && editDoctor ? (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="Name"
                  value={editDoctor.Name}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  name="Designation"
                  value={editDoctor.Designation}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Specialization</Form.Label>
                <Form.Control
                  name="Specialization"
                  value={editDoctor.Specialization}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>State</Form.Label>
                <Form.Control
                  name="State"
                  value={editDoctor.State}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>City</Form.Label>
                <Form.Control
                  name="City"
                  value={editDoctor.City}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>From</Form.Label>
                <Form.Control
                  name="From"
                  value={editDoctor.From}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>To</Form.Label>
                <Form.Control
                  name="To"
                  value={editDoctor.To}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>About</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="About"
                  value={editDoctor.About}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </>
          ) : selectedDoctor ? (
            <>
              <p>
                <strong>Email:</strong> {selectedDoctor.Email}
              </p>
              <p>
                <strong>Designation:</strong> {selectedDoctor.Designation}
              </p>
              <p>
                <strong>Specialization:</strong> {selectedDoctor.Specialization}
              </p>
              <p>
                <strong>Age:</strong> {selectedDoctor.Age}
              </p>
              <p>
                <strong>State:</strong> {selectedDoctor.State}
              </p>
              <p>
                <strong>City:</strong> {selectedDoctor.City}
              </p>
              <p>
                <strong>Timing:</strong> {selectedDoctor.From} -{" "}
                {selectedDoctor.To}
              </p>
              <p>
                <strong>About:</strong> {selectedDoctor.About}
              </p>
            </>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          {isEditing ? (
            <>
              <Button
                variant="success"
                onClick={handleEditSave}
                disabled={!isDoctorChanged()}
              >
                Save
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="warning" onClick={handleEditClick}>
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => confirmDeleteDoctor(selectedDoctor.Email)}
              >
                Remove
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <div className="d-flex justify-content-center mt-4">
        <Button
          variant="secondary"
          className="me-2"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="align-self-center">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
      {showConfirmModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this doctor?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger mt-3" onClick={handleDelete}>
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
