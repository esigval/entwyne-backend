import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './WebFileUpload.css'; // Import the CSS file
import cloudIcon from '../../assets/uploadIcon.png'; // Import the cloud icon

export const WebFileUpload = ({ onFilesSelect }) => {
    const [thumbnails, setThumbnails] = useState([]);

    const onDrop = useCallback(acceptedFiles => {
        onFilesSelect(acceptedFiles); // Handle the array of files in the parent component
        
        // Generate thumbnails
        const newThumbnails = acceptedFiles.map(file => ({
            name: file.name,
            preview: URL.createObjectURL(file)
        }));
        setThumbnails(newThumbnails);
    }, [onFilesSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: true
    });

    
    // Adjust the className to match the CSS style for the active drag state
    const activeClass = isDragActive ? 'dropzone-active' : '';

    return (
        <div {...getRootProps()} className={`dropzone ${activeClass}`}>
            <input {...getInputProps()} />
            {/* Include the cloud icon and drag & drop text */}
            <div className="cloud-icon" style={{ backgroundImage: `url(${cloudIcon})` }}></div>
            <span className="drag-text">Drag&Drop Files Here</span>
            <button type="button" className="file-upload-button">Browse Files</button>

            {/* Thumbnail preview section */}
            {/* <div style={{ display: 'flex', marginTop: '10px' }}>
                {thumbnails.map((file, index) => (
                    <div key={index} style={{ marginRight: '10px' }}>
                        <img src={file.preview} alt={file.name} style={{ width: '100px', height: '100px' }} />
                    </div>
                ))}
            </div> */}
        </div>
    );
};
