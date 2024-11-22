import React, { useState, useEffect, useRef } from "react";
import mqtt from "mqtt";
import { useLocation, useHistory } from "react-router-dom";
import axiosInstance from "../axiosConfig";

export default function Chat() {
  const location = useLocation();
  const history = useHistory();
  const { username, currentUser } = location.state;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [client, setClient] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null); // Ref for managing the typing timeout
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(
          `/messages/${currentUser}/${username}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
  }, [currentUser, username]);

  useEffect(() => {
    const mqttClient = mqtt.connect("wss://test.mosquitto.org:8081");
    setClient(mqttClient);

    const topic = `chat/${currentUser}/${username}`;
    const typingTopic = `typing/${username}/${currentUser}`;

    mqttClient.on("connect", () => {
      mqttClient.subscribe([topic, typingTopic], (err) => {
        if (!err) {
          console.log(`Subscribed to topics: ${topic}, ${typingTopic}`);
        } else {
          console.error("Subscription error:", err);
        }
      });
    });

    mqttClient.on("message", (topic, payload) => {
      const messageData = JSON.parse(payload.toString());

      if (topic === typingTopic) {
        setIsTyping(messageData.isTyping);

        // Clear the existing timeout (if any)
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Set a timeout to hide typing after 2 seconds
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      } else if (topic === `chat/${currentUser}/${username}`) {
        setMessages((prevMessages) => [...prevMessages, messageData]);
      }
    });

    return () => {
      mqttClient.unsubscribe([topic, typingTopic]);
      mqttClient.end();

      // Clear typing timeout on component unmount
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [currentUser, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (client) {
      const typingPayload = JSON.stringify({ isTyping: e.target.value.length > 0 });
      client.publish(`typing/${currentUser}/${username}`, typingPayload);
    }
  };

  const sendMessage = async () => {
    if (message.trim() && client) {
      const messageData = { sender: currentUser, receiver: username, text: message };
      const payload = JSON.stringify(messageData);

      client.publish(`chat/${username}/${currentUser}`, payload, async (err) => {
        if (!err) {
          setMessages((prevMessages) => [...prevMessages, messageData]);
          setMessage("");

          try {
            await axiosInstance.post("/messages", messageData);
          } catch (error) {
            console.error("Failed to save message:", error);
          }
        } else {
          alert("Failed to send the message. Please try again.");
          console.error("Publish error:", err);
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => history.push("/dashboard")}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Back
          </button>
          <h2 className="text-2xl font-bold">Chat with {username}</h2>
        </div>

        <div className="border p-4 rounded-lg h-80 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.sender === currentUser
                  ? "text-right text-blue-500"
                  : "text-left text-gray-700"
              }`}
            >
              <span>{msg.sender}: </span>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="text-left text-gray-500 italic">Typing...</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 flex">
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
