import React, {useState, useEffect} from 'react'
import { Col, Row, Container } from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import NonprofitList from './NonprofitList';
import CreateNonprofit from './CreateNonprofit'

const NewNonprofit = ({ U }) => {
    return (
        <Container>
          <Col>
            <h4 className='blue-text center'>create new nonprofit profile</h4>
            <CreateNonprofit/>
          </Col>
          <br/>
          <br/>
          <Col>
            <h4 className='blue-text center'>join existing nonprofit profile</h4>
            <NonprofitList U={U}/>
          </Col>
        </Container>
    )
}

export default NewNonprofit
