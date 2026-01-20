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
    skills: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [jobLink, setJobLink] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [jobQuestions, setJobQuestions] = useState({}); // Store Q&A for each job
  const [selectedJobAnswer, setSelectedJobAnswer] = useState(null); // For modal display
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    skills: "",
  });

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:8000/jobs");
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const handleAiExtraction = async () => {
    if (!jobLink) return alert("Please paste a link first!");

    setIsLoadingAI(true);
    try {
      const response = await fetch("http://localhost:8000/extract-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jobLink }),
      });

      if (!response.ok) throw new Error("Failed to extract data");

      const data = await response.json();

      setFormData({
        title: data.title || "",
        company: data.company || "",
        skills: data.skills ? data.skills.join(", ") : "",
      });
    } catch (error) {
      console.error(error);
      alert("Could not extract data. Try manual entry.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
    };

    await fetch("http://localhost:8000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setFormData({ title: "", company: "", skills: "" });
    setJobLink("");
    fetchJobs();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8000/jobs/${id}`, { method: "DELETE" });
    fetchJobs();
  };

  const handleAskQuestion = async (jobId) => {
    const question = jobQuestions[jobId]?.question || "";
    if (!question.trim()) return;

    setJobQuestions({
      ...jobQuestions,
      [jobId]: { ...jobQuestions[jobId], loading: true },
    });

    try {
      const response = await fetch(
        `http://localhost:8000/ask-about-job/${jobId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        },
      );

      if (!response.ok) throw new Error("Failed to get answer");

      const data = await response.json();
      setJobQuestions({
        ...jobQuestions,
        [jobId]: {
          question: "",
          answer: data.answer,
          loading: false,
        },
      });
      // Show answer in modal
      setSelectedJobAnswer(data.answer);
    } catch (error) {
      console.error(error);
      setJobQuestions({
        ...jobQuestions,
        [jobId]: {
          ...jobQuestions[jobId],
          answer: "Error getting answer. Please try again.",
          loading: false,
        },
      });
    }
  };

  const handleUpdate = async () => {
    const skillsArray = updatedJob.skills
      ? updatedJob.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
      : [];

    await fetch(`http://localhost:8000/update-job/${updatedJob.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: updatedJob.title,
        company: updatedJob.company,
        skills: skillsArray,
      }),
    });
    fetchJobs();
  };

  return (
    <div>
      <h1>Job Tracker</h1>

      {/* AI Section - Class added, inline styles removed */}
      <div className="ai-section">
        <input
          type="text"
          placeholder="Paste Job Link here for AI Auto-fill..."
          value={jobLink}
          onChange={(e) => setJobLink(e.target.value)}
        />
        <button onClick={handleAiExtraction} disabled={isLoadingAI}>
          {isLoadingAI ? "Thinking..." : "Auto-fill"}
        </button>
      </div>

      <div className="flex-container">
        <form onSubmit={handleSubmit} className="jobsForm">
          <div className="form-group">
            <label htmlFor="title">Job Title</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Frontend Developer"
              id="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              type="text"
              required
              name="company"
              placeholder="e.g. Google"
              id="company"
              onChange={handleChange}
              value={formData.company}
            />
          </div>
          <div className="form-group">
            <label htmlFor="skills">Skills</label>
            <input
              type="text"
              name="skills"
              placeholder="React, Node.js, Design..."
              id="skills"
              onChange={handleChange}
              value={formData.skills}
            />
          </div>
          <button type="submit">Add Job</button>
        </form>

        {/* Job List */}
        <div id="jobs-container">
          {jobs.map((job) => (
            <div key={job._id} className="job-div">
              <h2>{job.title}</h2>
              <h3>{job.company}</h3>

              {/* Skills Pills */}
              {job.skills && job.skills.length > 0 && (
                <div className="tags-container">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="tag-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Chat Box for Job Questions */}
              <div className="chat-box">
                <h4>Ask about this job:</h4>
                <div className="chat-box-input-container">
                  <input
                    type="text"
                    placeholder="e.g., What are the main requirements?"
                    value={jobQuestions[job._id]?.question || ""}
                    onChange={(e) =>
                      setJobQuestions({
                        ...jobQuestions,
                        [job._id]: {
                          ...jobQuestions[job._id],
                          question: e.target.value,
                        },
                      })
                    }
                    className="chat-box-input"
                  />
                  <button
                    onClick={() => handleAskQuestion(job._id)}
                    disabled={jobQuestions[job._id]?.loading}
                    className="chat-box-button"
                  >
                    {jobQuestions[job._id]?.loading ? "Thinking..." : "Ask"}
                  </button>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(job._id)}
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setIsUpdating(true);
                    setUpdatedJob({
                      id: job._id,
                      title: job.title,
                      company: job.company,
                      skills: job.skills ? job.skills.join(", ") : "",
                    });
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Modal */}
      {selectedJobAnswer && (
        <div className="update-modal-container">
          <div id="modal-box" className="modal-large">
            <div className="modal-header">
              <h2>AI Answer</h2>
              <button
                onClick={() => setSelectedJobAnswer(null)}
                className="modal-close-btn"
              >
                ✕
              </button>
            </div>
            <div className="modal-answer-content">{selectedJobAnswer}</div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isUpdating && (
        <div className="update-modal-container">
          <div id="modal-box">
            <h2>Update Job</h2>
            <form
              className="jobsForm form-modal"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
                setIsUpdating(false);
              }}
            >
              <div className="form-group">
                <label htmlFor="update-title">Job Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  id="update-title"
                  value={updatedJob.title}
                  onChange={(e) =>
                    setUpdatedJob({ ...updatedJob, title: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="update-company">Company</label>
                <input
                  type="text"
                  required
                  name="company"
                  id="update-company"
                  onChange={(e) =>
                    setUpdatedJob({ ...updatedJob, company: e.target.value })
                  }
                  value={updatedJob.company}
                />
              </div>
              <div className="form-group">
                <label htmlFor="update-skills">Skills</label>
                <input
                  type="text"
                  name="skills"
                  id="update-skills"
                  value={updatedJob.skills}
                  onChange={(e) =>
                    setUpdatedJob({ ...updatedJob, skills: e.target.value })
                  }
                />
              </div>

              <div className="card-actions">
                <button type="submit">Save Changes</button>
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => {
                    setIsUpdating(false);
                    setUpdatedJob({
                      id: "",
                      title: "",
                      company: "",
                      skills: "",
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddJobs;
