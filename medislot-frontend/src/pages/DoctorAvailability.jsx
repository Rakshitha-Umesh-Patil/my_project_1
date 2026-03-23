import { useState } from "react";
import axios from "axios";

function DoctorAvailability() {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);

  const allSlots = [];
  for (let h = 9; h < 18; h++) {
    allSlots.push(`${h.toString().padStart(2, "0")}:00-${h.toString().padStart(2, "0")}:30`);
    allSlots.push(`${h.toString().padStart(2, "0")}:30-${(h + 1).toString().padStart(2, "0")}:00`);
  }

  const toggleSlot = (slot) => {
    setSlots(slots.includes(slot) ? slots.filter(s => s !== slot) : [...slots, slot]);
  };

  const handleSubmit = async () => {
    if (!date) return alert("Select date");
    if (slots.length === 0) return alert("Select slots");

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/set-availability", // ✅ FIXED
        { date, slots },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      setDate("");
      setSlots([]);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="card p-3">
      <h4>Set Availability</h4>

      <input type="date" className="form-control mb-2" value={date} onChange={e => setDate(e.target.value)} />

      <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
        {allSlots.map(slot => (
          <label key={slot} className="me-2 d-inline-block">
            <input type="checkbox" checked={slots.includes(slot)} onChange={() => toggleSlot(slot)} /> {slot}
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