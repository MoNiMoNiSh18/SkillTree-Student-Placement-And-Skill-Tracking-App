import { useState } from "react";
import API from "../services/api";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const student_id = localStorage.getItem("student_id");

  const sendMessage = async () => {
  try {
    const student_id = localStorage.getItem("student_id");

    const res = await API.post("/ai/chat", {
      message,
      student_id
    });

    setReply(res.data.reply);
  } catch (err) {
    console.error(err);
    alert("Chat failed");
  }
};

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Assistant</h3>

      <input
        placeholder="Ask something..."
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>

      <p><b>Bot:</b> {reply}</p>
    </div>
  );
}

export default Chatbot;