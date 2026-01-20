import { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (!formData.username || !formData.password) {
      alert("Please fill in all fields");
      return;
    } else if (
      formData.username == "admin" &&
      formData.password == "admin123"
    ) {
      alert("Login Successful");
      window.location.href = "/addjobs";
    }
    // Handle login logic here
  }
  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          required
          value={formData.username}
          onChange={handleChange}
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <a href="/">
        <button>Back to Home</button>
      </a>
    </>
  );
};

export default Login;
