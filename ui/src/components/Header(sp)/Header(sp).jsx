import React, { useState } from 'react';
import './Header(sp).css';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

export default function Header() {
  const [openBasic, setOpenBasic] = useState(false);
  const handleLogout = () => {
    
    localStorage.removeItem('token');
    localStorage.removeItem('user_ID');
    localStorage.removeItem('usertype');
   
    navigate('/Login');
  };

  return (
    <MDBNavbar expand='lg' className='header-main-navbar'>
      <MDBContainer fluid>
        <MDBNavbarBrand tag="div" className='header-web-name'>
          <Link to="/" className='header-navbar-brand'>Service Provider</Link>
        </MDBNavbarBrand>

        <MDBNavbarToggler
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setOpenBasic(!openBasic)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar open={openBasic}>
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0 header-nav-buttons'>
            
            <MDBNavbarItem>
              <Link to="/Requests" className='nav-link header-nav-buttons'>
                Requests
              </Link>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <Link to="/ServiceProviderForm" className='nav-link header-nav-buttons'>
                Form
              </Link>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <Link to="/SpHistory" className='nav-link header-nav-buttons'>
                History
              </Link>
            </MDBNavbarItem>

            
            <MDBNavbarItem>
              <Link to="/SpProfile" className='nav-link header-nav-buttons'>
                Profile
              </Link>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <Link to="/Login" className='nav-link header-nav-buttons'  onClick={handleLogout} >
                Logout
              </Link>
            </MDBNavbarItem>
            
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar >
  );
}