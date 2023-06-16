import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageDAWorker() {
  const [daWorkers, setDAWorkers] = useState([]);
  const [newDAWorker, setNewDAWorker] = useState({ firstName: '', lastName: '', role: 'DA Worker', password: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const query = searchTerm ? `?name=${searchTerm}` : '';
    axios.get(`/api/da-workers${query}`)
      .then(response => {
        setDAWorkers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [searchTerm]);

  const handleCreate = (event) => {
    event.preventDefault();
    axios.post('/api/da-workers', newDAWorker)
      .then(response => {
        setDAWorkers([...daWorkers, response.data]);
        setNewDAWorker({ firstName: '', lastName: '', role: 'DA Worker', password: '', email: '' });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`/api/da-workers/${id}`)
      .then(response => {
        setDAWorkers(daWorkers.filter(daWorker => daWorker.id !== id));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewDAWorker({ ...newDAWorker, [name]: value });
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDAWorkers = daWorkers.filter(daWorker => {
    const fullName = `${daWorker.firstName} ${daWorker.lastName}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const renderDAWorkers = () => {
    if (searchTerm) {
      return (
        <table style={{borderCollapse: 'collapse', width: '100%', marginTop: '20px', marginLeft: '20px', marginRight: '20px'}}>
          <thead>
            <tr>
              <th style={{border: 'none', padding: '10px', backgroundColor: 'green', color: '#fff', textAlign: 'left', marginBottom: '10px' }}>ID</th>
              <th style={{border: 'none', padding: '10px', backgroundColor: 'green', color: '#fff', textAlign: 'left', marginBottom: '10px' }}>Name</th>
              <th style={{border: 'none', padding: '10px', backgroundColor: 'green', color: '#fff', textAlign: 'left', marginBottom: '10px' }}>Email</th>
              <th style={{border: 'none', padding: '10px', backgroundColor: 'green', color: '#fff', textAlign: 'left', marginBottom: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDAWorkers.map(daWorker => (
              <tr key={daWorker.id}>
                <td style={{border: '1px solid black', padding: '10px'}}>{daWorker.id}</td>
                <td style={{border: '1px solid black', padding: '10px'}}>{`${daWorker.firstName} ${daWorker.lastName}`}</td>
                <td style={{border: '1px solid black', padding: '10px'}}>{daWorker.email}</td>
                <td style={{border: '1px solid black', padding: '10px'}}>
                  <button style={{backgroundColor: 'red', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px'}} onClick={() => handleDelete(daWorker.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      return (
        <table style={{borderCollapse: 'collapse', width: '100%', marginTop: '20px', marginLeft: '20px', marginRight: '20px'}}>
          <thead>
            <tr>
              <th style={{border: 'none', padding: '10px', backgroundColor: 'green', color: '#fff', textAlign: 'left', marginBottom: '10px' }}>ID</th>
              <th style={{border: 'none', padding: '10px', backgroundColor: 'green', color: '#fff', textAlign: 'left', marginBottom: '10px' }}>Name</th>
              <th style={{border: 'none', padding: '10px', backgroundColor: 'green', color: '#fff', textAlign:'left', marginBottom: '10px' }}>Email</th>
              <th style={{border: 'none', padding: '10px', backgroundColor: 'green', color: '#fff', textAlign: 'left', marginBottom: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {daWorkers.map(daWorker => (
              <tr key={daWorker.id}>
                <td style={{border: '1px solid black', padding: '10px'}}>{daWorker.id}</td>
                <td style={{border: '1px solid black', padding: '10px'}}>{`${daWorker.firstName} ${daWorker.lastName}`}</td>
                <td style={{border: '1px solid black', padding: '10px'}}>{daWorker.email}</td>
                <td style={{border: '1px solid black', padding: '10px'}}>
                  <button style={{backgroundColor: 'red', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px'}} onClick={() => handleDelete(daWorker.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div>
      <h1 style={{textAlign: 'center'}}>Manage DA Workers</h1>
      <form style={{marginLeft: '20px'}} onSubmit={handleCreate}>
        <h2>Add New DA Worker</h2>
        <label>
          First Name:
          <input type="text" name="firstName" value={newDAWorker.firstName} onChange={handleInputChange} required />
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" name="lastName" value={newDAWorker.lastName} onChange={handleInputChange} required />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={newDAWorker.email} onChange={handleInputChange} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={newDAWorker.password} onChange={handleInputChange} required />
        </label>
        <br />
        <button style={{backgroundColor: 'green', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '5px', marginBottom: '20px'}}>Create</button>
      </form>
      <div style={{marginLeft: '20px'}}>
        <h2>Search DA Workers</h2>
        <label>
          Name:
          <input type="text" value={searchTerm} onChange={handleSearchTermChange} />
        </label>
      </div>
      {renderDAWorkers()}
    </div>
  );
}

export default ManageDAWorker;