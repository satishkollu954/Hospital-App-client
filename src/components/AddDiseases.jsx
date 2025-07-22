import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function AddDiseases() {
  const [formData, setFormData] = useState({
    disease: "",
    description: "",
    learnmore: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.disease || !formData.description || !formData.learnmore) {
      setMessage("Please fill in all fields.");
      return;
    }

    axios
      .post(`${apiUrl}/admin/adddisease`, formData)
      .then(() => {
        setMessage("Treatment added successfully!");
        setFormData({ disease: "", description: "", learnmore: "" });
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to add treatment. Please try again.");
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <form
            onSubmit={handleSubmit}
            className="border p-4 shadow rounded bg-light"
          >
            {/* Back Button */}
            <button
              type="button"
              className="btn btn-secondary mb-3"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>

            {message && (
              <div className="alert alert-info mt-3" role="alert">
                {message}
              </div>
            )}

            <h3 className="mb-4 text-center">Add Treatment</h3>

            <div className="mb-3">
              <label className="form-label fw-bold">Name of the disease</label>
              <input
                type="text"
                name="disease"
                value={formData.disease}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. Heart Surgery"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter description of the treatment"
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Learn More URL</label>
              <input
                type="url"
                name="learnmore"
                value={formData.learnmore}
                onChange={handleChange}
                className="form-control"
                placeholder="https://example.com/learn-more"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Add Treatment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
