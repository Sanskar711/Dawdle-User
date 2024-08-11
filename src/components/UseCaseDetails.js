import React, { useEffect, useState } from 'react';
import './UseCaseDetails.css';
import goBack from '../images/Group 20.png';
import { useNavigate } from 'react-router-dom';
import frame1 from '../images/frame.png'
import frame2 from '../images/frame-2.png'
import frame3 from '../images/frame-3.png'
import teacher from '../images/Teacher.png'
import links from '../images/icon.png'
const UseCaseDetails = () => {
    const [useCaseDetails, setUseCaseDetails] = useState({});
    const navigate = useNavigate();
    // useEffect(() => {
    //     axios.get('/api/use-case-details')
    //         .then(response => {
    //             setUseCaseDetails(response.data);
    //         })
    //         .catch(error => {
    //             console.error("There was an error fetching the use case details!", error);
    //         });
    // }, []);

    // if (!useCaseDetails) {
    //     return <div>Loading...</div>;
    // }

    return (
        <>
        <button className="go-back" onClick={() => navigate(-1) }>
        <img src={goBack} alt="Go Back" className="go-back-icon" />
      </button>
        <div className="use-case-details">
            <div className="use-case-section">
                <img src={frame1} alt="Problem Icon" />
                <div>
                    <h2>About Problem/Use Case:</h2>
                    {/* <p>{useCaseDetails.problem}</p> */}
                </div>
            </div>
            <div className="use-case-section">
                <img src={frame2} alt="Solution Icon" />
                <div>
                    <h2>How Product is solving the problem?</h2>
                    {/* <p>{useCaseDetails.solution}</p> */}
                </div>
            </div>
            <div className="use-case-section">
                <img src={frame3} alt="Target Audience Icon" />
                <div>
                    <h2>Who might be facing this problem?</h2>
                    {/* <p>{useCaseDetails.audience}</p> */}
                </div>
            </div>
            <div className="use-case-section">
                <img src={teacher} alt="Pitch Icon" />
                <div>
                    <h2>Sample Pitch</h2>
                    {/* <p>{useCaseDetails.pitch}</p> */}
                </div>
            </div>
            <div className="use-case-section reference-links">
                <img src={links} alt="Pitch Icon" />
                <h2>Reference Links</h2>
                <ul>
                    {/* {useCaseDetails.links.map((link, index) => (
                        <li key={index}>
                            <a href={link.url}>{link.label}</a>
                        </li>
                    ))} */}
                </ul>
            </div>
        </div>
        </>
    );
};

export default UseCaseDetails;
