import bcrypt from 'bcryptjs'
import validator from "validator"
import  Jwt  from 'jsonwebtoken';
import dotev from 'dotenv';
import usermodel from '../model/usermodel.js';
import fs from 'fs'
dotev.config()
//login secretkey..
//to register user

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // Check if a user with the same email already exists
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Validate password format
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character',
      });
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // Check if role is empty
    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }

    // Check if name is empty
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);


    let user;
    if (req.file) {
      // If file is provided, save image data to the user
      user = new usermodel({
        name,
        email,
        password: hashedPassword,
        role,
        image: {
          data: fs.readFileSync("uploads/" + req.file.filename),
          contentType: req.file.mimetype,
        },
      });
    } else {
      // If file is not provided, save user without the image field
      user = new usermodel({
        name,
        email,
        password: hashedPassword,
        role,
      });
    }

    // Save the user to the database
    await user.save();

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

    //this is how we handle it in the front end
    //in the frontend code when we post data or when we register
    //const response = await post('/.....
    //1. If the response status is within the range of 200-299 (indicating a successful response),
    // you can access the message property in the result object to get the success message (result.msg).
    //2. If the response status is outside of that range, indicating an error response,
    // you can access the error property in the result object to get the error message (result.error).
    // const result = await response.json();
    // import React, { useState } from 'react';
    // import axios from 'axios';
    
    // const RegistrationForm = () => {
    //   const [name, setName] = useState('');
    //   const [email, setEmail] = useState('');
    //   const [password, setPassword] = useState('');
    //   const [confirmPassword, setConfirmPassword] = useState('');
    //   const [role, setRole] = useState('');
    //   const [error, setError] = useState('');
    //   const [success, setSuccess] = useState(false);
    
    //   const handleSubmit = async (e) => {
    //     e.preventDefault();
    
    //     try {
    //       const response = await axios.post('/api/register', {
    //         name,
    //         email,
    //         password,
    //         confirmPassword,
    //         role,
    //       });
    
    //       if (response.status === 201) {
    //         setSuccess(true);
    //         setError('');
    //       }
    //     } catch (error) {
    //       setSuccess(false);
    //       if (error.response) {
    //         setError(error.response.data.message);
    //       } else {
    //         setError('An error occurred during registration.');
    //       }
    //     }
    //   };
    
    //   return (
    //     <form onSubmit={handleSubmit}>
    //       {success && <p>User registered successfully.</p>}
    //       {error && <p>{error}</p>}
    
    //       <label>
    //         Name:
    //         <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
    //       </label>
    
    //       <label>
    //         Email:
    //         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
    //       </label>
    
    //       <label>
    //         Password:
    //         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    //       </label>
    
    //       <label>
    //         Confirm Password:
    //         <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
    //       </label>
    
    //       <label>
    //         Role:
    //         <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
    //       </label>
    
    //       <button type="submit">Register</button>
    //     </form>
    //   );
    // };
    
    // export default RegistrationForm;
    
    
  export const getAllUsers = async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const users = await usermodel.find({})
        .select("-password")
        .skip(skip)
        .limit(limit);
  //exclude users pw
      const count = await usermodel.countDocuments({});
  
      res.status(200).json({
        success: true,
        users,
        count,
        message: "List of users",
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "An error occurred while fetching the users." });
    }

        //in front end
    // fetch('/api/jobs') // Replace with the actual API endpoint URL
    //   .then(response => response.json())
    //   .then(data => {
    //     // Access the jobs array from the JSON response
    //     const receivedJobs = data.jobs;

    //     // Update the state with the received jobs
    //     setJobs(receivedJobs);
  
  };
  // to view user his/her own profile
  export const getUserById = async (req, res) => {
 
    const userId = req.user._id; // Retrieve the user ID from req.user assumming you are using authenticate middleware

  
    try {
      const user = await usermodel.findById(userId).select("-password");
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, user, message: "User found" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "An error occurred while fetching the user" });
    }

        //in front end
    // fetch('/api/jobs') // Replace with the actual API endpoint URL
    //   .then(response => response.json())
    //   .then(data => {
    //     // Access the jobs array from the JSON response
    //     const receivedJobs = data.jobs;

    //     // Update the state with the received jobs
    //     setJobs(receivedJobs);
  
  };
  
  export const removeAccount = async (req, res) => {
    try {
      const { id: userId } = req.params;
  
      // Check if the authenticated user is authorized to delete the account pass authenticate middleware
      if (req.user.role !== "admin" && req.user._id !== userId) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this account.",
        });
      }
  
      const user = await usermodel.findOneAndRemove({ _id: userId });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `No user with id: ${userId} found.`,
        });
      }
  
      res.status(200).json({ success: true, message: "Account deleted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "An error occurred while deleting the account." });
    }
  };
  

  export const updateAccount = async (req, res) => {
    // to update the account id pass by params
   
    try {
      const { id: userId } = req.params;
      const { name, email, password,confirmPassword,role} = req.body;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  
      if (!name || !email || !role) {
        return res.status(400).json({ success: false, message: "Please provide name, email, and role." });
      }

      // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Validate password format
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character',
      });
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    

      const updatedData = {
        name,
        email,
        password: hashedPassword,
        role,
      };
  
      if (req.file) {
        // If an image is uploaded, add the image data to the update data
        updatedData.image = {
          data: await fs.promises.readFile('uploads/' + req.file.filename),
          contentType: req.file.mimetype,
        };
      }
      console.log(name, email, role);
      const user = await usermodel.findByIdAndUpdate(
          userId,
          updatedData,
        { runValidators: true, new: true }
      );
  
      if (!user) {
        return res.status(400).json({ success: false, message: "Unable to update the account." });
      }
  
      res.status(200).json({ success: true,user, message: "Account updated successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "An error occurred while updating the account." });
    }
  };
  

 
 
  export const login = async (req, res) => {
    const { email, password, rememberMe } = req.body;
  
    // Validate the request parameters
    if (!password || !email) {
      return res.status(400).json({ success: false, message: "Please provide the email and password." });
    }
  
    try {
      // Find the user based on the provided email
      const user = await usermodel.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "Invalid credentials." });
      }
  
      // Compare the provided password with the stored password hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Incorrect password." });
      }
  
      // Construct the saved data object
      const savedData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      
        // Include other properties you want to return...
      };
  
      // Generate a JWT token with the user ID as the payload
      let token = null;
      if (rememberMe) {
        token = Jwt.sign({ userId: user._id }, process.env.secret_key, { expiresIn: '1h' });
        // Save the token to the user's tokens array
        user.tokens.push({ token });
      }
  
      // Save the updated user document
      await user.save();
  
      // Return the token and saved data in the response
      res.status(201).json({ success: true, token, data: savedData, message: "Logged in successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "An error occurred while logging in." });
    }
  };
  
  //login frontend
