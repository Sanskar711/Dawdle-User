import React from 'react';
import './ProspectForm.css';

const ProspectDetailsModal = ({ isOpen, onClose, onSave, useCases }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Enter Prospect Details</h2>
                <button className="close-button" onClick={onClose}>×</button>
                <form onSubmit={onSave}>
                    <div className="form-group">
                        <label>POC First Name</label>
                        <input type="text" placeholder="Enter first name" />
                    </div>
                    <div className="form-group">
                        <label>POC Last Name</label>
                        <input type="text" placeholder="Enter last name" />
                    </div>
                    <div className="form-group">
                        <label>POC Email</label>
                        <input type="email" placeholder="Enter email address" />
                    </div>
                    <div className="form-group">
                        <label>POC Designation</label>
                        <input type="text" placeholder="Enter designation" />
                    </div>
                    <div className="form-group">
                        <label>POC Phone Number</label>
                        <input type="text" placeholder="Enter phone number" />
                    </div>
                    <div className="form-group">
                        <label>Additional Information</label>
                        <textarea placeholder="Enter additional information"></textarea>
                    </div>
                    <div className="form-group">
                        <label>Select Use Case</label>
                        <select>
                            <option value="">Select Use Case</option>
                            {useCases.map((useCase) => (
                                <option key={useCase.id} value={useCase.id}>
                                    {useCase.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="schedule-button">Schedule Meeting</button>
                </form>
            </div>
        </div>
    );
};

export default ProspectDetailsModal;
