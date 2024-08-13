import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './BookMeeting.css';
import goBack from '../images/Group 20.png';
import api from '../context/api';

const BookMeeting = () => {
    const [prospects, setProspects] = useState([]);
    const [selectedProspect, setSelectedProspect] = useState('');
    const [prospectName, setProspectName] = useState('');
    const navigate = useNavigate();
    const { productId } = useParams();
    const location = useLocation();
    
    // Extract productName and companyName from location state
    const { productName, companyName } = location.state || { productName: '', companyName: '' };

    useEffect(() => {
        // Fetch prospects from backend API
        api.get(`/users/product/${productId}/prospects/`)
            .then(response => {
                setProspects(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the prospects!', error);
            });
    }, [productId]);

    const handleSelectChange = (event) => {
        setSelectedProspect(event.target.value);
    };

    const handleInputChange = (event) => {
        setProspectName(event.target.value);
    };

    const handleSubmit = () => {
        // Handle the booking logic here, using selectedProspect or prospectName
        console.log('Selected Prospect:', selectedProspect);
        console.log('Provided Prospect Name:', prospectName);
        // Navigate to the next step or show confirmation
    };

    return (
        <>
        <button className="go-back" onClick={() => navigate(-1)}>
                <img src={goBack} alt="Go Back" className="go-back-icon" />
            </button>
        <div className="book-meeting-container">
            
            <h1>{productName || "Product Name"}</h1>
            <h2>{companyName || "Company"}</h2>

            <div className="prospect-information">
                <h3>Prospect Information</h3>
                <p>Please provide the prospect information</p>

                <div className="prospect-select">
                    <label>Select Prospect</label>
                    <select value={selectedProspect} onChange={handleSelectChange}>
                        <option value="" disabled>Select Prospect</option>
                        {prospects.map((prospect) => (
                            <option key={prospect.id} value={prospect.id}>
                                {prospect.company_name}
                            </option>
                        ))}
                    </select>
                    <small>Choose from the list provided</small>
                </div>

                <div className="or-divider">Or</div>

                <div className="prospect-input">
                    <label>Provide Prospect</label>
                    <input
                        type="text"
                        placeholder="Enter Prospect Name"
                        value={prospectName}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <button className="next-button" onClick={handleSubmit}>
                Next
            </button>
        </div>
        </>
    );
};

export default BookMeeting;
