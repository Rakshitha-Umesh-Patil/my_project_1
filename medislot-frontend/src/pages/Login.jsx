import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        {
          email,
          password
        }
      );

      // ✅ CHECK TOKEN EXISTS (important safety)
      if (!res.data.token) {
        alert("Token not received from server ❌");
        return;
      }

      // ✅ Save token & user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful ✅");

      // ✅ Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else if (res.data.user.role === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/book"); // user
      }

    } catch (err) {
      console.log("Login error:", err.response?.data);
      alert(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">

      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Login</h3>

        <form onSubmit={handleLogin}>

          <input
            type="email"   // ✅ better validation
            className="form-control mb-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required       // ✅ prevent empty submit
          />

          <input
            type="password"
            className="form-control mb-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn btn-primary w-100">
            Login
          </button>

        </form>
      </div>

    </div>
  );
}

export default Login;