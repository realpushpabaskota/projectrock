import React, { useEffect, useState } from "react";

const VoterRoll = () => {
    const [voters, setVoters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVoter, setSelectedVoter] = useState(null);

    // State for adding a new voter
    const [formData, setFormData] = useState({
        fullName: "",
        middleName: "",
        lastName: "",
        permanentAddress: "",
        temporaryAddress: "",
        age: "",
        dob: "",
        voterImage: null,
        bloodGroup: "",
    });

    useEffect(() => {
        // Fetch the list of voters from the backend
        fetch("http://127.0.0.1:8000/voters/list/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch voters.");
                }
                return response.json();
            })
            .then((data) => {
                setVoters(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const handleFormChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === "file" ? files[0] : value,
        });
    };

    const handleAddVoter = (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        fetch("http://127.0.0.1:8000/voters/create/", {
            method: "POST",
            body: data,
        })
            .then((response) => {
                if (response.ok) {
                    alert("Voter added successfully!");
                    setFormData({
                        fullName: "",
                        middleName: "",
                        lastName: "",
                        permanentAddress: "",
                        temporaryAddress: "",
                        age: "",
                        dob: "",
                        voterImage: null,
                        bloodGroup: "",
                    });
                    return response.json();
                } else {
                    alert("Failed to add voter.");
                }
            })
            .then((newVoter) => {
                setVoters([...voters, newVoter]); // Add new voter to the list
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleSelectVoter = (voter) => {
        setSelectedVoter(voter);
    };

    if (loading) {
        return <div>Loading voters...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Voter Roll</h2>
            <table>
                <thead>
                    <tr>
                        <th>Voter Number</th>
                        <th>Full Name</th>
                        <th>Age</th>
                        <th>Date of Birth</th>
                        <th>Permanent Address</th>
                        <th>Blood Group</th>
                        <th>Voter Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {voters.map((voter) => (
                        <tr key={voter.voter_number}>
                            <td>{voter.voter_number}</td>
                            <td>{voter.full_name}</td>
                            <td>{voter.age}</td>
                            <td>{voter.dob}</td>
                            <td>{voter.permanent_address}</td>
                            <td>{voter.blood_group}</td>
                            <td>
                                {voter.voter_image ? (
                                    <img
                                        src={`http://127.0.0.1:8000${voter.voter_image}`}
                                        alt="Voter"
                                        width="50"
                                    />
                                ) : (
                                    "No image"
                                )}
                            </td>
                            <td>
                                <button onClick={() => handleSelectVoter(voter)}>
                                    Select
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedVoter && (
                <div>
                    <h3>Selected Voter</h3>
                    <p>
                        Voter Number: {selectedVoter.voter_number}<br />
                        Full Name: {selectedVoter.full_name}<br />
                        Age: {selectedVoter.age}<br />
                        Date of Birth: {selectedVoter.dob}<br />
                        Permanent Address: {selectedVoter.permanent_address}<br />
                        Blood Group: {selectedVoter.blood_group}
                    </p>
                </div>
            )}

            <h3>Add Voter</h3>
            <form onSubmit={handleAddVoter} encType="multipart/form-data">
                <label>Full Name:</label>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                />
                <br />
                <label>Middle Name:</label>
                <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleFormChange}
                />
                <br />
                <label>Last Name:</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    required
                />
                <br />
                <label>Permanent Address:</label>
                <input
                    type="text"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleFormChange}
                    required
                />
                <br />
                <label>Temporary Address:</label>
                <input
                    type="text"
                    name="temporaryAddress"
                    value={formData.temporaryAddress}
                    onChange={handleFormChange}
                />
                <br />
                <label>Age:</label>
                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleFormChange}
                    required
                />
                <br />
                <label>Date of Birth:</label>
                <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleFormChange}
                    required
                />
                <br />
                <label>Voter Image:</label>
                <input
                    type="file"
                    name="voterImage"
                    onChange={handleFormChange}
                    accept="image/*"
                />
                <br />
                <label>Blood Group:</label>
                <input
                    type="text"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleFormChange}
                />
                <br />
                <button type="submit">Add Voter</button>
            </form>
        </div>
    );
};

export default VoterRoll;
