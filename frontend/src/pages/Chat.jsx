// import React, { useState, useEffect, useRef } from "react";
// import mqtt from "mqtt";
// import { useLocation } from "react-router-dom";
// import axiosInstance from "../axiosConfig";

// export default function Chat() {
//   const location = useLocation();
//   const { username, currentUser } = location.state; // Extract username and currentUser from location.state

//   const [messages, setMessages] = useState([]); // Chat history
//   const [message, setMessage] = useState("");
//   const [client, setClient] = useState(null); // MQTT client instance
//   const [isTyping, setIsTyping] = useState(false); // Typing indicator
//   const messagesEndRef = useRef(null); // For auto-scrolling

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axiosInstance.get(
//           `/messages/${currentUser}/${username}`
//         );
//         setMessages(response.data);
//       } catch (error) {
//         console.error("Failed to fetch messages:", error);
//       }
//     };
//     fetchMessages();
//   }, [currentUser, username]);

//   useEffect(() => {
//     // Connect to the MQTT broker
//     const mqttClient = mqtt.connect("wss://test.mosquitto.org:8081"); // Public broker
//     setClient(mqttClient);

//     const topic = `chat/${currentUser}/${username}`; // Topic for current user and chat partner
//     const typingTopic = `typing/${username}/${currentUser}`; // Topic for typing indicator

//     mqttClient.on("connect", () => {
//       console.log("Connected to MQTT broker");
//       mqttClient.subscribe([topic, typingTopic], (err) => {
//         if (!err) {
//           console.log(`Subscribed to topics: ${topic}, ${typingTopic}`);
//         } else {
//           console.error("Subscription error:", err);
//         }
//       });
//     });

//     mqttClient.on("message", (topic, payload) => {
//       if (topic === typingTopic) {
//         setIsTyping(payload.toString() === "true");
//       } else {
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { sender: username, text: payload.toString() },
//         ]);
//       }
//     });

//     return () => {
//       mqttClient.unsubscribe([topic, typingTopic], (err) => {
//         if (!err) {
//           console.log(`Unsubscribed from topics: ${topic}, ${typingTopic}`);
//         } else {
//           console.error("Unsubscribe error:", err);
//         }
//       });
//       mqttClient.end();
//     };
//   }, [currentUser, username]);

//   useEffect(() => {
//     // Scroll to the latest message
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleTyping = (e) => {
//     setMessage(e.target.value);
//     if (client) {
//       client.publish(
//         `typing/${currentUser}/${username}`,
//         e.target.value.length > 0 ? "true" : "false"
//       );
//     }
//   };

//   const sendMessage = async () => {
//     if (message.trim() && client) {
//       const topic = `chat/${username}/${currentUser}`; // Topic for sending message
//       const messageObj = { sender: currentUser, receiver: username, text: message };

//       client.publish(topic, message, async (err) => {
//         if (!err) {
//           setMessages((prevMessages) => [...prevMessages, messageObj]);
//           setMessage(""); // Clear input field

//           // Save message to backend
//           try {
//             await axiosInstance.post("/messages", messageObj);
//           } catch (error) {
//             console.error("Failed to save message:", error);
//           }
//         } else {
//           alert("Failed to send the message. Please try again.");
//           console.error("Publish error:", err);
//         }
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-2xl font-bold mb-4">Chat with {username}</h2>

//         <div className="border p-4 rounded-lg h-80 overflow-y-auto">
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`mb-2 ${
//                 msg.sender === currentUser
//                   ? "text-right text-blue-500"
//                   : "text-left text-gray-700"
//               }`}
//             >
//               <span>{msg.sender}: </span>
//               {msg.text}
//             </div>
//           ))}
//           {isTyping && (
//             <div className="text-left text-gray-500 italic">Typing...</div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         <div className="mt-4 flex">
//           <input
//             type="text"
//             value={message}
//             onChange={handleTyping}
//             placeholder="Type a message..."
//             className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             onClick={sendMessage}
//             className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import mqtt from "mqtt";
import { useLocation, useHistory } from "react-router-dom"; // Import useHistory for navigation
import axiosInstance from "../axiosConfig";

export default function Chat() {
  const location = useLocation();
  const history = useHistory(); // useHistory hook for navigation
  const { username, currentUser } = location.state; // Extract username and currentUser from location.state

  const [messages, setMessages] = useState([]); // Chat history
  const [message, setMessage] = useState("");
  const [client, setClient] = useState(null); // MQTT client instance
  const [isTyping, setIsTyping] = useState(false); // Typing indicator
  const messagesEndRef = useRef(null); // For auto-scrolling

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
    // Connect to the MQTT broker
    const mqttClient = mqtt.connect("wss://test.mosquitto.org:8081"); // Public broker
    setClient(mqttClient);

    const topic = `chat/${currentUser}/${username}`; // Topic for current user and chat partner
    const typingTopic = `typing/${username}/${currentUser}`; // Topic for typing indicator

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      mqttClient.subscribe([topic, typingTopic], (err) => {
        if (!err) {
          console.log(`Subscribed to topics: ${topic}, ${typingTopic}`);
        } else {
          console.error("Subscription error:", err);
        }
      });
    });

    mqttClient.on("message", (topic, payload) => {
      if (topic === typingTopic) {
        setIsTyping(payload.toString() === "true");
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: topic.includes(currentUser) ? currentUser : username, text: payload.toString() },
        ]);
      }
    });

    return () => {
      mqttClient.unsubscribe([topic, typingTopic], (err) => {
        if (!err) {
          console.log(`Unsubscribed from topics: ${topic}, ${typingTopic}`);
        } else {
          console.error("Unsubscribe error:", err);
        }
      });
      mqttClient.end();
    };
  }, [currentUser, username]);

  useEffect(() => {
    // Scroll to the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (client) {
      client.publish(
        `typing/${currentUser}/${username}`,
        e.target.value.length > 0 ? "true" : "false"
      );
    }
  };

  const sendMessage = async () => {
    if (message.trim() && client) {
      const topic = `chat/${username}/${currentUser}`; // Topic for sending message
      const messageObj = { sender: currentUser, receiver: username, text: message };

      client.publish(topic, message, async (err) => {
        if (!err) {
          setMessages((prevMessages) => [...prevMessages, messageObj]);
          setMessage(""); // Clear input field

          // Save message to backend
          try {
            await axiosInstance.post("/messages", messageObj);
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
            onClick={() => history.push("/dashboard")} // Navigate back to the Dashboard
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
