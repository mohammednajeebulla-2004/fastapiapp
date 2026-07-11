import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./JobCard.css";
import type { Job } from "../types/job";
import type { Company } from "../types/company";
import { FaBriefcase, FaTrash, FaEdit, FaPlus, FaTimes, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";

interface Props {
  jobs: Job[];
  companies: Company[];
  onedit: (job: Job) => void;
  ondelete: (id: number) => void;
  onadd: (job: Job) => void;
  userRole?: string | null;
}

function JobCard(props: Props) {
  const { jobs, companies, onedit, ondelete, onadd, userRole } = props;
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

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

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.company_id) {
      alert("Please select a company");
      return;
    }
    onadd(addForm);
    setIsAdding(false);
    setAddForm({ title: "", salary: 0, description: "", company_id: 0 });
  };

  const handleEditInit = (job: Job) => {
    if (job.id) {
      setEditingJobId(job.id);
      setEditForm(job);
    }
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJobId) return;
    onedit(editForm);
    setEditingJobId(null);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    ondelete(id);
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

  return (
    <div className="job-section">
      <div className="job-section-header">
        <h2 className="job-title">Featured Jobs</h2>
        {(userRole === "admin" || userRole === "hr") && (
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

      {jobs.length === 0 && (
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
                {job.id && (userRole === "admin" || userRole === "hr") && (
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