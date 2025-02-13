import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ResumeUploadPage = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type !== 'application/pdf') {
            setError('Please upload a PDF file');
            return;
        }
        setFile(selectedFile);
        setError('');
    };
    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);  // Make sure the field name matches backend

        try {
            const response = await axios.post(`${API_URL}/api/resume/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success) {
                navigate(`/portfolio/${response.data.resumeId}`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            setError('Failed to upload resume');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Create Your Portfolio</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload your resume (PDF)
                    </label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded text-sm"
                    />
                </div>

                {loading && progress > 0 && (
                    <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className={`w-full py-2 px-4 rounded font-medium transition-colors
                        ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                    {loading ? 'Processing...' : 'Create Portfolio'}
                </button>

                <p className="mt-4 text-xs text-gray-500 text-center">
                    Upload your PDF resume and we'll create a beautiful portfolio website for you.
                </p>
            </div>
        </div>
    );
};

export default ResumeUploadPage;