import { useState } from "react";
import AddJobs from "./AddJobs";
import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <header>
        <img src="logo.png" alt="Logo" />
        <h1>PerJob</h1>
        <nav>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
          <Link to="/">Home</Link>
          <Link to="/contacts">Contacts</Link>
        </nav>
      </header>
      <h1>Welcome to your personalized AI job tracker</h1>
      <p>
        This application helps you manage and track your job applications with
        the assistance of AI. You can add new job listings, update their status,
        and receive insights to improve your job search process.
      </p>
    </>
  );
}

export default App;
