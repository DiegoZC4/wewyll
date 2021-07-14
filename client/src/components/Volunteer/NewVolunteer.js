import React from 'react';
import './NewVolunteer.css';
import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {Button, Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
const defaultForm = {
    firstName: '',
    lastName: '',
    zipcode: '',
    emailList: false,
}

const NewVolunteer = () => {

  const isValidUSZip = (sZip) => {
    return /^\d{5}(-\d{4})?$/.test(sZip);
  }

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  
  const onAdd = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: 'wewyll-api',
      });
      axios.post(`/api/volunteer`, form, {headers: {Authorization: `Bearer ${accessToken}`}})
      .then((response) => {
        console.log(response.data);
      })
    } catch (e) {
      console.log(e);
    }
  };
    const [form, setForm] = useState(defaultForm)

    const updateField = e => {
        setForm({
          ...form,
          [e.target.name]: e.target.value
        });
      };

    const onSubmit = (e) => {
        e.preventDefault()

        onAdd( form )

        setForm(defaultForm)
    }

    return (
      <Container>
        <form onSubmit={onSubmit} className='round-rectangle green'>
            <Row className='justify-content-md-center'>
                <label>Volunteer Name</label>
                  <Col>
                    <input
                        type="text"
                        name='firstName'
                        placeholder='First Name'
                        value={form.firstName}
                        onChange={updateField}
                        required

                    />
                  </Col>
                  <Col>
                    <input
                        type="text"
                        name='lastName'
                        placeholder='Last Name'
                        value={form.lastName}
                        onChange={updateField}
                        required
                    />
                  </Col>
            
                <label>Zip Code</label>
                <Col>
                  <input
                      type="text"
                      name='zipcode'
                      title='Enter valid US zipcode'
                      inputMode="numeric"
                      // pattern="^(?(^00000(|-0000))|(\d{5}(|-\d{4})))$"
                      placeholder='Zip Code'
                      value={form.zipcode}
                      onChange={updateField}
                      required
                  />
                </Col>
            
                <label>Get weekly email updates
                (sent to <strong>{user.email}</strong>)
                </label>
                <center>
                <input
                    className='checkbox'
                    type="checkbox"
                    name='emailList'
                    value={form.emailList}
                    onChange={updateField}
                />
                </center>
            </Row>
            <Row className="justify-content-center" >
              <Col className="justify-content-center">
                <input
                    type="submit"
                    value='Create Volunteer Profile'
                    className='signup-btn blue justify-content-center'
                />
              </Col>
            </Row>
        </form>
      </Container>
    )
}

export default NewVolunteer