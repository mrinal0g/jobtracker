import { useEffect, useState } from "react";

const AddJobs = () => {
  useEffect(() => {
    fetchJobs();
  }, []);

  const [jobs, setJobs] = useState([]);
  const [updatedJob, setUpdatedJob] = useState({
    id: "",
    title: "",
    company: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
  });

  const fetchJobs = async () => {
    const response = await fetch("http://localhost:8000/jobs");
    const data = await response.json();
    setJobs(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    setFormData({
      title: "",
      company: "",
    });
    fetchJobs();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (id) => {
    const response = await fetch(`http://localhost:8000/jobs/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    fetchJobs();
  };

  const handleUpdate = async () => {
    const response = await fetch(
      `http://localhost:8000/update-job/${updatedJob.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updatedJob.title,
          company: updatedJob.company,
        }),
      },
    );
    const data = await response.json();
    console.log(data);
    fetchJobs();
  };

  return (
    <div>
      <h1>Add a job to your tracker</h1>
      <form onSubmit={handleSubmit} className="jobsForm">
        <div>
          <label htmlFor="title">Job Title : </label>
          <input
            type="text"
            name="title"
            required
            placeholder="Job Title"
            id="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="title">Company Name : </label>
          <input
            type="text"
            required
            name="company"
            placeholder="Company Name"
            id="company"
            onChange={handleChange}
            value={formData.company}
          />
        </div>

        <br />
        <button>Add</button>
      </form>

      <h1>Current list of jobs in your tracker</h1>
      <div id="jobs-container">
        {jobs.map((job) => (
          <div key={job._id} className="job-div">
            <h2>{job.title}</h2>
            <h3>{job.company}</h3>
            <button onClick={() => handleDelete(job._id)}>Delete</button>
            <button
              onClick={() => {
                setIsUpdating(true);
                setUpdatedJob({
                  id: job._id,
                  title: job.title,
                  company: job.company,
                });
              }}
            >
              Update
            </button>
          </div>
        ))}
        {isUpdating && (
          <div className="update-modal-container">
            <div id="modal-box">
              <h2>Update Job</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate();
                  setIsUpdating(false);
                }}
              >
                <div>
                  <label htmlFor="update-title">Job Title : </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="Job Title"
                    id="update-title"
                    value={updatedJob.title}
                    onChange={(e) =>
                      setUpdatedJob({ ...updatedJob, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="update-company">Company Name : </label>
                  <input
                    type="text"
                    required
                    name="company"
                    placeholder="Company Name"
                    id="update-company"
                    onChange={(e) =>
                      setUpdatedJob({ ...updatedJob, company: e.target.value })
                    }
                    value={updatedJob.company}
                  />
                </div>
                <br />
                <button type="submit">Update Job</button>
                <button
                  onClick={() => {
                    setIsUpdating(false);
                    setUpdatedJob({ title: "", company: "" });
                  }}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AddJobs;