//   import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
// import axios from 'axios';

// const LoginForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   const history = useHistory();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('/api/login', {
//         email,
//         password,
//         rememberMe,
//       });

//       if (response.status === 201) {
//         const { token } = response.data;
//         // Save the token in localStorage or cookies for future requests
//         localStorage.setItem('token', token);
//         setSuccess(true);
//         setError('');

//         // Redirect to the "melkamu" component
//         history.push('/melkamu');
//       }
//     } catch (error) {
//       setSuccess(false);
//       if (error.response) {
//         setError(error.response.data.message);
//       } else {
//         setError('An error occurred while logging in.');
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {success && <p>Logged in successfully.</p>}
//       {error && <p>{error}</p>}

//       <label>
//         Email:
//         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//       </label>

//       <label>
//         Password:
//         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//       </label>

//       <label>
//         Remember me:
//         <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
//       </label>

//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default LoginForm;


  export const changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
  
    // Validate the request parameters
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ success: false, message: "Please provide the old password, new password, and confirm new password." });
    }
  
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, message: "The new password and confirm new password do not match." });
    }
  
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ success: false, message: "The new password should contain at least one uppercase letter, one lowercase letter, one digit, and one special symbol. It should be at least 8 characters long." });
    }
  
    try {
      // Retrieve the user's data from the database
      const user = await usermodel.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: `No user with id: ${req.user._id} found.` });
      }
  
      // Verify that the old password matches the password stored in the database
      const isMatch = await bcrypt.compare(oldPassword, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "The old password is incorrect." });
      }
  
      // Hash and update the user's password with the new password in the database
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ success: true, message: "Password successfully updated." });
    } catch (error) {
      // Handle any database or server errors
      console.error(error);
      res.status(500).json({ success: false, message: "An error occurred while changing the password." });
    }
  };
  
  export const updateUserRole = async (req, res) => {
    const { newRole } = req.body;
    const userId = req.user._id;
  
    // Validate the request parameters
    if (!newRole) {
      return res.status(400).json({ success: false, message: "Please provide the new role." });
    }
  
    try {
      // Retrieve the user's data from the database
      const user = await usermodel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: `No user with id: ${userId} found.` });
      }
  
      // Update the user's role
      user.role = newRole;
      await user.save();
  
      res.status(200).json({ success: true, message: "User role successfully updated." });
    } catch (error) {
      // Handle any database or server errors
      console.error(error);
      res.status(500).json({ success: false, message: "An error occurred while updating the user role." });
    }
  };
  

