import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";

export function DoctorInformation() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (email) {
      axios
        .get(`${apiUrl}/admin/doctor/${email}`)
        .then((res) => setDoctor(res.data))
        .catch(() => alert("Doctor not found"))
        .finally(() => setLoading(false));
    }
  }, [email]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center mt-5 text-danger">
        Doctor not found.
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline-dark ms-3"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="mb-2">
        <button
          className="btn btn-outline-secondary me-3 ms-1"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <Link
          to="/appointment"
          className="text-white fw-bold px-3 py-2 rounded  d-inline-block text-decoration-none boxshadow border-0"
          style={{ cursor: "pointer" }}
        >
          Book an Appointment <span className="ms-2">&rarr;</span>
        </Link>
      </div>

      <div className="card shadow p-4">
        <div className="text-center">
          <img
            src={`${apiUrl}/uploads/${doctor.image}`}
            alt="Doctor"
            className="rounded-circle mb-3"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
          <h3>{doctor.Name}</h3>
          <p className="text-muted">{doctor.Designation}</p>
          <p className="text-primary">{doctor.Specialization}</p>
        </div>
        <hr />
        <div className="row mt-3">
          <div className="col-md-6">
            <p>
              <strong>Email:</strong> {doctor.Email}
            </p>
            <p>
              <strong>Address:</strong> {doctor.Address}
            </p>
            <p>
              <strong>Age:</strong> {doctor.Age}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Qualification:</strong> {doctor.Qualification}
            </p>
            <p>
              <strong>Experience:</strong> {doctor.Experience} Years
            </p>
          </div>
        </div>
        <div className="mt-3">
          <h5>Brief Profile</h5>
          <p>{doctor.BriefProfile}</p>
        </div>
        {doctor.Languages?.length > 0 && (
          <div className="mt-3">
            <h5>Languages Spoken</h5>
            <ul>
              {doctor.Languages.map((lang, index) => (
                <li key={index}>{lang}</li>
              ))}
            </ul>
          </div>
        )}

        {doctor.Education?.length > 0 && (
          <div className="mt-3">
            <h5>Education</h5>
            <ul className="list-group">
              {doctor.Education.map((edu, index) => (
                <li key={index} className="list-group-item">
                  <strong>{edu.degree}</strong> from {edu.institution} (
                  {edu.year})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
