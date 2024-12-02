import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles
import API from '../utils/api';
import './MediaUpload.css'; // Import external CSS

const MediaUpload = () => {
    const [media, setMedia] = useState(null);
    const [mediaList, setMediaList] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    

    useEffect(() => {
        if (isLoggedIn) {
            fetchMedia();
        }
    }, [isLoggedIn]);

    const fetchMedia = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/media/list', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMediaList(res.data.mediaFiles || []);
            toast.success('Media list fetched successfully!', { toastId: 'fetchMediaSuccess' }); // Use a unique `toastId`
        } catch (error) {
            console.error('Failed to fetch media:', error);
            toast.error('Failed to fetch media. Please try again later.', { toastId: 'fetchMediaError' });
        }
    };

    const handleUpload = async () => {
        if (!media) {
            toast.warn('Please select a file to upload.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('You need to be logged in to upload media.', { toastId: 'notLoggedIn' });
            return;
        }

        const formData = new FormData();
        formData.append('media', media);

        try {
            await API.post('/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Media uploaded successfully!', { toastId: 'uploadSuccess' });
            fetchMedia(); // Refresh media list
            setMedia(null); // Clear the selected file input
        } catch (error) {
            console.error('Media upload failed:', error);
            toast.error('Failed to upload media. Please try again.', { toastId: 'uploadError' });
        }
    };

    return (
        <div className="media-upload-container">
            <h2 className="title">Upload Media</h2>

            {!isLoggedIn ? (
                <div className="login-prompt">
                    <p>Please log in to upload and view media.</p>
                </div>
            ) : (
                <>
                    <div className="upload-form">
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => setMedia(e.target.files[0])}
                            className="file-input"
                        />
                        <button className="upload-button" onClick={handleUpload}>
                            Upload
                        </button>
                    </div>
                </>
            )}

            <h3 className="media-list-title">Your Uploaded Media</h3>
            <div className="media-list">
                {mediaList.length > 0 ? (
                    mediaList.map((file, index) => {
                        // Check if the file is valid
                        if (!file || typeof file !== 'string') {
                            return <p key={index}>Invalid or unsupported media</p>;
                        }

                        // Render based on the file type
                        return (
                            <div key={index} className="media-item">
                                {file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg') ? (
                                    <img src={file} alt={`media-${index}`} className="media-image" />
                                ) : file.endsWith('.mp4') ? (
                                    <video controls className="media-video">
                                        <source src={file} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <p>Unsupported media type</p>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p>No media uploaded yet.</p>
                )}
            </div>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default MediaUpload;

