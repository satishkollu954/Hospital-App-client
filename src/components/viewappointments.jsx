import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

export function ViewAppointments() {
  const [cookies] = useCookies(["email"]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const decodedEmail = decodeURIComponent(cookies.email);
  console.log("decodedEmail", decodedEmail);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!decodedEmail) return;

    axios
      .get(`${apiUrl}/admin/appointments/doctor-email/${decodedEmail}`)
      .then((res) => {
        setAppointments(res.data);
        setCurrentPage(0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
        setLoading(false);
      });
  }, [decodedEmail]);

  if (loading) {
    return <div className="text-center mt-4">Loading appointments...</div>;
  }

  if (appointments.length === 0) {
    return <div className="text-center mt-4">No appointments found.</div>;
  }

  const offset = currentPage * itemsPerPage;
  const currentAppointments = appointments.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="container mt-2">
      <h3 className="mb-3">
        {" "}
        <Link
          className="bi bi-arrow-left-circle"
          to="/doctor-dashboard"
        ></Link>{" "}
        Your Appointments
      </h3>

      <div style={{ overflowX: "auto" }}>
        <table
          className="table table-bordered table-hover"
          style={{ minWidth: "900px" }}
        >
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Patient Name</th>
              <th>Patient Email</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reason</th>
              <th>Disease</th>
              <th>Status</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.length > 0 ? (
              currentAppointments.map((appt, index) => (
                <tr key={appt._id}>
                  <td>{index + 1}</td>
                  <td>{appt.fullName}</td>
                  <td
                    style={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      minWidth: "200px",
                    }}
                  >
                    {appt.email}
                  </td>
                  <td>{appt.phone}</td>
                  <td
                    style={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      minWidth: "100px",
                    }}
                  >
                    {new Date(appt.date)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}
                  </td>
                  <td>{appt.time}</td>
                  <td
                    style={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      minWidth: "200px",
                    }}
                  >
                    {appt.reason}
                  </td>
                  <td>{appt.disease}</td>
                  <td>{appt.status}</td>
                  <td>
                    {appt.state}, {appt.city}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={Math.ceil(appointments.length / itemsPerPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center mt-4"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>
  );
}
