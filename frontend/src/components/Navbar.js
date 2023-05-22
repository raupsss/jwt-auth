import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const Logout = async (e) => {
    try {
      await axios.delete('http://localhost:5000/logout', {
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <nav className="navbar is-light" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <a className="navbar-item" href="https://bulma.io">
            <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" alt='imgBulma' />
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <a href='/' className="navbar-item">
              Home
            </a>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <button onClick={Logout} href='/' className="button is-danger">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar