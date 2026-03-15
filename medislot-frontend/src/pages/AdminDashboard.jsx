import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

const [doctors, setDoctors] = useState([]);

useEffect(() => {
fetchDoctors();
}, []);

const fetchDoctors = async () => {
try {

```
  const token = localStorage.getItem("token");

  const res = await axios.get(
    "http://localhost:5000/doctors",
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  console.log("Doctors API Response:", res.data);

  setDoctors(res.data);

} catch (error) {
  console.log("Error fetching doctors:", error);
}
```

};

const deleteDoctor = async (id) => {
try {

```
  const token = localStorage.getItem("token");

  await axios.delete(
    `http://localhost:5000/doctors/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  alert("Doctor removed");

  fetchDoctors();

} catch (error) {
  console.log("Error deleting doctor:", error);
}
```

};

return ( <div className="container mt-4">

```
  <h2>Admin Dashboard</h2>

  <table className="table table-bordered">

    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Specialization</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>

      {doctors.map((doc) => (
        <tr key={doc._id}>
          <td>{doc.name}</td>
          <td>{doc.email}</td>
          <td>{doc.specialization}</td>

          <td>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteDoctor(doc._id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}

    </tbody>

  </table>

</div>
```

);
}

export default AdminDashboard;
