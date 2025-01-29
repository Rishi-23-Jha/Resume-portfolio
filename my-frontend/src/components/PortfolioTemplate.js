import React from 'react';

const PortfolioTemplate = ({ data }) => {
    return (
        <div className="container mx-auto p-6 bg-white shadow-lg">
            <div className="text-center">
                <h1 className="text-3xl font-bold">{data.basicInfo.name}</h1>
                <p className="text-gray-600">{data.basicInfo.email}</p>
            </div>

            <section className="mt-8">
                <h2 className="text-2xl font-semibold border-b-2 mb-4">Experience</h2>
                {data.experience.map((job, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="font-bold">{job.position} at {job.company}</h3>
                        <p className="text-gray-600">{job.duration}</p>
                        <p>{job.description}</p>
                    </div>
                ))}
            </section>

            <section className="mt-8">
                <h2 className="text-2xl font-semibold border-b-2 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, index) => (
                        <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PortfolioTemplate;