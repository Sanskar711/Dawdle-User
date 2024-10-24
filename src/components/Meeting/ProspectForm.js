import React, { useState } from 'react';
import './ProspectForm.css';

const ProspectDetailsModal = ({ isOpen, onClose, onNext, useCases, newProspect }) => {
    const [prospectDetails, setProspectDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        designation: '',
        phoneNumber: '',
        additionalInfo: '',
        useCases: [],
        geographicalLocation: newProspect ? '' : undefined  // Conditionally add this field
    });

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProspectDetails({
            ...prospectDetails,
            [name]: value
        });
    };

    const handleUseCaseChange = (e) => {
        const { value, checked } = e.target;
        const updatedUseCases = checked
            ? [...prospectDetails.useCases, value]
            : prospectDetails.useCases.filter((useCase) => useCase !== value);

        setProspectDetails({
            ...prospectDetails,
            useCases: updatedUseCases
        });
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        onNext(prospectDetails);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Enter Prospect Details</h2>
                <button className="close-button" onClick={onClose}>×</button>
                <form onSubmit={handleOnSubmit}>
                    <div className="form-group">
                        <label>POC First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Enter first name"
                            value={prospectDetails.firstName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>POC Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Enter last name"
                            value={prospectDetails.lastName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>POC Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email address"
                            value={prospectDetails.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>POC Designation</label>
                        <input
                            type="text"
                            name="designation"
                            placeholder="Enter designation"
                            value={prospectDetails.designation}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>POC Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Enter phone number"
                            value={prospectDetails.phoneNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Additional Information</label>
                        <textarea
                            name="additionalInfo"
                            placeholder="Enter additional information"
                            value={prospectDetails.additionalInfo}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Select Use Cases</label>
                        <div className="checkbox-group">
                            {useCases.map((useCase) => (
                                <div key={useCase.id} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        id={`useCase-${useCase.id}`}
                                        name="useCases"
                                        value={useCase.title}
                                        checked={prospectDetails.useCases.includes(useCase.title)}
                                        onChange={handleUseCaseChange}
                                    />
                                    <label htmlFor={`useCase-${useCase.id}`}>{useCase.title}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    {newProspect && (
                        <div className="form-group">
                            <label>Prospect Geography</label>
                            <select
                                name="geographicalLocation"
                                value={prospectDetails.geographicalLocation || ''}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Geography</option>
                                <option value="Australia">Australia</option>
                                <option value="Europe">Europe</option>
                                <option value="India">India</option>
                                <option value="LATAM">LATAM</option>
                                <option value="Middle East">Middle East</option>
                                <option value="South East Asia">South East Asia (SEA)</option>
                                <option value="USA">USA</option>
                            </select>
                        </div>
                    )}
                    <button type="submit" className="schedule-button">Next</button>
                </form>
            </div>
        </div>
    );
};

export default ProspectDetailsModal;
