import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Home } from "./components/home";
import { About } from "./components/about-us";
import { Treatment } from "./components/treatments";
import { ContactUs } from "./components/contact-us";
import { Appointment } from "./components/appointment";
import { Doctors } from "./components/doctors";
import { Location } from "./components/locations";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboard } from "./components/admindashboard";
import { AddLocation } from "./components/AddLocation";
import { ProtectRoute } from "./components/protectroute";
import { AddDoctors } from "./components/addDoctors";
import { AllQueries } from "./components/AllQueries";
import { DoctorProfile } from "./components/doctorProfile";
import { ForgetPassword } from "./components/forgetPassword";
import { AddDiseases } from "./components/AddDiseases";
import { DoctorDashboard } from "./components/doctorDashboard";
import { ALLDoctors } from "./components/viewAllDoctors";
import { ALLDiseases } from "./components/viewAllDiseases";
import { ALLLocations } from "./components/viewAllLocations";
import { ViewAppointments } from "./components/viewappointments";
import { DoctorInformation } from "./components/doctorInformation";
import { AddFAQ } from "./components/addFAQ";
import { Unauthorized } from "./components/unauthorized";
import ViewLeaves from "./components/viewleaves";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useCookies } from "react-cookie";
import { Emergency } from "./components/Emergency";
import RescheduleAppointment from "./components/RescheduleAppointment";

