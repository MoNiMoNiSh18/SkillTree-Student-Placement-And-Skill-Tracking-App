import { useState } from "react";
import axios from "axios";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const send = async () => {
    const res = await axios.post("http://localhost:5000/api/ai/chat", {
      student_id: 1,
      message,
    });

    setChat([...chat, { user: message, bot: res.data.reply }]);
    setMessage("");
  };

  return (
  <div>
    <h5 className="mb-3">AI Assistant</h5>

    <div
      className="border p-3 mb-3"
      style={{ height: "300px", overflowY: "auto", background: "#f8f9fa" }}
    >
      {chat.map((c, i) => (
        <div key={i}>
          <p><b>You:</b> {c.user}</p>
          <p className="text-success"><b>Bot:</b> {c.bot}</p>
          <hr />
        </div>
      ))}
    </div>

    <div className="input-group">
      <input
        className="form-control"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
      />
      <button className="btn btn-primary" onClick={send}>
        Send
      </button>
    </div>
  </div>
);
}
export default Chatbot;