import { useEffect, useState } from "react";
import axios from "axios";

function Book() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [type, setType] = useState("NORMAL");

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      setAvailableSlots([
        "09:00-09:30",
        "09:30-10:00",
        "10:00-10:30",
        "10:30-11:00"
      ]);
    }
  }, [selectedDoctor]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/doctors"); // ✅ FIXED
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBook = async () => {
    const token = localStorage.getItem("token");

    if (!date || !slot || !selectedDoctor) {
      return alert("Fill all fields");
    }

    try {
      await axios.post(
        "http://localhost:5000/api/appointments/book",
        { doctorId: selectedDoctor._id, date, slot, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Booked successfully ✅");

      setDate("");
      setSlot("");
      setSelectedDoctor(null);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Book Appointment</h2>

      <div className="row">
        {doctors.map(doc => (
          <div className="col-md-4" key={doc._id}>
            <div className="card p-3">
              <h5>{doc.name}</h5>
              <button className="btn btn-success" onClick={() => setSelectedDoctor(doc)}>
                Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div className="card p-3 mt-3">
          <h4>{selectedDoctor.name}</h4>

          <input type="date" className="form-control mb-2" value={date} onChange={e => setDate(e.target.value)} />

          <select className="form-control mb-2" value={slot} onChange={e => setSlot(e.target.value)}>
            <option>Select Slot</option>
            {availableSlots.map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select className="form-control mb-2" value={type} onChange={e => setType(e.target.value)}>
            <option value="NORMAL">NORMAL</option>
            <option value="EMERGENCY">EMERGENCY</option>
          </select>

          <button className="btn btn-primary" onClick={handleBook}>
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}

export default Book;