function App() {
  const { t } = useTranslation();
  const [cookies] = useCookies(["email", "role"]);
  const isPublicRoute = !cookies.role;

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        {/* Header */}
        <header className="bg-color text-white shadow-sm">
          <nav className="navbar navbar-expand-md navbar-light container-fluid px-4">
            <a
              className="navbar-brand"
              target="_blank"
              href="https://raagvitech.com/"
            >
              <img
                src="/hospital.png"
                alt="Hospital Logo"
                style={{ height: "60px", marginRight: "10px", color: "black" }}
              />
            </a>{" "}
            <Link
              to="/"
              className="navbar-brand fw-bold mt-1"
              style={{
                fontSize: "1.8rem",
                color: "white",
                textShadow: "1px 1px 2px rgba(255, 255, 255, 0.3)",
              }}
            >
              {t("brand")}
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarNav"
            >
              <ul className="navbar-nav text-center fw-normal">
                <li className="nav-item">
                  <Link to="/" className="nav-link text-white">
                    {t("nav.home")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link text-white">
                    {t("nav.about")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/treatments" className="nav-link text-white">
                    {t("nav.treatments")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/doctors" className="nav-link text-white">
                    {t("nav.doctors")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/contact" className="nav-link text-white">
                    {t("nav.contact")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/location" className="nav-link text-white">
                    {t("nav.location")}
                  </Link>
                </li>
                {isPublicRoute && (
                  <li className="nav-item dropdown">
                    <button
                      className="btn btn-sm btn-light dropdown-toggle mx-2 mt-1"
                      data-bs-toggle="dropdown"
                    >
                      Languages
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => i18n.changeLanguage("en")}
                        >
                          English
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => i18n.changeLanguage("hi")}
                        >
                          हिन्दी
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => i18n.changeLanguage("te")}
                        >
                          తెలుగు
                        </button>
                      </li>
                    </ul>
                  </li>
                )}
                {isPublicRoute && (
                  <Link
                    to="/emergency"
                    className="text-white fw-bold px-3 py-2 mb-1 me-2 rounded d-inline-block text-decoration-none boxshadow border-0"
                    style={{ cursor: "pointer" }}
                  >
                    {t("nav.bookEmergency")}{" "}
                    <span className="ms-2">&rarr;</span>
                  </Link>
                )}
                {cookies.role === "admin" && (
                  <li className="nav-item">
                    <Link to="/admin-dashboard" className="nav-link text-white">
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                {cookies.role === "doctor" && (
                  <li className="nav-item">
                    <Link
                      to="/doctor-dashboard"
                      className="nav-link text-white"
                    >
                      Doctor Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </header>

        {/* Main content user routes*/}
        <main className="flex-grow-1 container-fluid py-4 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="treatments" element={<Treatment />} />
            <Route path="appointment" element={<Appointment />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="/doctor/:email" element={<DoctorInformation />} />
            <Route path="location" element={<Location />} />
            <Route path="login" element={<AdminLogin />} />
            <Route path="forgetPassword" element={<ForgetPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="emergency" element={<Emergency />} />
            <Route
              path="/reschedule/:token"
              element={<RescheduleAppointment />}
            />

            {/* Doctor related routes */}
            <Route
              path="doctor-profile"
              element={
                <ProtectRoute allowedRole="doctor">
                  <DoctorProfile />
                </ProtectRoute>
              }
            />
            <Route
              path="doctor-appointments"
              element={
                <ProtectRoute allowedRole="doctor">
                  <ViewAppointments />
                </ProtectRoute>
              }
            />

            <Route
              path="doctor-dashboard"
              element={
                <ProtectRoute allowedRole="doctor">
                  <DoctorDashboard />
                </ProtectRoute>
              }
            />

            {/* Admin related routes*/}
            <Route
              path="admin-dashboard"
              element={
                <ProtectRoute allowedRole="admin">
                  <AdminDashboard />
                </ProtectRoute>
              }
            />
            <Route
              path="all-locations"
              element={
                <ProtectRoute allowedRole="admin">
                  <ALLLocations />
                </ProtectRoute>
              }
            />

            <Route
              path="all-diseases"
              element={
                <ProtectRoute allowedRole="admin">
                  <ALLDiseases />
                </ProtectRoute>
              }
            />
            <Route
              path="all-doctors"
              element={
                <ProtectRoute allowedRole="admin">
                  <ALLDoctors />
                </ProtectRoute>
              }
            />
            <Route
              path="faq"
              element={
                <ProtectRoute allowedRole="admin">
                  <AddFAQ />
                </ProtectRoute>
              }
            />
            <Route
              path="leaves"
              element={
                <ProtectRoute>
                  <ViewLeaves />
                </ProtectRoute>
              }
            />
            <Route
              path="add-disease"
              element={
                <ProtectRoute allowedRole="admin">
                  <AddDiseases />
                </ProtectRoute>
              }
            />
            <Route
              path="add-location"
              element={
                <ProtectRoute allowedRole="admin">
                  <AddLocation />
                </ProtectRoute>
              }
            />
            <Route
              path="add-doctor"
              element={
                <ProtectRoute allowedRole="admin">
                  <AddDoctors />
                </ProtectRoute>
              }
            />
            <Route
              path="queries"
              element={
                <ProtectRoute allowedRole="admin">
                  <AllQueries />
                </ProtectRoute>
              }
            />

            {/* unspecified route*/}
            <Route
              path="*"
              element={
                <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
                  <h1 className="display-4 text-danger">404</h1>
                  <h3>Looking for something?</h3>
                  <p className="text-muted">
                    We are sorry, the page you requested could not be found.
                  </p>
                  <a href="/" className="btn btn-primary mt-3">
                    Go to Home
                  </a>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-footer text-white py-5 mt-auto">
          <div className="container-fluid px-5">
            <div className="row">
              {/* Left Side: Existing content */}
              <div className="col-md-6 mb-3">
                <p className="mb-2">{t("footer.tagline")}</p>
                <p className="mb-1">
                  &copy; {new Date().getFullYear()} RaagviCare. All rights
                  reserved.
                </p>

                <div>
                  <a
                    href="https://www.facebook.com/Raagvitech"
                    rel="noreferrer"
                    className="text-white me-3"
                  >
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a
                    href="https://x.com/raagvi_tech"
                    rel="noreferrer"
                    target="_blank"
                    className="text-white me-3"
                  >
                    <i className="bi bi-twitter"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/raagvitech/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white me-3"
                  >
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/raagvitech/posts/?feedView=all"
                    className="text-white me-3"
                  >
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>

              {/* Right Side: New Content */}
              <div className="col-md-6">
                <h5 className="fw-bold mb-2">About RaagviCare</h5>
                <p className="mb-2" style={{ maxWidth: "400px" }}>
                  RaagviCare is dedicated to providing quality healthcare
                  services with a team of experienced doctors, modern
                  technology, and patient-first approach. We aim to make
                  healthcare accessible, efficient, and caring.
                </p>

                <div className="row mt-4">
                  <div className="col-sm-6">
                    <h6 className="fw-bold">Quick Links</h6>
                    <ul className="list-unstyled">
                      <li>
                        <a
                          href="/about"
                          className="text-white text-decoration-none"
                        >
                          About Us
                        </a>
                      </li>
                      <li>
                        <a
                          href="/contact"
                          className="text-white text-decoration-none"
                        >
                          Contact
                        </a>
                      </li>

                      <li>
                        <a
                          href="/contact"
                          className="text-white text-decoration-none"
                        >
                          FAQs
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-sm-6">
                    <h6 className="fw-bold">Contact Us</h6>
                    <p className="mb-1">RaagviCare Pvt. Ltd.</p>
                    <p className="mb-1">
                      123 Health Street, Hyderabad, Telangana
                    </p>
                    <p className="mb-1">Email: raagvicare@gmail.com</p>
                    <p className="mb-0">Phone: +91 XXXXXXXXXX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
