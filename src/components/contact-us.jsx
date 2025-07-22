import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./contact-us.css";
import { Spinner } from "react-bootstrap";

export function ContactUs() {
  const { t, i18n } = useTranslation();
  console.log("ttt=> ", t, "i18n===> ", i18n);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    message: "",
  });

  const apiUrl = process.env.REACT_APP_API_URL;
  const [faqList, setFaqList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const faqsPerPage = 5;

  /* ───────── Fetch FAQs ───────── */
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/admin/faq")
  //     .then((res) => setFaqList(res.data))
  //     .catch((err) => {
  //       console.error("Failed to fetch FAQs:", err);
  //       setFaqList([]);
  //     });
  // }, []);

  useEffect(() => {
    const controller = new AbortController(); // 👈 cleanup helper

    axios
      .get(`${apiUrl}/admin/faq`, {
        params: { lang: i18n.language }, // hi | te | en | …
        signal: controller.signal,
      })
      .then((res) => setFaqList(res.data))
      .catch((err) => {
        if (err.name !== "CanceledError") {
          console.error("Failed to fetch FAQs:", err);
          setFaqList([]);
        }
      });

    return () => controller.abort(); // cancel if component unmounts
  }, [i18n.language]);

  /* ───────── Form handlers ───────── */
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSending) return; // Prevent multiple submissions
    setIsSending(true);
    axios
      .post(`${apiUrl}/api/contactus`, formData)
      .then(() => {
        toast.success(t("contact.toastSuccess"));
        setFormData({ fullName: "", email: "", contact: "", message: "" });
      })
      .catch((err) => {
        toast.error(t("contact.toastError"));
        console.error(err);
      })
      .finally(() => {
        setIsSending(false);
        setCurrentPage(1); // Reset to first page after submission
      });
  };

  /* ───────── Pagination ───────── */
  const totalPages = Math.ceil(faqList.length / faqsPerPage);
  const indexOfLastFaq = currentPage * faqsPerPage;
  const indexOfFirstFaq = indexOfLastFaq - faqsPerPage;
  const currentFaqs = faqList.slice(indexOfFirstFaq, indexOfLastFaq);

  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  /* ───────── JSX ───────── */
  return (
    <div className="contact-bg d-flex align-items-center justify-content-center py-5">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="contact-card card shadow-lg p-4">
        <h2 className="text-center mb-4 text-primary">{t("contact.title")}</h2>

        {/* ─── Contact Form ─── */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">
              {t("contact.fullName")}
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person-fill"></i>
              </span>
              <input
                type="text"
                className="form-control"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder={t("contact.placeholderName")}
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              {t("contact.email")}
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope-fill"></i>
              </span>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t("contact.placeholderEmail")}
              />
            </div>
          </div>

          {/* Contact */}
          <div className="mb-3">
            <label htmlFor="contact" className="form-label">
              {t("contact.contactNumber")}
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-telephone-fill"></i>
              </span>
              <input
                type="tel"
                className="form-control"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                placeholder={t("contact.placeholderContact")}
              />
            </div>
          </div>

          {/* Message */}
          <div className="mb-4">
            <label htmlFor="message" className="form-label">
              {t("contact.message")}
            </label>
            <textarea
              className="form-control"
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder={t("contact.placeholderMessage")}
            />
          </div>

          {/* Submit */}
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isSending}
            >
              <i className="bi bi-send-fill me-2"></i>
              {isSending && (
                <Spinner
                  animation="border"
                  size="sm"
                  role="status"
                  className="me-1"
                />
              )}
              {t("contact.send")}
            </button>
          </div>
        </form>

        {/* ─── FAQ Section ─── */}
        <div className="mt-5">
          <h4 className="text-primary mb-3">{t("contact.faq")}</h4>

          <div className="accordion" id="faqAccordion">
            {currentFaqs.map((faq, idx) => {
              const globalIndex = indexOfFirstFaq + idx;
              return (
                <div className="accordion-item" key={globalIndex}>
                  <h2 className="accordion-header" id={`heading${globalIndex}`}>
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${globalIndex}`}
                      aria-expanded="false"
                      aria-controls={`collapse${globalIndex}`}
                    >
                      {faq.question}
                    </button>
                  </h2>
                  <div
                    id={`collapse${globalIndex}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading${globalIndex}`}
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">{faq.answer}</div>
                  </div>
                </div>
              );
            })}

            {faqList.length === 0 && (
              <p className="text-muted">{t("contact.noFaqs")}</p>
            )}
          </div>

          {/* Pagination */}
          {faqList.length > faqsPerPage && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button
                className="btn btn-outline-primary"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
              >
                {t("contact.prev")}
              </button>
              <span className="text-muted">
                {t("contact.page", { current: currentPage, total: totalPages })}
              </span>
              <button
                className="btn btn-outline-primary"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                {t("contact.next")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
