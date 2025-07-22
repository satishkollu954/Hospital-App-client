import React, { useState, useEffect } from "react";
import axios from "axios";
import "./addDoctors.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export function AddDoctors() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: "",
    About: "",
    Email: "",
    Designation: "",
    Specialization: "",
    Age: "",
    State: "",
    City: "",
    From: "",
    FromPeriod: "AM",
    To: "",
    ToPeriod: "PM",
    Availability: true,
    Qualification: "",
    Experience: "",
    BriefProfile: "",
    Address: "",
    Education: [],
    Languages: [],
  });

  const [languageInput, setLanguageInput] = useState("");
  const [image, setImage] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/admin/states`)
      .then((res) => setStates(res.data))
      .catch((err) => console.error("Error fetching states:", err));
  }, []);

  useEffect(() => {
    if (selectedState) {
      axios
        .get(`${apiUrl}/admin/cities`, {
          params: { state: selectedState },
        })
        .then((res) => setCities(res.data))
        .catch((err) => console.error("Error fetching cities:", err));
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "Availability" ? value === "true" : value,
    }));

    if (name === "State") {
      setSelectedState(value);
      setFormData((prev) => ({ ...prev, City: "" }));
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const formatTime = (time) => {
    if (!time.includes(":")) {
      return `${time.padStart(2, "0")}:00`;
    }
    return time;
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      Education: [...prev.Education, { degree: "", institution: "", year: "" }],
    }));
  };

  const removeEducation = (index) => {
    const updated = [...formData.Education];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, Education: updated }));
  };

  const handleEducationChange = (index, key, value) => {
    const updated = [...formData.Education];
    updated[index][key] = value;
    setFormData((prev) => ({ ...prev, Education: updated }));
  };

  const handleLanguageAdd = () => {
    if (languageInput.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        Languages: [...prev.Languages, languageInput.trim()],
      }));
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang) => {
    setFormData((prev) => ({
      ...prev,
      Languages: prev.Languages.filter((l) => l !== lang),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      const finalFormData = {
        ...formData,
        From: `${formatTime(formData.From)} ${formData.FromPeriod}`,
        To: `${formatTime(formData.To)} ${formData.ToPeriod}`,
      };

      delete finalFormData.FromPeriod;
      delete finalFormData.ToPeriod;

      data.append("image", image);

      for (const key in finalFormData) {
        const value = finalFormData[key];

        if (Array.isArray(value) || typeof value === "object") {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      }

      console.log("Submitting Doctor Data =>", finalFormData);

      const res = await axios.post(`${apiUrl}/admin/adddoctors`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Doctor added successfully");
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 800);
    } catch (err) {
      console.error("Doctor Add Error:", err);
      toast.error(
        err.response?.data?.message ||
          "Something went wrong while adding doctor."
      );
      // alert(
      //   err.response?.data?.message ||
      //     "Something went wrong while adding doctor."
      // );
    }
  };

  return (
    <div className="add-doc-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h2 className="text-center mb-4">Add Doctor</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row">
          {[
            "Name",
            "Email",
            "Designation",
            "Specialization",
            "Age",
            "About",
            "Qualification",
            "Experience",
            "BriefProfile",
            "Address",
          ].map((field, idx) => (
            <div key={idx} className="col-md-4 form-group">
              <label>
                {field.replace(/([A-Z])/g, " $1").trim()}
                {["Name", "Email", "Designation", "Specialization"].includes(
                  field
                ) && <span className="text-danger"> *</span>}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleTextChange}
                className="form-control"
                required={[
                  "Name",
                  "Email",
                  "Designation",
                  "Specialization",
                ].includes(field)}
              />
            </div>
          ))}

          {/* Languages */}
          <div className="col-md-4 form-group">
            <label>Languages</label>
            <div className="d-flex">
              <input
                type="text"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                className="form-control me-2"
                placeholder="Add Language"
              />
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={handleLanguageAdd}
              >
                +
              </button>
            </div>
            <div className="mt-2">
              {formData.Languages.map((lang, i) => (
                <span key={i} className="badge bg-primary me-2">
                  {lang}{" "}
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => removeLanguage(lang)}
                  >
                    ×
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* State & City */}
          <div className="col-md-4 form-group">
            <label>State</label>
            <select
              name="State"
              className="form-control"
              value={formData.State}
              onChange={handleTextChange}
              required
            >
              <option value="">Select State</option>
              {states.map((state, idx) => (
                <option key={idx} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 form-group">
            <label>City</label>
            <select
              name="City"
              className="form-control"
              value={formData.City}
              onChange={handleTextChange}
              required
            >
              <option value="">Select City</option>
              {cities.map((city, idx) => (
                <option key={idx} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Timing */}
          <div className="col-md-4 form-group">
            <label>From</label>
            <div className="d-flex">
              <input
                type="text"
                name="From"
                value={formData.From}
                onChange={handleTextChange}
                className="form-control me-2"
                placeholder="HH:MM"
              />
              <select
                name="FromPeriod"
                value={formData.FromPeriod}
                onChange={handleTextChange}
                className="form-control"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div className="col-md-4 form-group">
            <label>To</label>
            <div className="d-flex">
              <input
                type="text"
                name="To"
                value={formData.To}
                onChange={handleTextChange}
                className="form-control me-2"
                placeholder="HH:MM"
              />
              <select
                name="ToPeriod"
                value={formData.ToPeriod}
                onChange={handleTextChange}
                className="form-control"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          {/* Availability */}
          <div className="col-md-4 form-group">
            <label>Availability</label>
            <select
              name="Availability"
              value={formData.Availability}
              onChange={handleTextChange}
              className="form-control"
            >
              <option value={true}>Available</option>
              <option value={false}>Not Available</option>
            </select>
          </div>

          {/* Image */}
          <div className="col-md-4 form-group">
            <label>Upload Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>

          {/* Learn More */}
          {/* <div className="col-12 mb-3">
            <label className="form-label fw-bold">Learn More URL</label>
            <input
              type="url"
              name="Learnmore"
              value={formData.Learnmore}
              onChange={handleTextChange}
              className="form-control"
              placeholder="https://example.com/learn-more"
            />
          </div> */}

          {/* Education */}
          <div className="col-12 mb-4">
            <label className="form-label fw-bold">Education</label>
            <br />
            {formData.Education.map((edu, index) => (
              <div
                key={index}
                className="row g-2 align-items-center mb-2 border rounded p-2"
              >
                <div className="col-md-4">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                    className="form-control"
                    placeholder="Degree (e.g. MBBS)"
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        "institution",
                        e.target.value
                      )
                    }
                    className="form-control"
                    placeholder="Institution"
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) =>
                      handleEducationChange(index, "year", e.target.value)
                    }
                    className="form-control"
                    placeholder="Year"
                  />
                </div>
                <div className="col-md-1 text-end">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removeEducation(index)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary btn-sm mt-2"
              onClick={addEducation}
            >
              + Add Education
            </button>
          </div>
        </div>

        <div className="button-row mt-4 d-flex gap-3">
          <button
            type="button"
            className="btn btn-secondary w-50"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button type="submit" className="btn btn-primary w-50">
            Add Doctor
          </button>
        </div>
      </form>
    </div>
  );
}
