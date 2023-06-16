import React from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import Layout from './components/authentication/Layout';
import Job from './components/product/JobManager';
import Product from './components/product/ProductManager';
import Index from './components/landingPage/Index';
import Login from './components/Login';
import NewsFeed from './components/NewsFeed';
import Register from './components/Register';
import RequiredAuth from './components/RequiredAuth';
import { Routes, Route } from 'react-router-dom';
import NewsFeedManager from './components/icPage/NewsFeedManager';
import { useAuthContext } from './hooks/useAuthContext';
import Profile from './components/Profile'

function App()
{
  const { user } = useAuthContext()
  return (
    <div className="App" >
      <ToastContainer theme='colored' position='top-center'></ToastContainer>
       
      

      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
           {/* <Home /> : <Navigate to="/login" />
          <Route path='sign-in' element={<Login />} /> */}
          <Route path='/profile' element={<Profile />} />
          <Route path='/logout' element={<Layout />} />
          <Route path='sign-in' element={<Login />} />
          <Route path='sign-up' element={<Register />} />
          <Route path='/' element={<Index />} />
          <Route path='news-feed' element={<NewsFeed />} />
          <Route path='agri-jobs' element={<Job />} />
          <Route path='admin/manage-news' element={<NewsFeedManager />} />

          {/* Private Routes */}
          <Route element={<RequiredAuth />}>
            <Route path='news-feed' element={<NewsFeed />} />
            <Route path='agri-pros' element={<Product />} />
             
          </Route>
          

        </Route>
      </Routes>
    </div>
  );
}

export default App;
