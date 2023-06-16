import React from 'react';
import { Link } from 'react-router-dom';
import './nav.css';
import profileImage from './assets/melkamu.jpg';
import '../../App.css';
import 'client\src\components\landingPage\style.css';

const AdminNavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul style={{}} className="navbar-nav ms-auto mb-2 mb-lg-0">
            <h2 style={{ position: 'absolute', left: '2px' }}>AISS</h2>

            <div style={{ display: 'flex' }}>
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="./news-feed">
                  NewsFeed
                </a>
              </li>
              <li
                className="nav-item dropdown mx-2 nav-link dropdown-toggle"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Management Accounts
                <div
                  class="dropdown-menu"
                  aria-labelledby="navbarDropdown"
                >
                  <a class="dropdown-item" href="./ManageDAWorker">
                    DA-WORKER
                  </a>
                  <a class="dropdown-item" href="./ManageFarmer">
                    Farmer
                  </a>
                  <a class="dropdown-item" href="./ManageIC">
                    IC
                  </a>
                </div>
              </li>

              <li className="nav-item mx-2">
                <a href="./price-index" className="nav-link">
                  Price Index
                </a>
              </li>
              <li style={{ textAlign: 'right', marginLeft: '0' }}>
                <Link to="/profile" className="nav-link">
                  <img
                    src={profileImage}
                    width="38px"
                    height="38px"
                    style={{ padding: 0 }}
                  />
                </Link>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavBar;
