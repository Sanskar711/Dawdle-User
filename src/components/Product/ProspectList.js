import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProspectList.css'; 
import goBack from '../../images/Group 20.png';
import api from '../../context/api';
import { useAuth } from '../../context/Authcontext';
import Modal from './Modal';

const ProspectList = () => {
    const [prospects, setProspects] = useState([]);
    const [filteredProspects, setFilteredProspects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [flashMessage, setFlashMessage] = useState('');
    const [selectedProspect, setSelectedProspect] = useState(null);
    const [emailData, setEmailData] = useState({
        email_subject: '',
        email_body: '',
        poc_first_name: '',
        poc_last_name: '',
        poc_email: '',
        poc_designation: '',
    });
    const [searchName, setSearchName] = useState('');
    const [searchLocation, setSearchLocation] = useState('');

    const navigate = useNavigate();
    const { productId } = useParams();
    const { isAuthenticated, userId } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        api.get(`/users/product/${productId}/prospects/`)
            .then(response => {
                setProspects(response.data);
                setFilteredProspects(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the prospects!', error);
            });
    }, [productId]);

    useEffect(() => {
        const filtered = prospects.filter(prospect =>
            prospect.company_name.toLowerCase().includes(searchName.toLowerCase()) &&
            prospect.geography.toLowerCase().includes(searchLocation.toLowerCase())
        );
        setFilteredProspects(filtered);
    }, [searchName, searchLocation, prospects]);

    const openModal = (prospect) => {
        setSelectedProspect(prospect);
        setEmailData({
            poc_first_name: prospect.first_name,
            poc_last_name: prospect.last_name,
            poc_email: prospect.email,
            poc_designation: prospect.designation,
            email_subject: '',
            email_body: ''
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProspect(null);
    };

    const handleInputChange = (e) => {
        setEmailData({ ...emailData, [e.target.name]: e.target.value });
    };

    const handleSearchChange = (e) => {
        if (e.target.name === 'searchName') {
            setSearchName(e.target.value);
        } else if (e.target.name === 'searchLocation') {
            setSearchLocation(e.target.value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const emailRequestData = {
            user_id: userId,
            prospect_id: selectedProspect.id,
            product_id: productId,
            ...emailData,
        };

        api.post('/users/email-request/', emailRequestData)
            .then(response => {
                console.log('Email request sent successfully:', response.data);
                setFlashMessage('Email sent successfully!');
                setTimeout(() => setFlashMessage(''), 3000);
                closeModal();
            })
            .catch(error => {
                console.error('There was an error sending the email request:', error);
                setFlashMessage('Failed to send email.');
                setTimeout(() => setFlashMessage(''), 3000);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="prospect-list-container">
            <button className="go-back" onClick={() => navigate(-1)}>
                <img src={goBack} alt="Go Back" className="go-back-icon" />
            </button>
            <h1>Prospect List</h1>

            {flashMessage && <div className="flash-message">{flashMessage}</div>}

            <table className="prospect-list-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Action</th>
                    </tr>
                    <tr>
                        <th>
                            <input
                                type="text"
                                name="searchName"
                                value={searchName}
                                onChange={handleSearchChange}
                                placeholder="Search by Name"
                                className="search-input"
                            />
                        </th>
                        <th>
                            <input
                                type="text"
                                name="searchLocation"
                                value={searchLocation}
                                onChange={handleSearchChange}
                                placeholder="Search by Location"
                                className="search-input"
                            />
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProspects.map((prospect, index) => (
                        <tr key={index}>
                            <td>{prospect.company_name}</td>
                            <td>{prospect.geography}</td>
                            <td className='action'>
                                <button 
                                    className={`button-link ${prospect.status !== 'open' ? 'disabled' : ''}`} 
                                    onClick={prospect.status === 'open' ? () => openModal(prospect) : null}
                                >
                                    Send Email
                                </button>
                                <a
                                    href={`/product/${productId}/options/book-meeting?prospectId=${prospect.id}`}
                                    className={`button-link ${prospect.status !== 'open' ? 'disabled' : ''}`}
                                    onClick={prospect.status !== 'open' ? (e) => e.preventDefault() : null}
                                >
                                    Book Meeting
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showModal} onClose={closeModal}>
                <h2>Send Email</h2>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Subject</label>
                        <input
                            type="text"
                            name="email_subject"
                            value={emailData.email_subject}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Body</label>
                        <textarea
                            name="email_body"
                            value={emailData.email_body}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label>First Name</label>
                        <input
                            type="text"
                            name="poc_first_name"
                            value={emailData.poc_first_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="poc_last_name"
                            value={emailData.poc_last_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            name="poc_email"
                            value={emailData.poc_email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Designation</label>
                        <input
                            type="text"
                            name="poc_designation"
                            value={emailData.poc_designation}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Email'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default ProspectList;
