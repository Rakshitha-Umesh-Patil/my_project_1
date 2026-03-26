import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddDoctor() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [hospital, setHospital] = useState("");
  const [patientsTreated, setPatientsTreated] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login as admin");
      return;
    }

    try {
      await axios.post(
        `${BACKEND_URL}/api/users/add-doctor`,
        {
          name,
          email,
          phone,
          specialization,
          experience,
          hospital,
          patientsTreated, // ✅ FIXED (you forgot this)
          password: "123456",
          role: "doctor"   // ✅ IMPORTANT
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Doctor Added Successfully ✅");

      // Clear form
      setName("");
      setEmail("");
      setPhone("");
      setSpecialization("");
      setExperience("");
      setHospital("");
      setPatientsTreated("");

      navigate("/admin");

    } catch (error) {
      console.error("Add doctor error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to add doctor ❌");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Doctor</h2>

      <form onSubmit={handleSubmit}>

        <input
          className="form-control mb-2"
          placeholder="Doctor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="form-control mb-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="form-control mb-2"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          className="form-control mb-2"
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          required
        />

        <input
          className="form-control mb-2"
          type="number"
          placeholder="Experience (years)"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          required
        />

        <input
          className="form-control mb-2"
          placeholder="Hospital"
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
          required
        />

        <input
          className="form-control mb-2"
          type="number"
          placeholder="Patients Treated"
          value={patientsTreated}
          onChange={(e) => setPatientsTreated(e.target.value)}
        />

        <button type="submit" className="btn btn-primary">
          Add Doctor
        </button>

      </form>
    </div>
  );
}

export default AddDoctor;