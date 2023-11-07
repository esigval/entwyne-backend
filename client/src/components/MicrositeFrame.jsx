// MicrositeFrame.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const MicrositeFrame = () => {
    const navigate = useNavigate()

    const stitchVideos = () => {
        fetch('http://localhost:3001/stitchVideos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to stitch videos');
                }
                return response.text();
            })
            .then((data) => {
                console.log('Videos stitched successfully:', data);
            })
            .catch((error) => {
                console.error('Error stitching videos:', error);
            });
    };

    const startCamera = () => {
        navigate('/camera')
    }
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '2rem',
        backgroundColor: 'black',
        color: 'white',
        textAlign: 'center'
    }

    const buttonStyle = {
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: 'green',
        border: 'none',
        borderRadius: '0.5rem',
        color: 'white',
        fontSize: '1rem',
        cursor: 'pointer',
        outline: 'none'
    }

    return (
        <div style={containerStyle}>
            <h1>Hi Julia.</h1>
            <p>
                Sarah would like to Co-Create a Memory with you, about the first time
                she met Josh!
            </p>
            <p>
                I will act as your director, helping you create an impactful memory that
                Sarah can cherish for years.
            </p>
            <p>
                We will ask for video, but you can decide whether you want it to be
                included in the movies or not.
            </p>
            <button style={buttonStyle} onClick={startCamera}>
                Are You Ready?
            </button>
            <button style={buttonStyle} onClick={stitchVideos}>
                Stitch Videos
            </button>

        </div>
    )
}

export default MicrositeFrame
