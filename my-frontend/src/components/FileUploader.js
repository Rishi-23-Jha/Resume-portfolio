import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../utils/Api'

const FileUploader = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploadError, setUploadError] = useState(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc', '.docx'],
        },
        onDrop: (acceptedFiles) => {
            setFile(acceptedFiles[0]);
            handleUpload(acceptedFiles[0]);
        },
    });

    const handleUpload = async (file) => {
        // console.log(api)
        // try {
        //     const formData = new FormData();
        //     formData.append('resume', file);
        //     const response = await api.uploadResume(formData);
        //     onUploadSuccess(response.data);
        // } catch (error) {
        //     setUploadError(error.message);
        // }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div
                {...getRootProps()}
                className="w-full max-w-md p-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <input {...getInputProps()} />
                {file ? (
                    <p>Uploading {file.name}...</p>
                ) : (
                    <p className="text-gray-500">
                        Drag and drop your resume here, or click to select a file
                    </p>
                )}
            </div>
            {uploadError && (
                <div className="mt-4 text-red-500">{uploadError}</div>
            )}
        </div>
    );
};

export default FileUploader;