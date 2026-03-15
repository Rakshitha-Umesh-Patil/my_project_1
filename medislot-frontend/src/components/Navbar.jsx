import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">MEDISLOT</Link>

        <div>
          <Link className="btn btn-light me-2" to="/">Home</Link>
          <Link className="btn btn-light me-2" to="/book">Book</Link>
          <Link className="btn btn-light" to="/admin">Admin</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar