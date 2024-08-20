import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './BookMeeting.css';
import goBack from '../../images/Group 20.png';
import api from '../../context/api';
import ProspectDetailsModal from './ProspectForm';
import QualifyingQuestionsModal from './QualifyingQuestionModal';
import { useAuth } from '../../context/Authcontext';
import Cookies from 'js-cookie';

const BookMeeting = () => {
    const [prospects, setProspects] = useState([]);
    const [selectedProspect, setSelectedProspect] = useState('');
    const [prospectName, setProspectName] = useState('');
    const [isProspectModalOpen, setIsProspectModalOpen] = useState(false);
    const [isQualifyingModalOpen, setIsQualifyingModalOpen] = useState(false);
    const [useCases, setUseCases] = useState([]);
    const navigate = useNavigate();
    const { productId } = useParams();
    const location = useLocation();
    const { userId } = useAuth();
    const { productName, companyName } = location.state || { productName: '', companyName: '' };
    const [prospectDetails, setProspectDetails] = useState(null);

    const { isAuthenticated } = useAuth();
    useEffect(()=>{
        if(!isAuthenticated){
            navigate('/login')
        }
    },[isAuthenticated])
    // Retrieve prospectId from query parameters
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const prospectId = queryParams.get('prospectId');
        if (prospectId) {
            setSelectedProspect(prospectId);
        }
    }, [location]);

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
        if (isProspectModalOpen) {
            api.get(`/users/product/${productId}/usecases/`)
                .then(response => {
                    setUseCases(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the use cases!', error);
                });
        }
    }, [isProspectModalOpen, productId]);

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

    const handleProspectSubmit = async (details) => {
        setProspectDetails(details);
        if (selectedProspect) {
            setIsProspectModalOpen(false);
            setIsQualifyingModalOpen(true);
        } else if (prospectName) {
            // Create a new prospect
            try {
                // console.log(details);
                const newProspect = {
                    company_name: prospectName,
                    geography: details.geographicalLocation,
                };

                const response = await api.post(`/users/prospects/create/`, newProspect);

                if (response.status === 201) {
                    setSelectedProspect(response.data.id); // Use the new prospect's ID
                    const assignProspect = {
                        product_prospects: [response.data.id]
                    };
                    const response2 = await api.get(`/users/products/${productId}/add_prospect/${response.data.id}/`);
                    if (response2.status === 200){
                    setIsProspectModalOpen(false);
                    setIsQualifyingModalOpen(true);
                    }
                }
            } catch (error) {
                console.error('Error creating prospect:', error);
                alert('There was an error creating the prospect. Please try again.');
            }
        } else {
            alert('Please select or provide a prospect name.');
        }
    };

    const handleQualifyingSubmit = async (responses) => {
        setIsQualifyingModalOpen(false);
        const csrfToken = Cookies.get('csrftoken');
        console.log(prospectDetails)
        try {
            const meetingData = {
                prospect_id: selectedProspect || prospectDetails.prospectId,
                user_id: userId,
                qualifying_responses: responses,
                scheduled_at: new Date().toISOString(), // Example date, this should be your meeting date
                poc_first_name: prospectDetails.firstName,
                poc_last_name: prospectDetails.lastName,
                poc_email: prospectDetails.email,
                poc_phone_number: prospectDetails.phoneNumber,
                poc_designation: prospectDetails.designation,
                other_relevant_details: prospectDetails.additionalInfo,
                product_id: productId,
            };
            console.log(meetingData);
            const response = await api.post('/users/meetings/create/', meetingData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
            });

            if (response.status === 201) {
                console.log(productName,prospectName,companyName)
                navigate('/confirmation', {
                    state: {
                        prospect: selectedProspect || prospectName,
                        productName,
                        companyName,
                        responses,
                    },
                });
            } else {
                alert('There was an error scheduling the meeting. Please try again.');
            }
        } catch (error) {
            console.error('Error scheduling meeting:', error);
            alert('There was an error scheduling the meeting. Please try again.');
        }
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

                <button className="next-button" onClick={() => setIsProspectModalOpen(true)}>
                    Next
                </button>
            </div>

            {/* Modals */}
            <ProspectDetailsModal
                isOpen={isProspectModalOpen}
                onClose={() => setIsProspectModalOpen(false)}
                onNext={handleProspectSubmit}
                useCases={useCases}
                newProspect={selectedProspect === ''}
            />

            <QualifyingQuestionsModal
                isOpen={isQualifyingModalOpen}
                onClose={() => setIsQualifyingModalOpen(false)}
                onSave={handleQualifyingSubmit}
                productId={productId}
            />
        </>
    );
};

export default BookMeeting;
