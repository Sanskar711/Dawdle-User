import React, { useState } from 'react';
import './SendEmailForm.css';

const SendEmailForm = ({ prospect, productId, onClose }) => {
    const [formData, setFormData] = useState({
        pocFirstName: '',
        pocLastName: '',
        pocEmail: prospect?.email || '',  // Use optional chaining
        pocDesignation: '',
        emailSubject: '',
        emailBody: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!prospect) {
            alert('Prospect data is missing.');
            return;
        }

        const payload = {
            user_id: 1, // Replace with the actual user ID
            prospect_id: prospect.id,
            product_id: productId,
            poc_first_name: formData.pocFirstName,
            poc_last_name: formData.pocLastName,
            poc_email: formData.pocEmail,
            poc_designation: formData.pocDesignation,
            email_subject: formData.emailSubject,
            email_body: formData.emailBody,
        };

        try {
            const response = await fetch('/api/email-request/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log('Email request sent successfully');
                onClose(); // Close the form on success
            } else {
                const errorData = await response.json();
                console.error('Failed to send email:', errorData);
                alert('Failed to send email. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="form-container">
                <h2>Send Email to {prospect?.company_name}</h2>
                <button className="close-button" onClick={onClose}>×</button>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>POC First Name</label>
                        <input
                            type="text"
                            name="pocFirstName"
                            placeholder="Enter first name"
                            value={formData.pocFirstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>POC Last Name</label>
                        <input
                            type="text"
                            name="pocLastName"
                            placeholder="Enter last name"
                            value={formData.pocLastName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>POC Email</label>
                        <input
                            type="email"
                            name="pocEmail"
                            placeholder="Enter email address"
                            value={formData.pocEmail}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>POC Designation</label>
                        <input
                            type="text"
                            name="pocDesignation"
                            placeholder="Enter designation"
                            value={formData.pocDesignation}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Subject</label>
                        <input
                            type="text"
                            name="emailSubject"
                            placeholder="Enter subject"
                            value={formData.emailSubject}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Body</label>
                        <textarea
                            name="emailBody"
                            placeholder="Enter email body"
                            value={formData.emailBody}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <button type="submit">Send Email</button>
                </form>
            </div>
        </div>
    );
};

export default SendEmailForm;
