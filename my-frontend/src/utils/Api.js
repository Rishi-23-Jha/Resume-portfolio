import axios from 'axios';

const api = {
    uploadResume: async (formData) => {
        const response = await axios.post('/api/upload', formData);
        return response.data;
    },

    deployPortfolio: async (portfolioData) => {
        const response = await axios.post('/api/deploy', portfolioData);
        return response.data;
    },
};

export default api;