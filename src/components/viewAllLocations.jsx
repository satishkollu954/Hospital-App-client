import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

export function ALLLocations() {
  const [locations, setLocations] = useState([]);
  const [editBranch, setEditBranch] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: "state" | "branch", state: ..., branchId?: ... }
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = () => {
    axios
      .get(`${apiUrl}/admin/locations`)
      .then((res) => setLocations(res.data))
      .catch((err) => toast.error("Error fetching locations"));
  };

  const confirmDelete = (target) => {
    setDeleteTarget(target);
    setShowConfirmModal(true);
  };

  const handleConfirmedDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "state") {
      axios
        .delete(
          `${apiUrl}/admin/locations/${encodeURIComponent(deleteTarget.state)}`
        )
        .then(() => {
          toast.success("State deleted successfully");
          fetchLocations();
        })
        .catch(() => toast.error("Error deleting state"))
        .finally(() => setShowConfirmModal(false));
    } else if (deleteTarget.type === "branch") {
      axios
        .delete(
          `${apiUrl}/admin/locations/${encodeURIComponent(
            deleteTarget.state
          )}/branches/${encodeURIComponent(deleteTarget.branchName)}`
        )
        .then(() => {
          toast.success("Branch deleted successfully");
          fetchLocations();
        })
        .catch(() => toast.error("Error deleting branch"))
        .finally(() => setShowConfirmModal(false));
    }
  };

  const handleEditChange = (branchId, key, value) => {
    setEditBranch((prev) => {
      const original = prev[branchId]?.original || {
        name: locations
          .flatMap((l) => l.branches)
          .find((b) => b._id === branchId)?.name,
        phone: locations
          .flatMap((l) => l.branches)
          .find((b) => b._id === branchId)?.phone,
        mapUrl: locations
          .flatMap((l) => l.branches)
          .find((b) => b._id === branchId)?.mapUrl,
      };

      return {
        ...prev,
        [branchId]: {
          ...prev[branchId],
          original,
          [key]: value,
        },
      };
    });
  };

  const handleUpdateBranch = (state, branch) => {
    const updated = editBranch[branch._id];
    if (!updated?.name || !updated?.mapUrl || !updated?.phone) {
      toast.error("Both name, phone and map URL are required");
      return;
    }

    axios
      .put(`${apiUrl}/admin/update-branch`, {
        state,
        branchId: branch._id,
        newName: updated.name,
        newMapUrl: updated.mapUrl,
        newPhone: updated.phone,
      })
      .then(() => {
        toast.success("Branch updated successfully");
        setEditBranch((prev) => ({ ...prev, [branch._id]: null }));
        fetchLocations();
      })
      .catch(() => toast.error("Update failed"));
  };

  return (
    <div className="container my-4">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline-secondary mb-4"
      >
        ← Back
      </button>

      <h2 className="text-center mb-4">Hospital Locations</h2>

      {locations.map((loc) => (
        <div key={loc._id} className="card mb-4 shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center bg-secondary text-white">
            <h5 className="mb-0">{loc.State}</h5>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => confirmDelete({ type: "state", state: loc.State })}
            >
              Delete State
            </button>
          </div>

          <div className="card-body">
            <h6 className="fw-bold mb-3">Branches:</h6>
            {loc.branches.length === 0 && (
              <p className="text-muted">No branches available.</p>
            )}
            {loc.branches.map((branch) => {
              const isEditing = !!editBranch[branch._id];
              const edited = editBranch[branch._id];
              const hasChanges =
                edited?.name !== edited?.original?.name ||
                edited?.mapUrl !== edited?.original?.mapUrl ||
                edited?.phone !== edited?.original?.phone;

              return (
                <div key={branch._id} className="border rounded p-3 mb-3">
                  {isEditing ? (
                    <>
                      <input
                        className="form-control mb-2"
                        value={edited.name}
                        placeholder="Branch name"
                        onChange={(e) =>
                          handleEditChange(branch._id, "name", e.target.value)
                        }
                      />
                      <input
                        className="form-control mb-2"
                        value={edited.phone}
                        placeholder="Phone number"
                        onChange={(e) =>
                          handleEditChange(branch._id, "phone", e.target.value)
                        }
                      />
                      <input
                        className="form-control mb-2"
                        value={edited.mapUrl}
                        placeholder="Map URL"
                        onChange={(e) =>
                          handleEditChange(branch._id, "mapUrl", e.target.value)
                        }
                      />
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleUpdateBranch(loc.State, branch)}
                          disabled={!hasChanges}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() =>
                            setEditBranch((prev) => ({
                              ...prev,
                              [branch._id]: null,
                            }))
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p>
                          <strong>Name:</strong> {branch.name}
                        </p>
                        <p>
                          <strong>Phone:</strong> {branch.phone}
                        </p>
                        <p>
                          <strong>Map:</strong>{" "}
                          <a
                            href={branch.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Location
                          </a>
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            setEditBranch((prev) => ({
                              ...prev,
                              [branch._id]: {
                                name: branch.name,
                                mapUrl: branch.mapUrl,
                                phone: branch.phone,
                                original: {
                                  name: branch.name,
                                  mapUrl: branch.mapUrl,
                                  phone: branch.phone,
                                },
                              },
                            }))
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            confirmDelete({
                              type: "branch",
                              state: loc.State,
                              branchName: branch.name, // delete by name now
                            })
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          {deleteTarget?.type === "state"
            ? `the state "${deleteTarget.state}"`
            : "this branch"}
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger mt-3" onClick={handleConfirmedDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
