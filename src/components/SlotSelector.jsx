import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SlotSelector.css";

const SlotSelector = ({
  doctorEmail,
  selectedDate,
  onSlotSelect,
  selectedSlot,
  onMessage,
}) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (doctorEmail && selectedDate) {
      setLoading(true);
      axios
        .get(`${apiUrl}/admin/slots`, {
          params: { doctorEmail, date: selectedDate },
        })
        .then((res) => {
          setSlots(res.data.availableSlots || []);
          setError(null);
          if (onMessage) onMessage(res.data.message || "");
        })
        .catch(() => {
          setSlots([]);
          setError("Failed to fetch slots");
          if (onMessage) onMessage("Failed to fetch slots");
        })
        .finally(() => setLoading(false));
    }
  }, [doctorEmail, selectedDate]);

  return (
    <div className="slot-container">
      <h5 className="text-primary">Available Time Slots</h5>
      {loading ? (
        <p>Loading slots...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : slots.length === 0 ? (
        <p>No slots available for selected date.</p>
      ) : (
        <div className="slot-grid">
          {slots.map((slot, idx) => (
            <button
              type="button"
              key={idx}
              disabled={slot.booked}
              className={`slot-btn ${
                slot.booked
                  ? "booked"
                  : selectedSlot === slot.start
                  ? "selected"
                  : "available"
              }`}
              onClick={() => onSlotSelect(slot.start)}
            >
              {slot.start}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SlotSelector;
