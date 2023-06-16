import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/api/users?role=farmer')
      .then(response => {
        setFarmers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`/api/users/${id}`)
      .then(response => {
        setFarmers(farmers.filter(farmer => farmer.id !== id));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredFarmers = farmers.filter(farmer => {
    const fullName = `${farmer.firstName} ${farmer.lastName}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Farmers</h1>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Search by name:</label>
        <input type="text" value={searchTerm} onChange={handleSearchTermChange} style={{ borderRadius: '5px', padding: '5px' }} />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px 5px', textAlign: 'left', backgroundColor: 'green', color: '#fff' }}>ID</th>
            <th style={{ padding: '10px 5px', textAlign: 'left', backgroundColor: 'green', color: '#fff' }}>Name</th>
            <th style={{ padding: '10px 5px', textAlign: 'left', backgroundColor: 'green', color: '#fff' }}>Email</th>
            <th style={{ padding: '10px 5px', textAlign: 'left', backgroundColor: 'green', color: '#fff' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFarmers.map(farmer => (
            <tr key={farmer.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '10px 5px', textAlign: 'left' }}>{farmer.id}</td>
              <td style={{ padding: '10px 5px', textAlign: 'left' }}>{`${farmer.firstName} ${farmer.lastName}`}</td>
              <td style={{ padding: '10px 5px', textAlign: 'left' }}>{farmer.email}</td>
              <td style={{ padding: '10px 5px', textAlign: 'left' }}>
                <button onClick={() => handleDelete(farmer.id)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageFarmers;