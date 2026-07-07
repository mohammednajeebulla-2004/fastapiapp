import NavBar from "./components/NavBar";
import Welcome from "./components/Welcome";
import Footer from "./components/Footer";
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DiscoverJobs from "./components/DiscoverJobs/DiscoverJobs";
import { useEffect, useState, type ComponentType } from "react";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "./Services/CompanyService";
import type { Company } from "./types/company";
import ChatWidget from "./components/ChatWidget";

const NavBarComponent = NavBar as ComponentType<{ onLogout: () => void }>;

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    async function fetchCompanies() {
      setLoading(true);
      setError(null);

      try {
        const companiesResponse = await getCompanies();
        setCompanies(companiesResponse);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : String(err);

        setError(errorMessage);

        if (errorMessage.includes("401")) {
          localStorage.removeItem("token");
          setToken(null);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
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
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
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
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDeleteCompany = async (id: number) => {
    try {
      await deleteCompany(id);
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
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
    <NavBar onLogout={handleLogout} />

    <main className="main-content">
      <Welcome />

      <DiscoverJobs />

      <section className="section">
        <CompanyCard
          companies={companies}
          onedit={handleEditCompany}
          ondelete={handleDeleteCompany}
          onadd={handleAddCompany}
        />
      </section>

      <section className="section">
        <JobCard />
      </section>
    </main>

    <Footer />

    <ChatWidget />
  </div>
);
}

export default App;