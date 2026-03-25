import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <h3 className="text-white m-0">MEDISLOT</h3>

        <div className="d-flex align-items-center">
          <Link to="/" className="btn btn-light me-2">Home</Link>

          {/* ✅ BOOK button only for users */}
          {user?.role === "user" && (
            <Link to="/book" className="btn btn-light me-2">Book</Link>
          )}

          {/* Admin Panel */}
          {user?.role === "admin" && (
            <Link to="/admin" className="btn btn-warning me-2">Admin Panel</Link>
          )}

          {/* Doctor Panel */}
          {user?.role === "doctor" && (
            <Link to="/doctor-dashboard" className="btn btn-info me-2">Doctor Panel</Link>
          )}

          {/* My Appointments for users */}
          {user?.role === "user" && (
            <Link to="/my-appointments" className="btn btn-success me-2">My Appointments</Link>
          )}

          {/* Greeting */}
          {user && (
            <span className="text-white me-3">Welcome, {user.name} 👋</span>
          )}

          {/* Login / Logout */}
          {!user ? (
            <Link to="/login" className="btn btn-warning">Login</Link>
          ) : (
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;