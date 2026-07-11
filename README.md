# TalentSpark 🚀

TalentSpark is a modern, AI-powered job portal designed to bridge the gap between top talent and leading companies. Built with a powerful, modern tech stack, it provides features like intelligent job matching, resume analysis, and an integrated AI career assistant.

## ✨ Key Features

- **💼 Job & Company Management:** Comprehensive CRUD operations for managing jobs and company profiles.
- **🤖 AI Career Assistant:** An intelligent chatbot integrated right into the platform to provide career guidance.
- **📄 Resume Analyzer:** AI-driven resume evaluation to help candidates improve their profiles.
- **🎯 Semantic Job Matching:** Powered by Qdrant vector search and LangChain, enabling highly relevant, context-aware job searches using RAG (Retrieval-Augmented Generation).
- **🔐 Secure Authentication:** Role-Based Access Control (RBAC) with JWT tokens for Admins, HRs, and Candidates.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + TypeScript (built with Vite)
- **Routing:** React Router v7
- **Styling:** Vanilla CSS with custom UI components
- **HTTP Client:** Axios

### Backend
- **Framework:** FastAPI
- **Database:** PostgreSQL (with `asyncpg` and SQLAlchemy)
- **Migrations:** Alembic
- **AI & ML:** Groq AI, LangChain, FastEmbed
- **Vector Database:** Qdrant (for semantic search & embeddings)
- **Security:** `passlib` & `python-jose` for JWT Auth

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- PostgreSQL
- Qdrant (can be run via Docker or Qdrant Cloud)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd fastapiapp
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv env
# On Windows:
env\Scripts\activate
# On Mac/Linux:
source env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure Environment Variables
# Create a .env file inside the `backend` directory based on .env.example
# e.g., DATABASE_URL, GROQ_API_KEY, QDRANT_URL, SECRET_KEY

# Run Database Migrations
alembic upgrade head

# Start the FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

```bash
# Open a new terminal instance
cd frontend/talentspark

# Install dependencies
npm install

# Configure Environment Variables
# Create a .env file and set the backend API URL
# e.g., VITE_API_URL=http://localhost:8000

# Start the Vite development server
npm run dev
```

## 🌐 Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/student_db
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GROQ_API_KEY=your_groq_api_key
```

### Frontend (`frontend/talentspark/.env`)
```env
VITE_API_URL=http://localhost:8000
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is licensed under the MIT License.
