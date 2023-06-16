import React, { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import '../App.css'
import profileImage from './assets/melkamu.jpg'
import { useAuthContext } from '../hooks/useAuthContext';

const UserProfile = () => {
//getuserbyid
  const { user } = useAuthContext()
  const userId=user._id
  const {userData,setUserData} = useState("")
  
 const useEffect = (() => {
    // Function to fetch user data from MongoDB using the userId
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3005/user/getuserbyid"); // Replace with your actual API endpoint
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);


  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState(user.password);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [photo, setPhoto] = useState(user.photo);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
 
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handlePhotoChange = (event) => {
    setPhoto(URL.createObjectURL(event.target.files[0]));
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Send the user profile data to the server
    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('photo', photo);
   
    
    try {
        const response = await axios.post('http://localhost:3005/user/getuserbyid', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log(response.data);
        alert("successful")
        navigate("/agri-jobs")

        

  
        // Handle success or display a success message to the user
      } catch (error) {
        console.error(error);
        alert(error)
        // Handle error or display an error message to the user
      }


    }

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
        
        <div className="profile-info">
        <div className="profile-photo">
            <img src={profileImage} alt="user" width="20%" height="20%"/>
          
        </div>
        <div className="profile-details">
          <h2>{name}</h2>
          <p>{role}</p>
          <button className="profile-button" onClick={handleDropdownToggle}>Update Profile</button>
          <button className="logout-button"><a href="./" >Logout </a><span class="sr-only">(current)</span></button>
          
          
        </div>
      </div>
        {showDropdown && (
          <div className="profile-dropdown">
            <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={handleEmailChange}
        />
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="text"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <label htmlFor="confirm password">Confirm password:</label>
        <input
          type="text"
          id="confirm password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />

        <label htmlFor="role">Role:</label>
        <select
          type="text"
          id="role"
          value={role}
          onChange={handleRoleChange}
        >
            <option>Farmer</option>
            <option>Labor Worker</option>
            <option>Buyer</option>
        </select>
       

        <label htmlFor="photo">Photo:</label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={handlePhotoChange}
        />


        <button type="submit">Save</button>
      </form>
          </div>
        )}
      </div>
      
      
    </div>
  );

};

export default UserProfile;
