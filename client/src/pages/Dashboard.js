import Chatbot from "../components/Chatbot";
import ResumeUpload from "../components/ResumeUpload";

function Dashboard() {
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">SkillTree Dashboard</h2>

      <div className="row">
        {/* Resume Section */}
        <div className="col-md-6">
          <div className="card shadow p-3">
            <ResumeUpload />
          </div>
        </div>

        {/* Chatbot Section */}
        <div className="col-md-6">
          <div className="card shadow p-3">
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;