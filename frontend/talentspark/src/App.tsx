import NavBar from "./components/NavBar";
import Welcome from "./components/Welcome";
import Footer from "./components/Footer";
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DiscoverJobs from "./components/DiscoverJobs/DiscoverJobs";
import { useEffect, useState } from "react";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "./Services/CompanyService";
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "./Services/JobService";
import type { Company } from "./types/company";
import type { Job } from "./types/job";
import ChatWidget from "./components/ChatWidget";
import { Routes, Route, Navigate } from "react-router-dom";

function decodeToken(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed;
  } catch (error) {
    return null;
  }
}

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.role) {
        setUserRole(decoded.role.toLowerCase());
      } else {
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const [companiesResponse, jobsResponse] = await Promise.all([
          getCompanies(),
          getJobs()
        ]);
        setCompanies(companiesResponse);
        setJobs(jobsResponse);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || err.message || String(err);

        setError(errorMessage);

        if (errorMessage.includes("401") || errorMessage.includes("Not authenticated")) {
          localStorage.removeItem("token");
          setToken(null);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  const handleLogin = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const handleAddCompany = async (company: Company) => {
    try {
      const created = await createCompany(company);
      setCompanies((prev) => [...prev, created]);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || String(err));
    }
  };

  const handleEditCompany = async (company: Company) => {
    try {
      if (company.id && company.id > 0) {
        const updated = await updateCompany(company.id, company);

        setCompanies((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
      } else {
        const created = await createCompany(company);
        setCompanies((prev) => [...prev, created]);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || String(err));
    }
  };

  const handleDeleteCompany = async (id: number) => {
    try {
      await deleteCompany(id);
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || String(err));
    }
  };

  const handleAddJob = async (job: Job) => {
    try {
      const created = await createJob(job);
      setJobs((prev) => [...prev, created]);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || String(err));
    }
  };

  const handleEditJob = async (job: Job) => {
    try {
      if (job.id && job.id > 0) {
        const updated = await updateJob(job.id, job);
        setJobs((prev) =>
          prev.map((j) => (j.id === updated.id ? updated : j))
        );
      } else {
        const created = await createJob(job);
        setJobs((prev) => [...prev, created]);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || String(err));
    }
  };

  const handleDeleteJob = async (id: number) => {
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || String(err));
    }
  };

  const handleShowRegister = () => setShowRegister(true);

  const handleShowLogin = () => setShowRegister(false);

  if (!token) {
    return showRegister ? (
      <Register onSwitchToLogin={handleShowLogin} />
    ) : (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={handleShowRegister}
      />
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
  <div className="app-container">
    <NavBar onLogout={handleLogout} role={userRole} />

    <div className="app-main">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/discover-jobs/*" element={<DiscoverJobs />} />
          <Route 
            path="/companies" 
            element={
              <section className="section" id="companies">
                <CompanyCard
                  companies={companies}
                  onedit={handleEditCompany}
                  ondelete={handleDeleteCompany}
                  onadd={handleAddCompany}
                  userRole={userRole}
                />
              </section>
            } 
          />
          <Route 
            path="/jobs" 
            element={
              <section className="section" id="jobs">
                <JobCard 
                  jobs={jobs}
                  companies={companies}
                  onedit={handleEditJob}
                  ondelete={handleDeleteJob}
                  onadd={handleAddJob}
                  userRole={userRole} 
                />
              </section>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>

    <ChatWidget />
  </div>
);
}

export default App;