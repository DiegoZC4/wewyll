import React from 'react';
import './Footer.css';

const Footer = () => {
    const footerStyle = {
      bottom: 0,
      padding: '15px 20px 0px 20px',
      color: 'white',
      width: '100%',
      height: '100%'
    }

    return (
        <div className='blue center' style={footerStyle}>
          <h4>contact us</h4>
          <ul>
            <li>
              report bugs and other issues with the website to <a href='mailto:dev@wewyll.com' color='white'>dev@wewyll.com</a>
            </li>
            <li>
              if you are a non-profit looking to recruit volunteers or a business interested in partnering with WeWyll, 
              please reach out to us at <a href='mailto:hi@wewyll.com' color='white'>hi@wewyll.com</a>
            </li>
          </ul>
        </div>
    )
}

export default Footer