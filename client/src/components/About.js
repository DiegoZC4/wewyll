import React from 'react';
// import {useState, useEffect } from 'react'
// import axios from 'axios';
import {Button, Container} from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";
import '../wewyll.css';

const About = () => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const { loginWithRedirect, logout } = useAuth0();

    const signupStyle = {
      height: 80,
      width: 300,
      fontSize: 24,
      borderWidth: 0,
      paddding: 20,
      borderRadius: 40,
    }

    return (
      <Container>
        <h1>
          <br/>
          <br/>
          <center className='green-text'>get rewarded for doing good.</center>
        </h1>
        <div className='pad'>
          <h2 className='blue-text'>
            how it works
          </h2>
            <ol className='blue-text'>
              <li>
                <h3>1) volunteer to earn points</h3>
              </li>
              <li>
                <h3>2) use points to get discounts at local businesses</h3>
              </li>
            </ol>
        </div>
        <center>
          <Button className='center green' style={signupStyle} onClick={loginWithRedirect}>become a volunteer</Button>
        </center>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </Container>
    );
}
export default About