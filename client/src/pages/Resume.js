import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Resume() {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  const upload = async () => {
    const student_id = localStorage.getItem("student_id");

    console.log("Student ID from localStorage:", student_id);

    // 🔴 CRITICAL FIX
    if (!student_id || student_id === "undefined") {
      alert("Session expired. Please login again.");
      navigate("/");
      return;
    }

    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("student_id", student_id);

      console.log("Sending ID:", student_id);

      const res = await API.post("/ai/resume", formData);

      setSkills(res.data.detectedSkills);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Resume</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={upload}>Analyze Resume</button>

      {skills.length > 0 && (
        <>
          <h3>Detected Skills:</h3>
          <ul>
            {skills.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Resume;