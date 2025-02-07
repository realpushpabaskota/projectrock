import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios"; // Import axios
import Navbar from "./components/Navbar";
import "./App.css";

// Import Pages
import LoginPage from "./pages/LoginPage"; // Login page
import RegistrationForm from "./pages/RegistrationForm"; // Registration form page
import VotingPortal from "./pages/VotingPortal";
import VoterRoll from "./pages/VoterRoll";
import ElectionResults from "./pages/ElectionResults";
import Admin from "./pages/Admin";

// Import assets for feature cards
import Card from "./components/Card";
import feature2 from "./assets/images/features2.jpg";
import features6 from "./assets/images/features6.jpg";
import feature3 from "./assets/images/features3.png";
import feature4 from "./assets/images/features4.png";
import Dashboard from "./dashboard/Dashboard";
import ConnectBlockchain from "./components/wallet/ConnectBlockchain";

// Home Page Content
function HomePage() {
  return (
    <div className="white-background">
      <h1>Online Voting System </h1>

      <div className="card-container row-1">
        <Card
          imageSrc={feature2}
          title="Voting Portal"
          buttonText="Vote Now"
          navigateTo="/voting-portal"
        />


        <Card
          imageSrc={features6}
          title="Admin"
          buttonText="Enter here"
          navigateTo="/Admin"
        />
      </div>
      <div className="card-container row-2">
        <Card
          imageSrc={feature4}
          title="Election Results"
          buttonText="View Results"
          navigateTo="/election-results"
        />
        <Card
          imageSrc={feature3}
          title="Check Voter Roll"
          buttonText="View Details"
          navigateTo="/voter-roll"
        />
      </div>
    </div>
  );
}

function App() {
  // Create state variables for managing login
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mobile number and password
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobileNo)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Send POST request to the backend login API using axios
      const response = await axios.post("http://127.0.0.1:8000/user/login/", {
        phone: mobileNo,
        password: password,
      });

      setLoading(false);

      if (response.status === 200) {
        // Save JWT tokens in localStorage
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);

        alert("Login successful!");
        window.location.href = "/dashboard"; // Redirect to the dashboard or another page
      }
    } catch (err) {
      setLoading(false);
      if (err.response) {
        // Backend error response
        setError(
          err.response.data.detail || "Invalid mobile number or password."
        );
      } else {
        // Network or other error
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <>
      <ConnectBlockchain />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Home Route */}
          <Route
            path="/login"
            element={
              <LoginPage
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
              />
            }
          />{" "}
          {/* Login Page */}
          <Route path="/new-registration" element={<RegistrationForm />} />{" "}
          {/* Registration Form */}
          <Route path="/voting-portal" element={<VotingPortal />} />{" "}
          {/* Voting Portal */}
          <Route path="/voter-roll" element={<VoterRoll />} />{" "}
          {/* Voter Roll */}
          <Route path="/election-results" element={<ElectionResults />} />{" "}
          {/* Election Results */}
          <Route path="/Admin" element={<Admin />} />{" "}
          {/* E-Bulletin */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;