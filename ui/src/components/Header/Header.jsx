import React, { useState } from 'react';
import './Header.css';
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

  return (
    <MDBNavbar expand='lg' className='header-main-navbar'>
      <MDBContainer fluid>
        <MDBNavbarBrand tag="div" className='header-web-name'>
          <Link to="/" className='header-navbar-brand'>Masla Fix</Link>
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
              <Link to="/Home" className='nav-link'>
                Home
              </Link>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <Link to="/About" className='nav-link header-nav-buttons'>
                About
              </Link>
            </MDBNavbarItem>
            
            <MDBNavbarItem>
              <Link to="/Register" className='nav-link header-nav-buttons'>
                Register
              </Link>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <Link to="/Login" className='nav-link header-nav-buttons'>
                Login
              </Link>
            </MDBNavbarItem>
            
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar >
  );
}