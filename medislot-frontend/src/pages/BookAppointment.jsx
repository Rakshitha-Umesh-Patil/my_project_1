import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [type, setType] = useState("NORMAL");

  const navigate = useNavigate();

  // ✅ SAFE USER PARSE
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 🔐 LOGIN + ROLE CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || user?.role !== "user") {
      alert("Only users can access booking");
      navigate("/");
    }
  }, [navigate, user]);

  // FETCH DOCTORS
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async (searchValue = "") => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/doctors?search=${searchValue}`
      );
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => fetchDoctors(search);

  // FETCH AVAILABLE SLOTS
  useEffect(() => {
    if (selectedDoctor && date) fetchSlots();
  }, [selectedDoctor, date]);

  const fetchSlots = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/availability/${selectedDoctor._id}/${date}`
      );
      setAvailableSlots(res.data);
    } catch (err) {
      console.error(err);
      setAvailableSlots([]);
    }
  };

  // BOOK APPOINTMENT
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

      setSlot("");
      fetchSlots();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Book Appointment</h2>

      {/* 🔍 SEARCH */}
      <div className="d-flex mb-3">
        <input
          className="form-control me-2"
          placeholder="Search by hospital or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
      </div>

      {/* 👨‍⚕️ DOCTORS */}
      <div className="row">
        {doctors.map(doc => (
          <div className="col-md-4 mb-3" key={doc._id}>
            <div className="card p-3 shadow">
              <h5>{doc.name}</h5>
              <p><b>Specialization:</b> {doc.specialization || "N/A"}</p>
              <p><b>Hospital:</b> {doc.hospital || "N/A"}</p>
              <p><b>Experience:</b> {doc.experience || 0} years</p>
              <p><b>Patients Treated:</b> {doc.patientsTreated || 0}</p>

              {/* ✅ BOOK BUTTON ONLY FOR USERS */}
              {user?.role === "user" && (
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
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 📅 BOOKING FORM */}
      {selectedDoctor && user?.role === "user" && (
        <div className="card p-3 mt-3 shadow">
          <h4>{selectedDoctor.name}</h4>

          <input
            type="date"
            className="form-control mb-2"
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          <select
            className="form-control mb-2"
            value={slot}
            onChange={e => setSlot(e.target.value)}
          >
            <option value="">Select Slot</option>
            {availableSlots.length === 0 ? (
              <option disabled>No slots available</option>
            ) : (
              availableSlots.map(s => <option key={s} value={s}>{s}</option>)
            )}
          </select>

          <select
            className="form-control mb-2"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="NORMAL">NORMAL</option>
            <option value="EMERGENCY">EMERGENCY</option>
          </select>

          <button className="btn btn-primary" onClick={handleBook}>Confirm Booking</button>
        </div>
      )}
    </div>
  );
}

export default BookAppointment;