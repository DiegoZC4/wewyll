import React from 'react'
import {Navbar, Nav, NavDropdown, Form, FormControl, Button} from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";


const WeNav = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <Navbar bg="white" expand="lg" style={{boxShadow: "0px 5px 2px #F0F0F0"}}>
            <Navbar.Brand href="#home">
                <img src={require('./logo_blue.png')} alt='' height="40"/>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#link">Link</Nav.Link>
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown>
            </Nav>
            <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-success">Search</Button>
            </Form>
            <Button variant="outline-success" onClick={() => loginWithRedirect()}>Login</Button>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default WeNav
