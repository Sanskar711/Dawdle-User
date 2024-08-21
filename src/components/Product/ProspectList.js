import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProspectList.css'; // Assuming you create a CSS file for styling
import goBack from '../../images/Group 20.png';
import api from '../../context/api';
import { useAuth } from '../../context/Authcontext';

const ProspectList = () => {
    const [prospects, setProspects] = useState([]);
    const navigate = useNavigate();
    const { productId } = useParams();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        // Fetch data from backend API
        api.get(`/users/product/${productId}/prospects/`)
            .then(response => {
                // Filter prospects to include only those that are open for a meeting
                const openProspects = response.data.filter(prospect => prospect.status === 'open');
                setProspects(openProspects);
            })
            .catch(error => {
                console.error('There was an error fetching the prospects!', error);
            });
    }, [productId]);

    return (
        <div className="prospect-list-container">
            <button className="go-back" onClick={() => navigate(-1)}>
                <img src={goBack} alt="Go Back" className="go-back-icon" />
            </button>
            <h1>Prospect List</h1>
            <table className="prospect-list-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Domain</th>
                        <th>Designation</th>
                        <th>Location</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {prospects.map((prospect, index) => (
                        <tr key={index}>
                            <td>{prospect.company_name}</td>
                            <td>{prospect.domain}</td>
                            <td>{prospect.designation}</td>
                            <td>{prospect.location}</td>
                            <td className='action'>
                                <a href={`mailto:${prospect.email}`} className="button-link">Send Email</a>
                                <a href={`/product/${productId}/options/book-meeting?prospectId=${prospect.id}`} className="button-link">Book Meeting</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProspectList;
