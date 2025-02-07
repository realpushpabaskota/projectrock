import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';
import AddCandidate from '../pages/AddCandidate';
import VoterList from '../pages/VoterList';

function Dashboard() {
    const [candidates, setCandidates] = useState([]);
    const [formData, setFormData] = useState({
        full_name: '',
        middle_name: '',
        last_name: '',
        permanent_address: '',
        temporary_address: '',
        age: '',
        dob: '',
        blood_group: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [voterExists, setVoterExists] = useState(false);
    const token = localStorage.getItem('accessToken');
    const admin = localStorage.getItem('admin') || 'false';

    useEffect(() => {
        fetchCandidates();
        checkVoterStatus();
    }, []);

    const fetchCandidates = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/candidate/candidates/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCandidates(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching candidates.');
        }
    };

    const checkVoterStatus = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/voters/voters/user/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVoterExists(response.data.length > 0);
        } catch (err) {
            setError(err.response?.data?.message || 'Error checking voter status.');
        }
    };

    const handleVote = async (id) => {
        try {
            await axios.post(
                'http://127.0.0.1:8000/votes/votes/',
                { candidate: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCandidates();
            setSuccess('Your vote has been successfully cast!');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error casting vote.');
            setSuccess('');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    console.log('admin' + admin)
    const handleAddVoter = async (e) => {
        e.preventDefault();

        if (!formData.full_name || !formData.permanent_address || !formData.age || !formData.dob) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/voters/voters/create/', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVoterExists(true);
            setFormData({
                full_name: '',
                middle_name: '',
                last_name: '',
                permanent_address: '',
                temporary_address: '',
                age: '',
                dob: '',
                blood_group: '',
            });
            setSuccess('Voter registered successfully!');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error registering voter.');
            setSuccess('');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('admin');
        window.location.href = '/';
    };

    return (
        <div className="dashboard">
            <div className="voting-section">
                <h2>Election Voting</h2>
                {voterExists ? (
                    <div className="candidate-list">
                        <h3>Vote for Your Candidate</h3>
                        <ul>
                            {candidates.map((candidate) => (
                                <li key={candidate.id} className="candidate-card">
                                    <div className="candidate-info">
                                        <strong>{candidate.full_name}</strong>
                                        <p>Party: {candidate.party}</p>
                                        <p>Position: {candidate.position}</p>
                                    </div>
                                    <button className="vote-button" onClick={() => handleVote(candidate.candidate_id)}>Vote</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <form onSubmit={handleAddVoter} className="voter-form">
                        <h3>Register as a Voter</h3>
                        <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleInputChange} required />
                        <input type="text" name="middle_name" placeholder="Middle Name" value={formData.middle_name} onChange={handleInputChange} />
                        <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleInputChange} />
                        <input type="text" name="permanent_address" placeholder="Permanent Address" value={formData.permanent_address} onChange={handleInputChange} required />
                        <input type="text" name="temporary_address" placeholder="Temporary Address" value={formData.temporary_address} onChange={handleInputChange} />
                        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} required />
                        <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} required />
                        <input type="text" name="blood_group" placeholder="Blood Group" value={formData.blood_group} onChange={handleInputChange} />
                        <button type="submit" className="register-button">Register Voter</button>
                    </form>
                )}
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </div>
            {admin === 'true' && (
                <div className="admin-section">
                    <AddCandidate />
                    <VoterList />
                </div>
            )}
            <div className="logout-section">
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </div>
    );
}

export default Dashboard;
