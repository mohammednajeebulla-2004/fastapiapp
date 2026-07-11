import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./JobCard.css";
import type { Job } from "../types/job";
import type { Company } from "../types/company";
import { getJobs, createJob, updateJob, deleteJob } from "../Services/JobService";
import { getCompanies } from "../Services/CompanyService";
import { FaBriefcase, FaTrash, FaEdit, FaPlus, FaTimes, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";

interface Props {
  userRole?: string | null;
}

function JobCard(_props: Props) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  
  const [addForm, setAddForm] = useState<Job>({
    title: "",
    salary: 0,
    description: "",
    company_id: 0
  });

  const [editForm, setEditForm] = useState<Job>({
    title: "",
    salary: 0,
    description: "",
    company_id: 0
  });

  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);

  useEffect(() => {
    fetchJobsAndCompanies();
  }, []);

  const fetchJobsAndCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobsData, companiesData] = await Promise.all([
        getJobs(),
        getCompanies()
      ]);
      setJobs(jobsData);
      setCompanies(companiesData);
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.detail || err?.message || String(err);
      setError(`Failed to fetch jobs data: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.company_id) {
      alert("Please select a company");
      return;
    }
    try {
      const newJob = await createJob(addForm);
      setJobs((prev) => [...prev, newJob]);
      setIsAdding(false);
      setAddForm({ title: "", salary: 0, description: "", company_id: 0 });
    } catch (err) {
      console.error(err);
      alert("Failed to create job. Check if you have proper permissions (HR/Admin).");
    }
  };

  const handleEditInit = (job: Job) => {
    if (job.id) {
      setEditingJobId(job.id);
      setEditForm(job);
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJobId) return;
    try {
      const updated = await updateJob(editingJobId, editForm);
      setJobs((prev) => prev.map((j) => (j.id === editingJobId ? updated : j)));
      setEditingJobId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update job");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete job");
    }
  };

  const handleApply = (id: number) => {
    if (appliedJobs.includes(id)) return;
    setAppliedJobs((prev) => [...prev, id]);
    alert("Application submitted successfully!");
  };

  const getCompanyName = (companyId?: number | null) => {
    if (!companyId) return "Independent / Remote";
    const comp = companies.find((c) => c.id === companyId);
    return comp ? comp.name : `Company ID: ${companyId}`;
  };

  const getCompanyLocation = (companyId?: number | null) => {
    if (!companyId) return "";
    const comp = companies.find((c) => c.id === companyId);
    return comp ? comp.location : "";
  };

  if (loading) return <div className="job-loading">Loading jobs...</div>;

  return (
    <div className="job-section">
      <div className="job-section-header">
        <h2 className="job-title">Featured Jobs</h2>
        {(_props.userRole === "admin" || _props.userRole === "hr") && (
          <button className="add-job-toggle-btn" onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? <FaTimes /> : <><FaPlus /> Post Job</>}
          </button>
        )}
      </div>

      {isAdding && (
        <form className="job-form-panel card" onSubmit={handleAdd}>
          <h3>Post a New Job Opportunity</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                placeholder="e.g. Senior React Developer"
                value={addForm.title}
                onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Salary (LPA)</label>
              <input
                type="number"
                placeholder="e.g. 12"
                value={addForm.salary || ""}
                onChange={(e) => setAddForm({ ...addForm, salary: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="form-group">
              <label>Company</label>
              <select
                value={addForm.company_id || ""}
                onChange={(e) => setAddForm({ ...addForm, company_id: parseInt(e.target.value) || 0 })}
                required
              >
                <option value="" disabled>Select Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group full-width">
            <label>Job Description</label>
            <textarea
              rows={4}
              placeholder="Provide a detailed description of the role, requirements, and responsibilities..."
              value={addForm.description}
              onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-btn">Submit Post</button>
            <button type="button" className="secondary-btn" onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        </form>
      )}

      {editingJobId && (
        <form className="job-form-panel card editing" onSubmit={handleEditSave}>
          <h3>Edit Job Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Salary (LPA)</label>
              <input
                type="number"
                value={editForm.salary || ""}
                onChange={(e) => setEditForm({ ...editForm, salary: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="form-group">
              <label>Company</label>
              <select
                value={editForm.company_id || ""}
                onChange={(e) => setEditForm({ ...editForm, company_id: parseInt(e.target.value) || 0 })}
                required
              >
                <option value="" disabled>Select Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group full-width">
            <label>Job Description</label>
            <textarea
              rows={4}
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-btn">Save Changes</button>
            <button type="button" className="secondary-btn" onClick={() => setEditingJobId(null)}>Cancel</button>
          </div>
        </form>
      )}

      {error && <div className="error-alert">{error}</div>}

      {jobs.length === 0 && !loading && (
        <div className="jobs-empty-state card">
          <FaBriefcase className="empty-icon" style={{ fontSize: "40px", marginBottom: "15px", color: "var(--text-muted)" }} />
          <p>No job postings available yet.</p>
        </div>
      )}

      <div className="jobs-grid">
        {jobs
          .filter((job) => 
            query === "" || 
            job.title.toLowerCase().includes(query.toLowerCase()) || 
            (job.description && job.description.toLowerCase().includes(query.toLowerCase()))
          )
          .map((job) => (
          <div className="job-card" key={job.id}>
            <div className="job-header">
              <h3>{job.title}</h3>
              <span className="salary">₹{job.salary} LPA</span>
            </div>

            <div className="company">
              <FaBuilding className="job-meta-icon" /> {getCompanyName(job.company_id)}
            </div>
            
            {getCompanyLocation(job.company_id) && (
              <div className="location">
                <FaMapMarkerAlt className="job-meta-icon" /> {getCompanyLocation(job.company_id)}
              </div>
            )}

            <div className="job-desc-preview">
              <p>{job.description}</p>
            </div>

            <div className="job-footer">
              <div className="job-buttons">
                <button
                  className={`apply-btn ${job.id && appliedJobs.includes(job.id) ? "applied" : ""}`}
                  onClick={() => job.id && handleApply(job.id)}
                  disabled={job.id ? appliedJobs.includes(job.id) : false}
                >
                  {job.id && appliedJobs.includes(job.id) ? "Applied" : "Apply Now"}
                </button>
                {job.id && (_props.userRole === "admin" || _props.userRole === "hr") && (
                  <div className="admin-actions">
                    <button className="icon-btn edit" onClick={() => handleEditInit(job)} title="Edit Job">
                      <FaEdit />
                    </button>
                    <button className="icon-btn delete" onClick={() => job.id && handleDelete(job.id)} title="Delete Job">
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobCard;