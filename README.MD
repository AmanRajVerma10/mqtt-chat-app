Overview
A real-time chat application that allows users to register, log in, and engage in private messaging with other users. Messages are exchanged in real-time and saved to a database for persistence. The application features a clean, responsive UI and secure authentication.

Features
User Authentication: Registration and login using secure JWT tokens.
Real-Time Messaging: Instant messaging powered by MQTT.
Chat History: Persistent message storage in MongoDB.
Responsive Design: Built using Tailwind CSS.
User Dashboard: View and search other users.
Typing Indicator: See when the other user is typing.

Technologies Used

Frontend

React: JavaScript library for building the UI.
Vite: Development build tool.
Tailwind CSS: Responsive design.
react-router-dom: Routing and navigation.
mqtt: Real-time communication.
jwt-decode: For decoding JWT tokens.

Backend

Node.js & Express.js: Backend framework.
MongoDB: Database for user and message data.
Mongoose: MongoDB ODM library.
jsonwebtoken: For generating and verifying JWT tokens.
bcryptjs: For hashing passwords securely.

Setup Instructions
1. Clone the Repository
bash
git clone <repository-url>
cd chat-app
2. Install Dependencies
Navigate to both the frontend and backend directories to install dependencies:

bash
cd frontend
npm install

cd ../backend
npm install
3. Configure Environment Variables
Create a .env file in the backend directory and define the following:

PORT=5000
MONGO_DB_URI=mongodb+srv://<your-username>:<your-password>@cluster0.mongodb.net/chat_db?retryWrites=true&w=majority
JWT_SECRET_KEY=your_jwt_secret
4. Start the Application
Backend:

bash
cd backend
node server.js

Frontend:

bash
cd frontend
npm run dev
5. Access the Application
Open your browser and navigate to:

http://localhost:5173

Project Structure
Frontend:
React Components:
Login.jsx: User login form.
Register.jsx: User registration form.
Dashboard.jsx: Displays user list and enables navigation to chat.
Chat.jsx: Real-time messaging interface.
Backend:
Routes:
/api/auth: Authentication routes for login and registration.
/api/users: Routes for fetching user data.
/api/messages: Routes for fetching and saving chat messages.
Models:
User: Schema for storing user details.
Message: Schema for storing chat messages.
How It Works
User Registration/Login:
Users create accounts or log in to receive a JWT token.
Dashboard:
Logged-in users view a list of other users.
Click on a user to start a chat.
Real-Time Messaging:
Messages are exchanged instantly using MQTT.
Typing indicators show when the other user is typing.
Persistent Chat:
All messages are saved in MongoDB and displayed when revisiting a chat.
LicenseChat Application
Overview
A real-time chat application that allows users to register, log in, and engage in private messaging with other users. Messages are exchanged in real-time and saved to a database for persistence. The application features a clean, responsive UI and secure authentication.

Features
User Authentication: Registration and login using secure JWT tokens.
Real-Time Messaging: Instant messaging powered by MQTT.
Chat History: Persistent message storage in MongoDB.
Responsive Design: Built using Tailwind CSS.
User Dashboard: View and search other users.
Typing Indicator: See when the other user is typing.
Technologies Used
Frontend
React: JavaScript library for building the UI.
Vite: Development build tool.
Tailwind CSS: Responsive design.
react-router-dom: Routing and navigation.
mqtt: Real-time communication.
jwt-decode: For decoding JWT tokens.
Backend
Node.js & Express.js: Backend framework.
MongoDB: Database for user and message data.
Mongoose: MongoDB ODM library.
jsonwebtoken: For generating and verifying JWT tokens.
bcryptjs: For hashing passwords securely.
Setup Instructions
1. Clone the Repository
bash
Copy code
git clone <repository-url>
cd chat-app
2. Install Dependencies
Navigate to both the frontend and backend directories to install dependencies:

bash
Copy code
cd frontend
npm install

cd ../backend
npm install
3. Configure Environment Variables
Create a .env file in the backend directory and define the following:

plaintext
Copy code
PORT=5000
MONGO_DB_URI=mongodb+srv://<your-username>:<your-password>@cluster0.mongodb.net/chat_db?retryWrites=true&w=majority
JWT_SECRET_KEY=your_jwt_secret
4. Start the Application
Backend:

bash
Copy code
cd backend
npm start
Frontend:

bash
Copy code
cd frontend
npm run dev
5. Access the Application
Open your browser and navigate to:

plaintext
Copy code
http://localhost:5173
Project Structure
Frontend:
React Components:
Login.jsx: User login form.
Register.jsx: User registration form.
Dashboard.jsx: Displays user list and enables navigation to chat.
Chat.jsx: Real-time messaging interface.
Backend:
Routes:
/api/auth: Authentication routes for login and registration.
/api/users: Routes for fetching user data.
/api/messages: Routes for fetching and saving chat messages.
Models:
User: Schema for storing user details.
Message: Schema for storing chat messages.
How It Works
User Registration/Login:
Users create accounts or log in to receive a JWT token.
Dashboard:
Logged-in users view a list of other users.
Click on a user to start a chat.
Real-Time Messaging:
Messages are exchanged instantly using MQTT.
Typing indicators show when the other user is typing.
Persistent Chat:
All messages are saved in MongoDB and displayed when revisiting a chat.
License
This project is open-source and free to use under the MIT License.