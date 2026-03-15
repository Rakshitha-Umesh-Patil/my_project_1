function BookAppointment() {
  return (
    <div className="container mt-4">
      <h2>Book Appointment</h2>

      <div className="card p-3 mt-3">
        <h5>Dr. Smith</h5>
        <p>Department: General Medicine</p>

        <button className="btn btn-success me-2">Book Slot</button>
        <button className="btn btn-warning">Emergency</button>
      </div>

    </div>
  );
}

export default BookAppointment;