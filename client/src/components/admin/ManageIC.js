import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageICWorker() {
  const [icWorkers, setICWorkers] = useState([]);
  const [newICWorker, setNewICWorker] = useState({ firstName: '', lastName: '', role: 'IC Worker', password: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const query = searchTerm ? `?name=${searchTerm}` : '';
    axios.get(`/api/ic-workers${query}`)
      .then(response => {
        setICWorkers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [searchTerm]);

  const handleCreate = (event) => {
    event.preventDefault();
    axios.post('/api/ic-workers', newICWorker)
      .then(response => {
        setICWorkers([...icWorkers, response.data]);
        setNewICWorker({ firstName: '', lastName: '', role: 'IC Worker', password: '', email: '' });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`/api/ic-workers/${id}`)
      .then(response => {
        setICWorkers(icWorkers.filter(icWorker => icWorker.id !== id));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewICWorker({ ...newICWorker, [name]: value });
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredICWorkers = icWorkers.filter(icWorker => {
    const fullName = `${icWorker.firstName} ${icWorker.lastName}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const tableStyle = { borderCollapse: 'collapse', width: '100%' };
  const thStyle = { border: 'none', backgroundColor: 'green', color: 'white', padding: '1rem', textAlign: 'left', marginLeft: '1rem' };
  const tdStyle = { border: 'none', padding: '0.5rem' };

  const renderICWorkers = () => {
    if (searchTerm) {
      return (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredICWorkers.map(icWorker => (
              <tr key={icWorker.id}>
                <td style={tdStyle}>{icWorker.id}</td>
                <td style={tdStyle}>{`${icWorker.firstName} ${icWorker.lastName}`}</td>
                <td style={tdStyle}>{icWorker.email}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(icWorker.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      return (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {icWorkers.map(icWorker => (
              <tr key={icWorker.id}>
                <td style={tdStyle}>{icWorker.id}</td>
                <td style={tdStyle}>{`${icWorker.firstName} ${icWorker.lastName}`}</td>
                <td style={tdStyle}>{icWorker.email}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(icWorker.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  const formStyle = { width: '45%', marginBottom: '2rem' };
  const labelStyle = { display: 'block', marginBottom: '1rem' };
  const inputStyle = { marginLeft: '1rem', padding: '0.5rem', width: '80%' };
  const buttonStyle = { marginLeft: '1rem', padding: '0.5rem' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Create IC Worker</h1>
      <form onSubmit={handleCreate} style={formStyle}>
        <label style={labelStyle}>
          First Name:
          <input type="text" name="firstName" value={newICWorker.firstName} onChange={handleInputChange} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Last Name:
          <input type="text" name="lastName" value={newICWorker.lastName} onChange={handleInputChange} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Password:
         <input type="password" name="password" value={newICWorker.password} onChange={handleInputChange} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Email:
          <input type="email" name="email" value={newICWorker.email} onChange={handleInputChange} style={inputStyle} />
        </label>
        <button type="submit" style={buttonStyle}>Create</button>
      </form>
      <h1 style={{ textAlign: 'center' }}>IC Workers</h1>
      <label style={{ padding: '1rem' }}>
        Search by name:
        <input type="text" value={searchTerm} onChange={handleSearchTermChange} style={{ marginLeft: '1rem', padding: '0.5rem', width: '80%' }} />
      </label>
      {renderICWorkers()}
    </div>
  );
}

export default ManageICWorker;