// src/components/PortfolioPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'boxicons/css/boxicons.min.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PortfolioPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { resumeId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/resume/${resumeId}`);
                setData(response.data.data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [resumeId]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500"></div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-[#1f242d]">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-[#323946] shadow-lg">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <a href="#" className="text-white text-2xl font-bold">Portfolio</a>
                        <div className="space-x-6">
                            <a href="#home" className="text-white hover:text-blue-400">Home</a>
                            <a href="#projects" className="text-white hover:text-blue-400">Projects</a>
                            <a href="#skills" className="text-white hover:text-blue-400">Skills</a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="py-20 bg-[#1f242d]">
                <div className="container mx-auto px-6">
                    <div className="text-center text-white">
                        <h3 className="text-2xl mb-4">Hello, It's Me</h3>
                        <h1 className="text-5xl font-bold mb-4">{data?.personalInfo?.name}</h1>
                        <div className="mt-4">
                            {data?.personalInfo?.linkedin && (
                                <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                                    <i className="bx bxl-linkedin text-4xl text-blue-400 hover:text-blue-300"></i>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            {data?.projects?.length > 0 && (
                <section id="projects" className="py-20 bg-[#323946]">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center text-white mb-12">
                            My <span className="text-blue-400">Projects</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {data.projects.map((project, index) => (
                                <div key={index} className="bg-[#1f242d] rounded-lg p-6 hover:shadow-lg transition">
                                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                    <p className="text-gray-300 mb-4">{project.description}</p>
                                    {project.technologies?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Skills Section */}
            {data?.skills?.length > 0 && (
                <section id="skills" className="py-20 bg-[#1f242d]">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center text-white mb-12">
                            My <span className="text-blue-400">Skills</span>
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {data.skills.map((skill, index) => (
                                <div key={index} className="bg-[#323946] p-6 rounded-lg text-center hover:transform hover:scale-105 transition">
                                    <i className={`bx ${skill.icon} text-4xl text-blue-400 mb-2`}></i>
                                    <h3 className="text-white">{skill.name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="bg-[#323946] text-white py-6">
                <div className="container mx-auto px-6 text-center">
                    <p>© {new Date().getFullYear()} Portfolio Builder</p>
                </div>
            </footer>
        </div>
    );
};

export default PortfolioPage;