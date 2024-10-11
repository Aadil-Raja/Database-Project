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
        <MDBNavbarBrand tag ="div" className='header-web-name'>
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
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
            <MDBNavbarItem>
              <Link to="/Home" className='nav-link header-nav-buttons'>
                Home
              </Link>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <Link to="/About" className='nav-link header-nav-buttons'>
                About
              </Link>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <Link to="/Contact" className='nav-link header-nav-buttons'>
                Contact Us
              </Link>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <MDBDropdown >
                <MDBDropdownToggle tag='a' className='nav-link header-nav-buttons' role='button'>
                  Profile
                </MDBDropdownToggle>
                <MDBDropdownMenu style={{ margin: 0 }} className='header-drop-down'>
                  <MDBDropdownItem className='drop-buttons' link>
                    View Profile
                  </MDBDropdownItem>
                  <MDBDropdownItem className='drop-buttons' link>
                    View Requests
                  </MDBDropdownItem>
                  <MDBDropdownItem className='drop-buttons' link>
                    Log out
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}