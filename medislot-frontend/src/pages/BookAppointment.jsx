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

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 🔐 Only USER can access
  useEffect(() => {
    if (!token || user?.role !== "user") {
      alert("Only users can book appointments");
      navigate("/");
    }
  }, []);

  // ✅ Fetch doctors
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDoctors(res.data))
      .catch(() => alert("Error loading doctors"));
  }, []);

  // ✅ Fetch slots whenever doctor/date changes
  useEffect(() => {
    if (selectedDoctor && date) {
      axios
        .get(
          `${BACKEND_URL}/api/doctors/availability/${selectedDoctor._id}/${date}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setAvailableSlots(res.data.slots || []);
          setSlot("");
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
          slot,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Appointment Booked Successfully ✅");

      setSelectedDoctor(null);
      setDate("");
      setSlot("");
      setAvailableSlots([]);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Book Appointment</h2>

      {/* Doctor Cards */}
      <div className="row">
        {doctors.map((doc) => (
          <div className="col-md-4 mb-4" key={doc._id}>
            <div className="card shadow border-0 h-100">
              <div className="card-body">
                <h5 className="text-center">Dr. {doc.name}</h5>
                <hr />
                <p><strong>Specialization:</strong> {doc.specialization}</p>
                <p><strong>Experience:</strong> {doc.experience} years</p>
                <p><strong>Hospital:</strong> {doc.hospital || "N/A"}</p>
                <p><strong>Phone:</strong> {doc.phone || "N/A"}</p>
                <p><strong>Patients Treated:</strong> {doc.patientsTreated || 0}</p>

                <div className="d-grid mt-3">
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setDate("");
                      setSlot("");
                      setAvailableSlots([]);
                    }}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Panel */}
      {selectedDoctor && (
        <div className="card shadow p-4 mt-4 border-0">
          <h4 className="mb-3 text-center">
            Booking with Dr. {selectedDoctor.name}
          </h4>

          <label>Select Date</label>
          <input
            type="date"
            className="form-control mb-3"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label>Select Available Slot</label>
          <select
            className="form-control mb-3"
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            disabled={!availableSlots.length}
          >
            <option value="">Choose Slot</option>
            {availableSlots.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="d-grid">
            <button
              className="btn btn-primary"
              disabled={!slot}
              onClick={handleBook}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookAppointment;