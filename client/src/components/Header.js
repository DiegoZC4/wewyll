import React from 'react'
import {Navbar, Nav, NavDropdown, Form, FormControl, Button, Col} from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";
import '../wewyll.css';
import './Header.css';

const Header = ({U, profileTypes, setProfile, availableProfiles, profile}) => {
    const { loginWithRedirect, logout } = useAuth0();
    const { user, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();

    const logBtnDim = 20;
    const logInOutStyle = {
        height:`${logBtnDim*2}px`,
        width: `${logBtnDim*4}px`,
        color:'white',
        fontSize: `18px`,

        borderWidth: '0',
        borderRadius: `${logBtnDim}px`,
        // position: 'absolute',
        // right: `${logBtnDim*2}px`,
        float: 'right',
    }

    const logInOut = () => {
        if (isAuthenticated){
            logout({returnTo: window.location.origin});
        } else{
            loginWithRedirect();
        }
    }

    const navStyle = {
        padding: 20
    }

    const capitalize = (word) => word.charAt(0).toUpperCase()+word.slice(1);
    const checkExistence = (type) => (availableProfiles.includes(type)) ? '' : ' (uninitialized)';

    return (
        <Navbar className='blue' expand={isAuthenticated && (U.volunteer || false) ? 'lg': true} style={navStyle}>
            <Navbar.Brand href="home">
                <img src={require('./logo_white.jpeg')} alt='' height="60"/>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            {
            !isLoading &&
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                {
                    isAuthenticated && U && U.volunteer &&
                    <div>
                <Nav.Link href="volunteer">volunteer</Nav.Link>
                <Nav.Link href="rewards">rewards</Nav.Link>
                <Nav.Link href="profile">my profile</Nav.Link>
                <Nav.Link href="events">my events</Nav.Link>
                    </div>
                }
                <NavDropdown title="Profile" id="basic-nav-dropdown">
                    {profileTypes.map((type)=>
                        <NavDropdown.Item key={type} onClick={()=>setProfile(type)} className={type===profile ? 'blue-text':''}>{capitalize(type) + checkExistence(type)}</NavDropdown.Item>
                    )}
                    {/* <NavDropdown.Divider />
                    <NavDropdown.Item href="admin">Admin</NavDropdown.Item> */}
                </NavDropdown>
            {/* <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-success">Search</Button>
            </Form> */}
            </Nav>
            <Col className=' '>
                <Button onClick={logInOut} className="green"
                    style={logInOutStyle}>
                    {isAuthenticated ? 'logout':'login'}
                </Button>
            </Col>
            </Navbar.Collapse>
            }
        </Navbar>
    )
}

export default Header
