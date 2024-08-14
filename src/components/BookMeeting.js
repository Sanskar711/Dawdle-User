import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './BookMeeting.css';
import goBack from '../images/Group 20.png';
import api from '../context/api';
import ProspectDetailsModal from './ProspectForm';

const BookMeeting = () => {
    const [prospects, setProspects] = useState([]);
    const [selectedProspect, setSelectedProspect] = useState('');
    const [prospectName, setProspectName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [useCases, setUseCases] = useState([]);
    const navigate = useNavigate();
    const { productId } = useParams();
    const location = useLocation();

    const { productName, companyName } = location.state || { productName: '', companyName: '' };

    useEffect(() => {
        api.get(`/users/product/${productId}/prospects/`)
            .then(response => {
                setProspects(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the prospects!', error);
            });
    }, [productId]);

    useEffect(() => {
        if (isModalOpen) {
            api.get(`/users/product/${productId}/usecases/`)
                .then(response => {
                    setUseCases(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the use cases!', error);
                });
        }
    }, [isModalOpen, productId]);

    const handleSelectChange = (event) => {
        setSelectedProspect(event.target.value);
        if (event.target.value) {
            setProspectName('');
        }
    };

    const handleInputChange = (event) => {
        setProspectName(event.target.value);
        if (event.target.value) {
            setSelectedProspect('');
        }
    };

    const handleSubmit = () => {
        if (selectedProspect || prospectName) {
            setIsModalOpen(true); // Open the modal
        } else {
            alert('Please select or provide a prospect name.');
        }
    };

    const handleSave = (event) => {
        event.preventDefault();
        // You can handle saving the form data here
        setIsModalOpen(false);
        // Navigate to confirmation or next step
        navigate('/confirmation', { state: { prospect: selectedProspect || prospectName, productName, companyName } });
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
                        <select value={selectedProspect} onChange={handleSelectChange} disabled={!!prospectName}>
                            <option value="">Select Prospect</option>
                            {prospects.map((prospect) => (
                                <option key={prospect.id} value={prospect.id}>
                                    {prospect.company_name}
                                </option>
                            ))}
                        </select>
                        <small>Choose from the list provided or clear the selection</small>
                    </div>

                    <div className="or-divider">Or</div>

                    <div className="prospect-input">
                        <label>Provide Prospect</label>
                        <input
                            type="text"
                            placeholder="Enter Prospect Name"
                            value={prospectName}
                            onChange={handleInputChange}
                            disabled={!!selectedProspect}
                        />
                    </div>
                </div>

                <button className="next-button" onClick={handleSubmit}>
                    Next
                </button>
            </div>

            {/* Modal for prospect details */}
            <ProspectDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                useCases={useCases}
            />
        </>
    );
};

export default BookMeeting;
