import React, { useState } from 'react';
import './WebFileUpload.css'; // Import the CSS file

export const WebFileUpload = ({ onFilesSelect }) => {
    const [thumbnails, setThumbnails] = useState([]);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const files = Array.from(event.target.files);
            onFilesSelect(files); // Handle the array of files in the parent component

            // Generate thumbnails
            const newThumbnails = files.map(file => ({
                name: file.name,
                preview: URL.createObjectURL(file)
            }));
            setThumbnails(newThumbnails);
        }
        
    };

    return (
        <div>
            <input type="file" id="file" onChange={handleFileChange} accept="image/*" multiple style={{ display: 'none' }} />
            <label htmlFor="file" className="file-upload-button">Choose Pictures</label>

            {/*<div style={{ display: 'flex', marginTop: '10px' }}>
                {thumbnails.map((file, index) => (
                    <div key={index} style={{ marginRight: '10px' }}>
                        <img src={file.preview} alt={file.name} style={{ width: '100px', height: '100px' }} />
                    </div>
                ))}
            </div>*/}
        </div>
    );
};