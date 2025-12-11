🚀 SalesFlow AI CRM: Intelligent Sales Pipeline Management
SalesFlow AI CRM Screenshot - Dashboard

![Dashboard](https://github.com/Harshmriduhash/SalesAI-Smart-SaaS-Tool/blob/main/Dashboard.png?raw=true)


Welcome to SalesFlow AI, a modern, full-stack CRM application designed to empower sales professionals with intelligent lead management and activity tracking. This project showcases a robust MERN stack implementation with a forward-looking approach to AI-driven sales insights.

✨ Features & Highlights
📈 Intuitive Dashboard: Gain instant insights into your sales pipeline with key metrics, conversion trends, and activity overviews.
📋 Comprehensive Lead Management: Create, view, update, and delete leads with detailed profiles, status tracking, and estimated values.
🗓️ Efficient Activity Tracking: Log calls, emails, meetings, and notes. Mark activities complete, manage priorities, and never miss a follow-up.
🔐 Secure User Authentication: Robust user registration and login system with JWT-based authorization and password hashing (bcrypt.js).
💡 AI-Powered Capabilities (Integrated & Future-Ready):
Automated Email Generation: Leverage LLMs to draft personalized follow-up emails.
Lead Analysis & Prep: Generate AI-driven insights for leads, including conversation preparation points.
Intelligent Lead Scoring: Dynamic scoring to prioritize prospects (backend-integrated, frontend UI ready).
🎨 Modern & Responsive UI: Built with React, Tailwind CSS, and Shadcn UI for a beautiful, accessible, and seamless experience across all devices.
🔄 Real-time Data Management: Utilizes React Query for efficient data fetching, caching, and synchronization with the backend.
🛠️ Tech Stack
This application is built on a powerful MERN (MongoDB, Express.js, React.js, Node.js) stack, enhanced with cutting-edge tools:

Frontend:

React.js: Core UI development.
Vite: Blazing-fast development server and build tool.
Tailwind CSS: Utility-first CSS framework for rapid styling.
Shadcn UI: Reusable, accessible UI components.
React Query: Server-state management for data fetching and caching.
React Hook Form & Zod: Type-safe form validation and management.
Axios: HTTP client for API requests.
Moment.js / date-fns: Date manipulation utilities.
Lucide React: Icon library.
React Hot Toast: Elegant notification system.

Backend:

Node.js & Express.js: Server runtime and web framework for RESTful APIs.
MongoDB & Mongoose: NoSQL database and ODM for data persistence.
JSON Web Tokens (JWT): Secure user authentication and authorization.
Bcrypt.js: Password hashing.
dotenv: Environment variable management.
CORS: Cross-Origin Resource Sharing for secure frontend-backend communication.
helmet: Security middleware for HTTP headers.
express-rate-limit: Protects API from brute-force attacks.
Google Generative AI (Gemini) / OpenAI: LLM integrations for AI features.

🚀 Getting Started
Follow these steps to set up and run the SalesFlow AI CRM locally.

1. Clone the Repository
git clone https://github.com/Harshmriduhash/salesflow-ai-crm.git
cd salesflow-ai-crm
2. Install Dependencies

You'll need to install dependencies for both the frontend and backend.

Frontend:

npm install # or yarn install

Backend:

cd crm-backend
npm install # or yarn install
cd .. # Navigate back to root
3. Configure Environment Variables
Create a .env file inside the crm-backend directory and add the following:

# MongoDB Connection String
MONGODB_URI=mongodb+srv://<your-username>:<your-password>@<your-cluster>.mongodb.net/<your-database-name>?retryWrites=true&w=majority

# JWT Secret for authentication tokens
JWT_SECRET=a_very_secret_key_that_you_should_change_in_production

# AI Provider Configuration (Choose one or leave blank for mock AI)
# To enable AI, set AI_ENABLED=true and provide an API key for either Gemini or OpenAI.
AI_ENABLED=false # Set to 'true' to enable AI features
GEMINI_API_KEY=your_google_gemini_api_key_here # Optional
OPENAI_API_KEY=your_openai_api_key_here # Optional
Important: Replace placeholder values with your actual MongoDB connection string and a strong JWT secret. If you wish to enable AI features, set AI_ENABLED=true and provide either a GEMINI_API_KEY or OPENAI_API_KEY.

4. Run the Application
You'll need two separate terminal windows: one for the backend and one for the frontend.

Start Backend (in crm-backend directory):

cd crm-backend
npm run dev # Uses nodemon for auto-restarts
(The backend will run on http://localhost:5001)

Start Frontend (in root directory):

npm run dev
(The frontend will typically run on http://localhost:5173 or similar, check your terminal output)

📈 Future Roadmap
This project is continuously evolving. Here are some planned enhancements:

Deeper AI Integration: Implement proactive AI suggestions for next best actions, advanced lead scoring based on historical data, and sentiment analysis from activity notes.
Enhanced Analytics & Reporting: Develop more sophisticated dashboards with customizable reports to track sales performance and identify bottlenecks.
Team Collaboration: Introduce features for sales team management, task assignment, and shared lead ownership.
Customizable Workflows: Allow users to define custom sales pipelines and activity types.
Third-Party Integrations: Connect with popular tools like email marketing platforms, calendar services, and communication apps.
Robust Error Handling & Logging: Implement centralized logging and more graceful error recovery mechanisms.
👨‍💻 Author
Rafique Siddique

📍 Carleton University — B.Sc. Computer Science
License
This project is licensed under the MIT License. See the LICENSE file for details.
