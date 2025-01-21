import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css'; // Ensure custom styling is applied

function Dashboard() {
    const [candidates, setCandidates] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        middleName: '',
        lastName: '',
        permanentAddress: '',
        temporaryAddress: '',
        age: '',
        dob: '',
        bloodGroup: '',
    });
    const [error, setError] = useState(''); // State for error messages
    const [success, setSuccess] = useState(''); // State for success messages
    const [voterExists, setVoterExists] = useState(false); // State to check if voter exists
    const token = localStorage.getItem('accessToken'); // Authentication token

    useEffect(() => {
        fetchCandidates();
        checkVoterStatus();
    }, []);

    const fetchCandidates = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/candidate/candidates/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data.map((res) => res.candidate_id
            ));

            setCandidates(response.data);
            setError(''); // Reset error if successful
        } catch (error) {
            setError('Error fetching candidates.');
        }
    };

    const checkVoterStatus = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/voters/voters/user/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVoterExists(response.data.length > 0); // Check if voter exists
        } catch (error) {
            setError('Error checking voter status.');
        }
    };

    const handleVote = async (id) => {
        try {
            await axios.post(`http://localhost:8000/votes/votes/`, {
                'candidate': id, // Use the candidate ID
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCandidates();
            setSuccess('Your vote has been successfully cast!');
            setError(''); // Reset error if successful
        } catch (error) {
            setError('Error casting vote.');
            setSuccess(''); // Reset success if error occurs
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddVoter = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.permanentAddress || !formData.age || !formData.dob) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            await axios.post('http://localhost:8000/voters/voters/', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVoterExists(true); // Set voter exists to true after successful registration
            setFormData({
                fullName: '',
                middleName: '',
                lastName: '',
                permanentAddress: '',
                temporaryAddress: '',
                age: '',
                dob: '',
                bloodGroup: '',
            });
            setSuccess('Voter registered successfully!');
            setError(''); // Reset error if successful
        } catch (error) {
            setError('Error registering voter.');
            setSuccess(''); // Reset success if error occurs
        }
    };

    const handleLogin = () => {
        window.location.href = '/login'; // Redirect to login page
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken'); // Remove the token
        window.location.href = '/login'; // Redirect to login page
    };

    return (
        <div className="dashboard">
            <div className="voting-section">
                < h2>Election Voting</h2>
                {voterExists ? (
                    <div className="candidate-list">
                        <h3>Vote for Your Candidate</h3>
                        <ul>
                            {candidates.map((candidate) => (
                                <li key={candidate.id}>
                                    <strong>{candidate.fullName}</strong> ({candidate.party}) - Position: {candidate.position}
                                    <button onClick={() => handleVote(candidate.candidate_id
                                    )}>Vote</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <form onSubmit={handleAddVoter}>
                        <h3>Register as a Voter</h3>
                        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} required />
                        <input type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleInputChange} />
                        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required />
                        <input type="text" name="permanentAddress" placeholder="Permanent Address" value={formData.permanentAddress} onChange={handleInputChange} required />
                        <input type="text" name="temporaryAddress" placeholder="Temporary Address" value={formData.temporaryAddress} onChange={handleInputChange} />
                        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} required />
                        <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleInputChange} required />
                        <input type="text" name="bloodGroup" placeholder="Blood Group" value={formData.bloodGroup} onChange={handleInputChange} />
                        <button type="submit">Register Voter</button>
                    </form>
                )}
                {/* Display Error or Success */}
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </div>
        </div>
    );
}

export default Dashboard;