import React from 'react';
import './NewVolunteer.css';
import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {Button, Container, Row, Col, Carousel} from 'react-bootstrap';
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
        <form onSubmit={onSubmit} className='round-rectangle blue'>
            <Row className='justify-content-md-center'>
              <Row>
                <label className="white-text field-title">volunteer name</label>
                  <Col>
                    <input
                        type="text"
                        name='firstName'
                        placeholder='first name'
                        value={form.firstName}
                        onChange={updateField}
                        required

                    />
                  </Col>
                  <Col>
                    <input
                        type="text"
                        name='lastName'
                        placeholder='last name'
                        value={form.lastName}
                        onChange={updateField}
                        required
                    />
                  </Col>
              </Row>
              <Row>
                <Col>
                <label className="white-text field-title">zip code</label>
                  <input
                      type="text"
                      name='zipcode'
                      title='Enter valid US zipcode'
                      inputMode="numeric"
                      // pattern="^(?(^00000(|-0000))|(\d{5}(|-\d{4})))$"
                      placeholder='zip code'
                      value={form.zipcode}
                      onChange={updateField}
                      required
                  />
                </Col>
                
                <Col>
                  <div className="updates-row">
                    <div className="email-content">
                      <label className="white-text field-title">
                        get weekly email updates
                      </label>
                      <label className="email">
                        sent to <strong>{user.email}</strong>
                      </label>
                    </div>
                    <div>
                    <input
                      type="checkbox"
                      className='checkbox'
                      name='emailList'
                      value={form.emailList}
                      onChange={updateField}
                    />
                    </div>
                  </div>
                </Col>
              </Row>
            </Row>
            <Row className="justify-content-center" >
              <Col className="justify-content-center">
                <input
                    type="submit"
                    value='create volunteer profile'
                    className='signup-btn green justify-content-center white-text'
                />
              </Col>
            </Row>
        </form>
      </Container>

      
    )
}

export default NewVolunteer