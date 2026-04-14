import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

function DoctorAvailability() {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);

  // 9AM–6PM slots
  const allSlots = [];
  for (let h = 9; h < 18; h++) {
    allSlots.push(`${h.toString().padStart(2, "0")}:00-${h
      .toString()
      .padStart(2, "0")}:30`);
    allSlots.push(`${h.toString().padStart(2, "0")}:30-${(h + 1)
      .toString()
      .padStart(2, "0")}:00`);
  }

  const toggleSlot = (slot) => {
    setSlots((prev) =>
      prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot]
    );
  };

  const handleSubmit = async () => {
    if (!date || slots.length === 0) {
      alert("Select date and slots");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        // ✅ FIXED ROUTE
        `${BACKEND_URL}/api/doctors/availability/set-availability`,
        { date, slots },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      setSlots([]);
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Failed to save availability");
    }
  };

  return (
    <div className="card p-3">
      <h4>Set Availability</h4>

      <input
        type="date"
        className="form-control mb-2"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
        {allSlots.map((slot) => (
          <label key={slot} className="me-2 d-inline-block">
            <input
              type="checkbox"
              checked={slots.includes(slot)}
              onChange={() => toggleSlot(slot)}
            />{" "}
            {slot}
          </label>
        ))}
      </div>

      <button className="btn btn-primary mt-2" onClick={handleSubmit}>
        Save Availability
      </button>
    </div>
  );
}

export default DoctorAvailability;