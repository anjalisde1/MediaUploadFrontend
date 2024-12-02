// import React, { useState, useEffect } from 'react';
// import API from '../utils/api';

// const MediaUpload = () => {
//     const [media, setMedia] = useState(null);
//     const [mediaList, setMediaList] = useState([]);
//     const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
//     const [error, setError] = useState(null); // Track error

//     useEffect(() => {
//         if (isLoggedIn) {
//             fetchMedia();
//         }
//     }, [isLoggedIn]);

//     const fetchMedia = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const res = await API.get('/media/list', {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setMediaList(res.data.mediaFiles);
//         } catch (error) {
//             setError('Failed to fetch media. Please try again.');
//             console.error('Failed to fetch media:', error);
//         }
//     };

//     const handleUpload = async () => {
//         if (!media) {
//             alert('Please select a file.');
//             return;
//         }

//         const token = localStorage.getItem('token');
//         if (!token) {
//             alert('You need to be logged in to upload media.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('media', media);

//         try {
//             const response = await API.post('/media/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             alert('Media uploaded successfully!');
//             fetchMedia(); // Refresh media list
//             setMedia(null); // Clear the selected file input
//         } catch (error) {
//             setError('Media upload failed. Please try again.');
//             console.error('Media upload failed:', error);
//         }
//     };

//     return (
//         <div>
//             <h2>Upload Media</h2>

//             {error && <div style={{ color: 'red' }}>{error}</div>}

//             {!isLoggedIn ? (
//                 <button onClick={() => alert('Please log in first!')}>Login</button>
//             ) : (
//                 <>
//                     <input
//                         type="file"
//                         accept="image/*,video/*"
//                         onChange={(e) => setMedia(e.target.files[0])}
//                     />
//                     <button onClick={handleUpload}>Upload</button>
//                 </>
//             )}

//             <h3>Your Uploaded Media</h3>
//             <div>
//                 {mediaList.length > 0 ? (
//                     mediaList.map((file, index) => {
//                         // Check if the file is valid
//                         if (!file || typeof file !== 'string') {
//                             return <p key={index}>Invalid or unsupported media</p>;
//                         }

//                         // Render based on the file type
//                         return (
//                             <div key={index} style={{ marginBottom: '10px' }}>
//                                 {/* Check for valid image or video URL */}
//                                 {file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg') ? (
//                                     <img
//                                         src={file}
//                                         alt={`media-${index}`}
//                                         style={{ maxWidth: '300px', display: 'block' }}
//                                     />
//                                 ) : file.endsWith('.mp4') ? (
//                                     <video controls style={{ maxWidth: '300px' }}>
//                                         <source src={file} type="video/mp4" />
//                                         Your browser does not support the video tag.
//                                     </video>
//                                 ) : (
//                                     <p>Unsupported media type</p>
//                                 )}
//                             </div>
//                         );
//                     })
//                 ) : (
//                     <p>No media uploaded yet.</p>
//                 )}
//             </div>


//         </div>
//     );
// };

// export default MediaUpload;
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
            toast.success('Media list fetched successfully!');
        } catch (error) {
            console.error('Failed to fetch media:', error);
            toast.error('Failed to fetch media. Please try again later.');
        }
    };

    const handleUpload = async () => {
        if (!media) {
            toast.warn('Please select a file to upload.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('You need to be logged in to upload media.');
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
            toast.success('Media uploaded successfully!');
            fetchMedia(); // Refresh media list
            setMedia(null); // Clear the selected file input
        } catch (error) {
            console.error('Media upload failed:', error);
            toast.error('Failed to upload media. Please try again.');
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

