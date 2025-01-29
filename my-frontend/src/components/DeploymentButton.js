import React, { useState } from 'react';
import api from '../utils/Api';

const DeploymentButton = ({ data }) => {
    const [deploymentStatus, setDeploymentStatus] = useState('idle');

    const handleDeploy = async () => {
        try {
            setDeploymentStatus('pending');
            const response = await api.deployPortfolio(data);
            setDeploymentStatus('success');
            alert(`Your portfolio is live at: ${response.data.url}`);
        } catch (error) {
            setDeploymentStatus('error');
            console.error('Deployment failed:', error);
        }
    };

    return (
        <div className="mt-4">
            {deploymentStatus === 'idle' && (
                <button
                    onClick={handleDeploy}
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                >
                    Deploy Portfolio
                </button>
            )}
            {deploymentStatus === 'pending' && (
                <div className="text-yellow-500">Deploying...</div>
            )}
            {deploymentStatus === 'success' && (
                <div className="text-green-500">Deployment successful!</div>
            )}
            {deploymentStatus === 'error' && (
                <div className="text-red-500">Deployment failed. Please try again.</div>
            )}
        </div>
    );
};

export default DeploymentButton;