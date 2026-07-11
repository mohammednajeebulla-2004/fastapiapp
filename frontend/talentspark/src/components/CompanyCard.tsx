import "./CompanyCard.css";
import type { Company } from "../types/company";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaTrash } from "react-icons/fa";

type Props = {
  companies: Company[];
  onedit: (company: Company) => void;
  ondelete: (id: number) => void;
  onadd: (company: Company) => void;
  userRole?: string | null;
};

function CompanyCard({
  companies,
  onadd,
  onedit,
  ondelete,
  userRole,
}: Props) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [editCompanyId, setEditCompanyId] =
    useState<number | null>(null);


  const [addform, setAddform] = useState<Company>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    location: "",
    jobs: [],
  });

  const [editform, setEditform] = useState<Company>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    location: "",
    jobs: [],
  });

  const handleAdd = () => {
    onadd(addform);

    setAddform({
      id: 0,
      name: "",
      email: "",
      phone: "",
      location: "",
      jobs: [],
    });
  };

  const handleDelete = (id: number) => {
    ondelete(id);
};

  const handleSave = () => {
    onedit(editform);

    setEditCompanyId(null);

    setEditform({
      id: 0,
      name: "",
      email: "",
      phone: "",
      location: "",
      jobs: [],
    });
  };

  const handleCancel = () => {
    setEditCompanyId(null);

    setEditform({
      id: 0,
      name: "",
      email: "",
      phone: "",
      location: "",
      jobs: [],
    });
  };

  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="company-wrapper">

      <div className="company-section-header">
        <h2 className="company-title">
          Company Management
        </h2>

        {(userRole === "admin" || userRole === "hr") && (
          <button
            className="add-company-toggle-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "✕ Close" : "+ Add Company"}
          </button>
        )}
      </div>

      <div className="company-grid">

        {companies
          .filter(company => 
             query === "" || 
             company.name.toLowerCase().includes(query.toLowerCase()) || 
             (company.location && company.location.toLowerCase().includes(query.toLowerCase()))
          )
          .map((company) => (

          <div
            key={company.id}
            className="company-card"
          >

            {editCompanyId === company.id ? (

              <div className="edit-form">

                <input
                  type="text"
                  value={editform.name}
                  placeholder="Company Name"
                  onChange={(e) =>
                    setEditform({
                      ...editform,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  value={editform.email}
                  placeholder="Email"
                  onChange={(e) =>
                    setEditform({
                      ...editform,
                      email: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  value={editform.phone}
                  placeholder="Phone"
                  onChange={(e) =>
                    setEditform({
                      ...editform,
                      phone: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  value={editform.location}
                  placeholder="Location"
                  onChange={(e) =>
                    setEditform({
                      ...editform,
                      location: e.target.value,
                    })
                  }
                />

                <div className="button-row">

                  <button
                    className="save-btn"
                    onClick={handleSave}
                  >
                    Save
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>

                </div>

              </div>

            ) : (
              <>
                <div className="company-header">
                  <div className="company-logo-circle">
                    {company.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="company-name">
                    {company.name}
                  </h3>
                </div>

                <div className="company-details">
                  <p>
                    <FaEnvelope className="detail-icon" /> {company.email}
                  </p>
                  <p>
                    <FaPhone className="detail-icon" /> {company.phone}
                  </p>
                  <p>
                    <FaMapMarkerAlt className="detail-icon" /> {company.location}
                  </p>
                </div>

                {(userRole === "admin" || userRole === "hr") && (
                  <div className="company-actions">
                    <button
                      className="icon-btn edit"
                      title="Edit Company"
                      onClick={() => {
                        setEditCompanyId(company.id);
                        setEditform({
                          id: company.id,
                          name: company.name,
                          email: company.email,
                          phone: company.phone,
                          location: company.location,
                          jobs: [],
                        });
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-btn delete"
                      title="Delete Company"
                      onClick={() => handleDelete(company.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </>

            )}

          </div>

        ))}

      </div>

      {showAddForm && (
        <div className="add-company">

          <h2>Add Company</h2>

          <input
            type="text"
            placeholder="Company Name"
            value={addform.name}
            onChange={(e) =>
              setAddform({
                ...addform,
                name: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Email"
            value={addform.email}
            onChange={(e) =>
              setAddform({
                ...addform,
                email: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Phone"
            value={addform.phone}
            onChange={(e) =>
              setAddform({
                ...addform,
                phone: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Location"
            value={addform.location}
            onChange={(e) =>
              setAddform({
                ...addform,
                location: e.target.value,
              })
            }
          />

          <button
            className="add-btn"
            onClick={handleAdd}
          >
            Add Company
          </button>

        </div>
      )}

    </div>
  );
}

export default CompanyCard;