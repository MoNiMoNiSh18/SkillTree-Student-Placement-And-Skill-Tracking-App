import { useEffect, useState } from "react";
import API from "../services/api";
import Chatbot from "../components/Chatbot";
import { Link } from "react-router-dom";

function Dashboard() {
  const [skills, setSkills] = useState([]);

  const student_id = localStorage.getItem("student_id");

  useEffect(() => {
    API.get(`/skills/${student_id}`)
      .then(res => setSkills(res.data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      <h3>Your Skills:</h3>
      <ul>
        {[...new Map(skills.map(s => [s.name, s])).values()].map((s, i) => (
  <li key={i}>{s.name}</li>
))}
      </ul>
        <Link to="/resume">Upload Resume</Link>
        <br />
        <Link to="/companies">View Companies</Link>
      <Chatbot />
    </div>
  );
}

export default Dashboard;