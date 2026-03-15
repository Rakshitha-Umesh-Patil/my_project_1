import { useEffect, useState } from "react"
import API from "../services/api"

function Home() {

  const [message, setMessage] = useState("")

  useEffect(() => {
    API.get("/test")
      .then(res => {
        setMessage(res.data.message)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <div className="container mt-5">
      <h2>MEDISLOT Home</h2>
      <p>{message}</p>
    </div>
  )
}

export default Home