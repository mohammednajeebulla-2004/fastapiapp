import "./CompanyCard.css";
import type { Company } from "../types/company";
import { useState } from "react";

type Props = {
  companies: Company[];
  onedit: (company: Company) => void;
  ondelete: (id: number) => void;
  onadd: (company: Company) => void;
};

function CompanyCard({
  companies,
  onadd,
  onedit,
  ondelete,
}: Props) {
  const [editCompanyId, setEditCompanyId] =
    useState<number | null>(null);

  const [editcompany, setEditcompany] =
    useState<Company | null>(null);

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

  const handleEdit = (company: Company) => {
    onedit(company);

    setEditform({
      id: company.id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      location: company.location,
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

  return (
    <div className="company-wrapper">

      <h2 className="company-title">
        Company Management
      </h2>

      <div className="company-grid">

        {companies.map((company) => (

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

                <h3 className="company-name">
                  {company.name}
                </h3>

                <p>
                  <strong>Email:</strong> {company.email}
                </p>

                <p>
                  <strong>Phone:</strong> {company.phone}
                </p>

                <p>
                  <strong>Location:</strong> {company.location}
                </p>

                <div className="button-row">

                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditCompanyId(company.id);
                      setEditcompany(company);

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
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(company.id)}
                  >
                    Delete
                  </button>

                </div>

              </>

            )}

          </div>

        ))}

      </div>

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

    </div>
  );
}

export default CompanyCard;