// Logout route
 export const logout = async (req, res) => {
  try {
    // Remove the current token from the user's tokens array
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);

    // Save the updated user document
    await req.user.save();

    res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
  //font end ode for logout
  //function Logout() {
  //   const handleLogout = async () => {
  //     try {
  //       // Send a request to the backend to logout
  //       const response = await fetch('/api/logout', {
  //         method: 'POST',
  //         credentials: 'include',
  //       });
  
  //       if (response.ok) {
           //remove token
  //         // Successful logout
  //         // Redirect the user to the login page or perform any other necessary actions
  //         window.location.href = '/login';
  //       } else {
  //         // Failed logout
  //         // Handle the error or display an error message
  //         console.error('Logout failed');
  //       }
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   };
  
  //   return (
  //     <button onClick={handleLogout}>
  //       Logout
  //     </button>
  //   );
  // }
  // export default Logout;}
 };



// password reset
// Endpoint to handle sending the reset email
//app.post('/api/send-reset-email',
 export const sendresetemail = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate a reset token and expiration
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour

    // Update the user with the reset token and expiration
    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    // Send the reset email
    const transporter = nodemailer.createTransport({
      // Configure your email provider details
      service: 'gmail',
      auth: {
        user: 'zmelkamu918@gmail.com',
        pass: '123mel123!',
      },
    });
    

    const mailOptions = {
      from: 'zmelkamu918@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Click on the following link to reset your password: http://your-website.com/reset-password?token=${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending reset email:', error);
        return res.status(500).json({ message: 'Failed to send reset email.' });
      }
      console.log('Reset email sent:', info.response);
      return res.status(200).json({ message: 'Reset email sent successfully.' });
    });
  } catch (error) {
    console.error('Error sending reset email:', error);
    return res.status(500).json({ message: 'Failed to send reset email.' });
  }
};

// app.post('/api/reset-password'

export const resetpassword =async (req, res) => {
  const {newPassword } = req.body;

  try {
    // Find the user by email and valid reset token
    const user = await usermodel.findOne({
      resetToken: req.body.resetToken,
      resetTokenExpiration: { $gt: Date.now() },// Check if the token has not expired
    });

    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired reset token.' });
    }

    // Update the user's password
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ message: 'Failed to reset password.' });
  }
};


  


//  font end code


// const ResetPassword = () => {
//   const [email, setEmail] = useState('');
//   const [emailSent, setEmailSent] = useState(false);
//   const [resetStatus, setResetStatus] = useState('');

//   const handleSendEmail = async (e) => {
//     e.preventDefault();

//     try {
//       // Make an API call to send the reset email
//       const response = await fetch('/api/send-reset-email', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       if (response.ok) {
//         setEmailSent(true);
//         setResetStatus('Email sent. Please check your inbox for further instructions.');
//       } else {
//         const errorData = await response.json();
//         setResetStatus(errorData.message);
//       }
//     } catch (error) {
//       console.error('Error sending reset email:', error);
//       setResetStatus('An error occurred. Please try again later.');
//     }
//   };

//   return (
//     <div>
//       <h1>Reset Password</h1>
//       {!emailSent ? (
//         <form onSubmit={handleSendEmail}>
//           <div>
//             <label htmlFor="email">Email:</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit">Send Reset Email</button>
//         </form>
//       ) : (
//         <p>{resetStatus}</p>
//       )}
//     </div>
//   );
// };




// const ResetPasswordPage = () => {
//   const { token} = useParams();
//   const [newPassword, setNewPassword] = useState('');
//   const [resetStatus, setResetStatus] = useState(null);
//   const history = useHistory();

//   useEffect(() => {
//     // You can perform any necessary actions here with the token and email values,
//     // such as pre-filling form fields or validating the token.

//     console.log('Token:', token);
//     console.log('Email:', email);
//   }, [token]);

//   const handlePasswordChange = (e) => {
//     setNewPassword(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/api/reset-password', {
//
//         newPassword,
//         resetToken: token,
//       });
//       setResetStatus(response.data.message);
//     } catch (error) {
//       console.error('Error resetting password:', error);
//       setResetStatus('Failed to reset password.');
//     }
//   };

//   const handleGoBack = () => {
//     history.push('/login'); // Redirect to the login page after password reset
//   };

//   return (
//     <div>
//       <h1>Reset Password</h1>
//       {resetStatus ? (
//         <div>
//           <p>{resetStatus}</p>
//           <button onClick={handleGoBack}>Go Back to Login</button>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           <label>New Password:</label>
//           <input type="password" value={newPassword} onChange={handlePasswordChange} />
//           <button type="submit">Reset Password</button>
//         </form>
//       )}
//     </div>
//   );
// };


//route

// const App = () => {
//   return (
//     <Router>
//       <Switch>
//         {/* Other routes */}
//         <Route path="/reset-password/:token" component={ResetPasswordPage} />
//       </Switch>
//     </Router>
//   );
// };


// // api
// // Define User schema
// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true },
//   password: { type: String, required: true },
//   resetToken: String,
//   resetTokenExpiration: Date,
// });



// // Endpoint to handle resetting the password


