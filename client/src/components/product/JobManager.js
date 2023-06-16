import React, { useState, useEffect } from 'react';
import { Paper } from '@mui/material'
import Footer from '../Footer'
import NavBar from '../NavBar';
import Button from '@mui/material';


const JobManager = () =>
{
    const [jobs, setJobs] = useState([]);
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [salary, setSalary] = useState('');
    const [contact, setContact] = useState('');
    const [description, setDescription] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [expanded, setExpanded] = useState(false);

    const jobsArray = [
        {
            name: 'plough', type: 'permanent', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            contact: '0912334455', salary: 1000
        },
        {
            name: 'harvesting crops', type: 'contract', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            contact: '0912334455', salary: 2000
        },
        {
            name: 'food preparation', type: 'permanent', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            contact: '0912334455', salary: 900
        },
        {
            name: 'plough', type: 'contract', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            contact: '0912334455', salary: 1000
        },
    ]


    useEffect(() =>
    {
        setJobs(jobsArray.slice(0, 3))
    }, [])

    const handleNameChange = (e) =>
    {
        setName(e.target.value);
    };
    const handleTypeChange = (e) =>
    {
        setType(e.target.value);
    };

    const handleSalaryChange = (e) =>
    {
        setSalary(e.target.value);
    };
    const handleContactChange = (e) =>
    {
        setContact(e.target.value);
    };
    const handleDescriptionChange = (e) =>
    {
        setDescription(e.target.value);
    };

    const handleAddJob = () =>
    {
        // if (name.trim() === '' || price.trim() === '' || contact.trim() === '' || description.trim())
        // {
        //     return;
        // }

        const newJob = {
            name: name,
            salary: salary,
            type: type,
            contact: contact,
            description: description
        };
        if (editMode)
        {
            const updatedJobs = [...jobs];
            updatedJobs[editIndex] = newJob;
            setJobs(updatedJobs);
            setEditMode(false);
            setEditIndex(null);
        } else
        {
            setJobs([...jobs, newJob]);
        }
        setName('');
        setSalary('');
        setType('');
        setContact('');
        setDescription('');
    };

    const handleEditJob = (index) =>
    {
        const jobToEdit = jobs[index];
        setName(jobToEdit.name);
        setType(jobToEdit.type);
        setSalary(jobToEdit.salary);
        setDescription(jobToEdit.description);
        setContact(jobToEdit.contact)
        setEditMode(true);
        setEditIndex(index);
    };

    const handleDeleteJob = (index) =>
    {
        const updatedJobs = [...jobs];
        updatedJobs.splice(index, 1);
        setJobs(updatedJobs);
    };
    const handleExpand = () =>
    {
        setExpanded(!expanded)
        setJobs(expanded ? jobsArray : jobsArray.slice(0, 3))


    };


    return (
        <div>
            <div style={{
                position: 'fixed', top: '0px', left: '0px'
            }}>
                <NavBar />
            </div>
            <Paper sx={{ display:{xs:'block',sm:'flex'} , fontSize:{xs:'10px',sm:'20px'} ,marginTop: '5rem' }}>


                <div className='container' style={{ display: 'block', margin: '1rem', backgroundColor: 'whitesmoke', maxHeight: '33rem' }}>
                    <h2>ADD JOB</h2>
                    <form>
                    <div className='row' style={{ margin: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Job Name"
                            value={name}
                            onChange={handleNameChange}
                            className='form-control'
                        />
                    </div>
                    <div className='row' style={{ margin: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Job Type"
                            value={type}
                            onChange={handleTypeChange}
                            className='form-control'
                        />
                    </div>
                    <div className='row' style={{ margin: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={contact}
                            onChange={handleContactChange}
                            className='form-control'
                        />
                    </div>


                    <div className='row' style={{ margin: '1rem' }}>
                        <input
                            type="number"
                            placeholder="Job Salary"
                            value={salary}
                            onChange={handleSalaryChange}
                            className='form-control'
                        />
                    </div>

                    <div className='row' style={{ margin: '1rem' }}>
                        <textarea
                            type="text"
                            rows={5}
                            cols={23}
                            placeholder="Write the job description here...."
                            value={description}
                            onChange={handleDescriptionChange}
                            className='form-control'
                        />
                    </div>


                    <div style={{ margin: '2rem' }}>
                        <button className='btn btn-primary' onClick={handleAddJob}>
                            {editMode ? 'Update Job' : 'Add Job'}
                        </button>
                    </div>
                </form>
                </div>
                <div style={{ backgroundColor: 'whitesmoke', margin: '1rem' }}>
                    <h2>Job List</h2>
                    {jobs.length === 0 ? (
                        <p>No jobs available.</p>
                    ) : (
                        <div>
                            <ul>
                                {jobs.map((job, index) => (
                                    <Paper elevation={6} sx={{ margin: '1rem' }} key={index}>
                                        <span style={{ marginRight: '1.5rem', color: 'red' }}>Job name: {job.name}</span>
                                        <span style={{ marginRight: '0.5rem', color: 'red' }}>Job type: {job.type}</span><br />
                                        <span style={{ marginRight: '0.5rem' }}>{job.description}</span><br />
                                        <span style={{ marginRight: '1.0rem', color: 'green' }}>Phone Number: {job.contact}</span>
                                        <span style={{ backgroundColor: 'whitesmoke' }}> Salary: ${job.salary}</span><br/>

                                        <button className='btn btn-warning' style={{ margin: '1rem' }} 
                                        onClick={() => handleEditJob(index)}>Edit</button>
                                        <button className='btn btn-danger' style={{ margin: '1rem' }} 
                                        onClick={() => handleDeleteJob(index)}>
                                            Delete
                                        </button>
                                    </Paper>
                                ))}
                            </ul>
                            <button className='btn btn-primary mb-3' onClick={handleExpand}>
                                {expanded ? 'Show More...' : 'Show Less...'}
                            </button>
                        </div>
                    )}
                </div>
            </Paper>
            <Footer/>
        </div>
    );
};

export default JobManager;
