import { useState, useEffect, useRef } from "react";
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [ChatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Normal Messages
  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { type: "user", content: input }]);
      chat_history_human(input); // Add to ChatHistory after sending message
      setInput(""); // Clear input field
    }
  };

  // Chat History for Agent
  const chat_history_human = (messageContent) => {
    if (messageContent.trim()) {
      setChatHistory([...ChatHistory, `HumanMessage(content=${messageContent})`]);
    }
  };


  // AI chat function
  const chat_history_ai = (AIcontent) => {
    if (AIcontent.trim()) {
      setChatHistory([...ChatHistory, `AIMessage(content=${AIcontent})`]);
    }
  };

  // Api Call and scroll
  useEffect(() => {
    try {
      console.log(messages)
       console.log(ChatHistory)
      axios.post("http://127.0.0.1:5000/api", { ChatHistory })
        .then((res) => {
          const result = res;
          console.log(result);
        });
    } catch (err) {
      console.log("error", err);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <nav className="flex items-center justify-between bg-black p-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="/logo-2LzXSqsyE-transformed.png"
            alt="logo"
            className="h-8 w-8 object-cover rounded-full border-2 border-yellow-500"
          />
          <div className="text-yellow-500 text-lg font-bold">Rely</div>
        </div>

        {/* Button */}
        <button className="bg-yellow-500 hover:bg-yellow-400 cursor-pointer text-black px-4 py-2 rounded-lg font-medium shadow-lg transition-all">
          New Chat
        </button>
      </nav>

      {/* Chat Section */}
      <div className="flex flex-col h-[calc(100vh-64px)] p-4 bg-gray-100">
        {/* Messages Display */}
        <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                  message.type === "user"
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <div className="flex flex-col">
                  <div>{message.content}</div>
                  
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="flex items-center mt-4 space-x-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage() }
          />
          <button
            onClick={handleSendMessage}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium shadow transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
