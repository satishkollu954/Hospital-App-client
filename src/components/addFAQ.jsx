import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export function AddFAQ() {
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [editingId, setEditingId] = useState(null);
  const [editedFaq, setEditedFaq] = useState({});
  const [originalFaq, setOriginalFaq] = useState({});
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = () => {
    axios
      .get(`${apiUrl}/admin/faq`)
      .then((res) => setFaqs(res.data))
      .catch(() => toast.error("Failed to load FAQs"));
  };

  const handleAdd = () => {
    if (!newFaq.question || !newFaq.answer) {
      toast.warn("Both fields are required");
      return;
    }

    axios
      .post(`${apiUrl}/admin/faq`, newFaq)
      .then(() => {
        toast.success("FAQ added");
        setNewFaq({ question: "", answer: "" });
        fetchFaqs();
      })
      .catch(() => toast.error("Failed to add FAQ"));
  };

  const handleEdit = (faq) => {
    setEditingId(faq._id);
    setEditedFaq({ question: faq.question, answer: faq.answer });
    setOriginalFaq({ question: faq.question, answer: faq.answer });
  };

  const handleUpdate = (id) => {
    axios
      .put(`${apiUrl}/admin/faq/${id}`, editedFaq)
      .then(() => {
        toast.success("FAQ updated");
        setEditingId(null);
        fetchFaqs();
      })
      .catch(() => toast.error("Failed to update FAQ"));
  };

  const handleDelete = (id) => {
    axios
      .delete(`${apiUrl}/admin/faq/${id}`)
      .then(() => {
        toast.success("FAQ deleted");
        fetchFaqs();
      })
      .catch(() => toast.error("Failed to delete FAQ"));
  };

  const isModified = () =>
    editedFaq.question !== originalFaq.question ||
    editedFaq.answer !== originalFaq.answer;

  return (
    <div className="container mt-5">
      <Link to="/admin-dashboard" className="btn btn-primary me-4">
        Back
      </Link>
      <ToastContainer />
      <h3 className="mb-4">Manage FAQs</h3>

      {/* Add new FAQ */}
      <div className="mb-4">
        <Form.Control
          placeholder="Enter Question"
          className="mb-2"
          value={newFaq.question}
          onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
        />
        <Form.Control
          placeholder="Enter Answer"
          className="mb-2"
          value={newFaq.answer}
          onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
        />

        <Button variant="success" onClick={handleAdd}>
          Add FAQ
        </Button>
      </div>

      {/* Display Existing FAQs */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Question</th>
            <th>Answer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((faq, idx) => (
            <tr key={faq._id}>
              <td>{idx + 1}</td>
              <td>
                {editingId === faq._id ? (
                  <Form.Control
                    value={editedFaq.question}
                    onChange={(e) =>
                      setEditedFaq({ ...editedFaq, question: e.target.value })
                    }
                  />
                ) : (
                  faq.question
                )}
              </td>
              <td>
                {editingId === faq._id ? (
                  <Form.Control
                    value={editedFaq.answer}
                    onChange={(e) =>
                      setEditedFaq({ ...editedFaq, answer: e.target.value })
                    }
                  />
                ) : (
                  faq.answer
                )}
              </td>
              <td>
                {editingId === faq._id ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdate(faq._id)}
                    disabled={!isModified()}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(faq)}
                  >
                    Edit
                  </Button>
                )}{" "}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(faq._id)}
                  className="mb-2"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
