import React, { useState } from 'react';
import FileUploader from './FileUploader';
import PortfolioTemplate from './PortfolioTemplate';
import EditModal from './EditModal';
import DeploymentButton from './DeploymentButton';
import api from '../utils/Api';

const ResumeDashboard = () => {

    const [portfolioData, setPortfolioData] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleUploadSuccess = async (file) => {
        try {
            const response = await api.uploadResume(file);
            setPortfolioData(response.data);
            setShowEditModal(true);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handlePortfolioUpdate = async (updatedData) => {
        try {
            const response = await api.deployPortfolio(updatedData);
            setPortfolioData(updatedData);
            setShowEditModal(false);
            alert(`Your portfolio is live at: ${response.data.url}`);
        } catch (error) {
            console.error('Error deploying portfolio:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                {!portfolioData ? (
                    <FileUploader onUploadSuccess={handleUploadSuccess} />
                ) : (
                    <>
                        <PortfolioTemplate data={portfolioData} />
                        <EditModal
                            visible={showEditModal}
                            data={portfolioData}
                            onClose={() => setShowEditModal(false)}
                            onSave={handlePortfolioUpdate}
                        />
                        <DeploymentButton data={portfolioData} />
                    </>
                )}
            </div>
        </div>
    );
};

export default ResumeDashboard;