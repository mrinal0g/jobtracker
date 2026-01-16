import { useEffect, useState } from "react";

const AddJobs = () => {
  useEffect(() => {
    fetchJobs();
  }, []);

  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
  });

  const fetchJobs = async () => {
    const response = await fetch("http://localhost:8000/jobs");
    const data = await response.json();
    setJobs(data);
    console.log(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log(data);
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
    console.log(id);

    const response = await fetch(`http://localhost:8000/jobs/${id}`, {
      method: "DELETE",
    });
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
      <div>
        <h1>Current list of jobs in your tracker</h1>
        {jobs.map((job) => (
          <div key={job._id} className="job-div">
            <h2>{job.title}</h2>
            <h3>{job.company}</h3>
            <button onClick={() => handleDelete(job._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AddJobs;
