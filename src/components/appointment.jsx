import { useFormik } from "formik";
import "./appointment.css";
import axios from "axios";
import * as yup from "yup";
import { useEffect, useState } from "react";
import SlotSelector from "./SlotSelector";
import { ToastContainer, toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

export function Appointment() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [slotsMessage, setSlotsMessage] = useState("");
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [states, setStates] = useState([]);
  const [city, setCities] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [isOtpLoading, setIsOtpLoading] = useState(false); // Spinner for OTP
  const [isBooking, setIsBooking] = useState(false); // Spinner for booking
  const apiUrl = process.env.REACT_APP_API_URL;

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      disease: "",
      state: "",
      city: "",
      date: "",
      doctor: "",
      time: "",
      reason: "",
    },
    validationSchema: yup.object({
      fullName: yup.string().required("Name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      phone: yup
        .string()
        .required("Mobile is required")
        .matches(/^\d{10}$/, "Invalid mobile number"),
      state: yup.string().required("State is required"),
      city: yup.string().required("City is required"),
      disease: yup.string().required("Disease is required"),
      doctor: yup.string().required("Doctor is required"),
      date: yup
        .date()
        .min(today, "Date cannot be in the past")
        .required("Date is required"),
    }),
    onSubmit: (user, { resetForm }) => {
      if (!emailVerified) {
        toast.error("Please verify your email before submitting.");
        return;
      }

      if (!selectedSlot) {
        toast.error("Please select a time slot.");
        return;
      }

      const updatedUser = { ...user, time: selectedSlot };
      setIsBooking(true); // Show spinner

      axios
        .post(`${apiUrl}/api/appointment`, updatedUser)
        .then(() => {
          toast.success("Appointment successful...");
          resetForm();
          setEmailVerified(false);
          setOtpVisible(false);
          setOtp("");
          setSelectedSlot("");
        })
        .catch(() => {
          toast.error("Appointment failed. Please try again.");
        })
        .finally(() => setIsBooking(false)); // Hide spinner
    },
  });

  useEffect(() => {
    setSlotsMessage("");
  }, [formik.values.date, formik.values.doctor]);

  useEffect(() => {
    if (formik.values.city && formik.values.disease) {
      axios
        .get(`${apiUrl}/doctor/finddoctors`, {
          params: {
            city: formik.values.city,
            Specialization: formik.values.disease,
          },
        })
        .then((res) => {
          const result = res.data.doctors || res.data || [];
          console.log("result==> ", result);
          setDoctors(result);
        })
        .catch(() => setDoctors([]));
    } else {
      setDoctors([]);
    }
  }, [formik.values.city, formik.values.disease]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/admin/states`)
      .then((res) => setStates(res.data))
      .catch(() => setStates([]));
  }, []);

  useEffect(() => {
    axios
      .get(`${apiUrl}/admin/getdisease`)
      .then((res) => setDiseases(res.data))
      .catch(() => setDiseases([]));
  }, []);

  const handleOtpClick = () => {
    const Email = formik.values.email;
    if (!Email) {
      toast.error("Please enter an email before sending OTP.");
      return;
    }

    setIsOtpLoading(true);

    axios
      .post(`${apiUrl}/admin/send-otp`, { Email })
      .then(() => {
        toast.success("OTP sent to email");
        setOtpVisible(true);
      })
      .catch(() => toast.error("Failed to send OTP"))
      .finally(() => setIsOtpLoading(false));
  };

  const handleVerifyOtp = () => {
    axios
      .post(`${apiUrl}/admin/verify-otp`, {
        Email: formik.values.email,
        Otp: otp.trim(),
      })
      .then((res) => {
        if (res.data.success) {
          toast.success("Email verified successfully!");
          setEmailVerified(true);
        } else {
          toast.error("Invalid OTP. Try again.");
        }
      })
      .catch(() => toast.error("OTP verification failed."));
  };

  return (
    <div className="container-fluid px-0">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="app-img mb-4"></div>

      <div className="px-4">
        <form onSubmit={formik.handleSubmit}>
          <div className="row g-3">
            {/* Full Name */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullName}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-danger">{formik.errors.fullName}</p>
              )}
            </div>
            {/* Email */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                disabled={emailVerified}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-danger">{formik.errors.email}</p>
              )}
              {!emailVerified && (
                <button
                  type="button"
                  className="btn btn-warning mt-1 d-flex align-items-center gap-2"
                  onClick={handleOtpClick}
                  disabled={isOtpLoading}
                >
                  {isOtpLoading && (
                    <Spinner animation="border" size="sm" className="me-1" />
                  )}
                  Send OTP
                </button>
              )}
              {emailVerified && (
                <span className="text-success d-block mt-1 fw-bold">
                  Email Verified
                </span>
              )}
            </div>
            {/* Phone */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Mobile</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-danger">{formik.errors.phone}</p>
              )}
            </div>
            {/* OTP Field */}
            {otpVisible && !emailVerified && (
              <div className="col-md-4">
                <label className="form-label fw-bold">Enter OTP</label>
                <input
                  type="text"
                  className="form-control"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\s+/g, ""))}
                />
                <button
                  type="button"
                  className="btn btn-success mt-1 w-100"
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </button>
              </div>
            )}
            {/* State, City, Disease, Date, Doctor */}
            {/* [rest of your select and input fields as you already have them...] */}
            {/* State */}
            <div className="col-md-4">
              <label className="form-label fw-bold">State</label>
              <select
                name="state"
                className="form-control"
                onChange={(e) => {
                  const selectedState = e.target.value;
                  formik.handleChange(e);
                  formik.setFieldValue("city", "");
                  axios
                    .get(`${apiUrl}/admin/cities`, {
                      params: { state: selectedState },
                    })
                    .then((res) => setCities(res.data))
                    .catch(() => setCities([]));
                }}
                value={formik.values.state}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            {/* City */}
            <div className="col-md-4">
              <label className="form-label fw-bold">City</label>
              <select
                name="city"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.city}
                disabled={!city.length}
              >
                <option value="">Select City</option>
                {city.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            {/* Disease */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Disease</label>
              <select
                name="disease"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.disease}
              >
                <option value="">Select Disease</option>
                {diseases.map((d) => (
                  <option key={d._id} value={d.disease}>
                    {d.disease}
                  </option>
                ))}
              </select>
            </div>
            {/* Date */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Date</label>
              <input
                type="date"
                name="date"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.date}
                min={new Date().toISOString().split("T")[0]}
              />
              {formik.touched.date && formik.errors.date && (
                <p className="text-danger">{formik.errors.date}</p>
              )}
            </div>
            {/* Doctor */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Doctor</label>
              <select
                name="doctor"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.doctor}
                disabled={!Array.isArray(doctors) || doctors.length === 0}
              >
                <option value="">Select Doctor</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc.Name}>
                    {doc.Name}
                  </option>
                ))}
              </select>
              {formik.touched.doctor && formik.errors.doctor && (
                <p className="text-danger">{formik.errors.doctor}</p>
              )}
            </div>{" "}
            <br />
            {/* Slots */}
            <div className="col-md-12">
              {formik.values.date &&
                formik.values.doctor &&
                (() => {
                  const selectedDoctor = doctors.find(
                    (d) => d.Name === formik.values.doctor
                  );

                  if (!selectedDoctor) return null;

                  return (
                    <>
                      <SlotSelector
                        doctorEmail={selectedDoctor.Email}
                        selectedDate={formik.values.date}
                        selectedSlot={selectedSlot}
                        onSlotSelect={(slot) => setSelectedSlot(slot)}
                        onMessage={setSlotsMessage}
                      />
                      {slotsMessage && (
                        <p className="text-danger fw-bold mt-2">
                          {slotsMessage}
                        </p>
                      )}
                    </>
                  );
                })()}
            </div>
            {/* Reason */}
            <div className="col-md-12">
              <label className="form-label fw-bold">Reason</label>
              <textarea
                className="form-control w-50"
                name="reason"
                rows="3"
                placeholder="Brief description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.reason}
              ></textarea>
            </div>
            {/* Submit Button */}
            <div className="col-md-12">
              <button
                type="submit"
                className="btn btn-primary w-50 d-flex justify-content-center align-items-center gap-2"
                disabled={isBooking}
              >
                {isBooking && (
                  <Spinner
                    animation="border"
                    size="sm"
                    role="status"
                    className="me-1"
                  />
                )}
                Book Appointment
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
