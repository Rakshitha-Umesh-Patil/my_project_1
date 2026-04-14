import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [type, setType] = useState("NORMAL");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Only USER can access
  useEffect(() => {
    if (!token || user?.role !== "user") {
      alert("Only users can book appointments");
      navigate("/");
    }
  }, []);

  // Fetch doctors
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDoctors(res.data))
      .catch(() => alert("Error loading doctors"));
  }, []);

  // ✅ Fetch slots CORRECTLY
  useEffect(() => {
    if (selectedDoctor && date) {
      axios
        .get(
          `${BACKEND_URL}/api/doctors/availability/${selectedDoctor._id}/${date}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setAvailableSlots(res.data.slots || []);
        })
        .catch(() => setAvailableSlots([]));
    }
  }, [selectedDoctor, date]);

  const handleBook = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/appointments/book`,
        {
          doctorId: selectedDoctor._id,
          date,
          slot,      // ✅ correct field
          type,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Booked Successfully ✅");
      setSlot("");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Book Appointment</h2>

      <div className="row">
        {doctors.map((doc) => (
          <div className="col-md-4 mb-3" key={doc._id}>
            <div className="card p-3 shadow">
              <h5>{doc.name}</h5>
              <p>{doc.specialization}</p>
              <p>{doc.hospital}</p>

              <button
                className="btn btn-success"
                onClick={() => {
                  setSelectedDoctor(doc);
                  setDate("");
                  setSlot("");
                  setAvailableSlots([]);
                }}
              >
                Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div className="card p-3 mt-3">
          <h5>Booking with Dr. {selectedDoctor.name}</h5>

          <input
            type="date"
            className="form-control mb-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <select
            className="form-control mb-2"
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
          >
            <option value="">Select Slot</option>
            {availableSlots.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            className="btn btn-primary"
            disabled={!slot}
            onClick={handleBook}
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}

export default BookAppointment;