import { useState } from "react";
import axios from "axios";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);

  const upload = async () => {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("student_id", 1);

    const res = await axios.post(
      "http://localhost:5000/api/ai/resume",
      formData
    );

    setSkills(res.data.detectedSkills);
  };

  return (
    <div>
      <h5>Upload Resume</h5>

      <input
        type="file"
        className="form-control mb-2"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button className="btn btn-success w-100 mb-3" onClick={upload}>
        Analyze Resume
      </button>

      {skills.length > 0 && (
        <div>
          <h6>Detected Skills:</h6>
          <ul>
            {skills.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;