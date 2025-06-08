import React, { useState } from "react";
import ChatbotIcon from '../assets/chatbot-icon.png';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false); // Toggle chatbot visibility
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! How can I assist you today?" },
  ]);
  const [userInput, setUserInput] = useState("");

  const handleSend = () => {
    if (!userInput.trim()) return;
    const userMessage = { sender: "user", text: userInput };
    const botResponse = { sender: "bot", text: generateBotResponse(userInput) };
    setMessages((prev) => [...prev, userMessage, botResponse]);
    setUserInput("");
  };

  const generateBotResponse = (input) => {
    if (input.toLowerCase().includes("course")) {
      return "We offer courses in React, Python, and Data Science. Would you like more details?";
    }
    return "I'm here to help with anything related to your learning journey!";
  };

  return (
    <div>
      {/* Floating Chat Button */}
      <button
        className="btn btn-primary rounded-circle"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          zIndex: 1000,
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src={ChatbotIcon} alt="Chatbot Icon" style={{width:'50px', height:'50px', paddingRight:'12px', paddingBottom:'6px'}}/>
      </button>

      {/* Chatbot Container */}
      {isOpen && (
        <div
          className="card shadow-lg"
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "400px",
            maxHeight: "550px",
            zIndex: 1000,
          }}
        >
          {/* Chat Header */}
          <div className="card-header bg-primary text-white text-center">
            <h5 className="m-0">EduVance Assistant</h5>
          </div>

          {/* Chat Messages */}
          <div
            className="card-body p-3"
            style={{ height: "400px", overflowY: "auto" }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`d-flex ${
                  message.sender === "bot"
                    ? "justify-content-start"
                    : "justify-content-end"
                } mb-3`}
              >
                <div
                  className={`p-3 rounded ${
                    message.sender === "bot"
                      ? "bg-light text-dark"
                      : "bg-primary text-white"
                  }`}
                  style={{ maxWidth: "75%" }}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="card-footer d-flex align-items-center p-3">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="btn btn-primary" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
