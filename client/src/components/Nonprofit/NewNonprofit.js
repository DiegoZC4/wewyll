import React, {useState, useEffect} from 'react'
import { Col, Row, Container } from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import Nonprofit from './Nonprofit';
import NonprofitList from './NonprofitList';

const NewNonprofit = () => {
    const nonprofitStyle = {
        margin: '20px',
        width: '50%',
        borderRadius: '10px',
        padding: '10px',
        color: '#fff',
    }
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    const [form, setForm] = useState({name:'', description:''});
    const [nonprofits, setNonprofits] = useState([]);

    useEffect(() => {
        const getNonprofits = async () => {
            try {
              const accessToken = await getAccessTokenSilently({
                audience: 'wewyll-api',
              });
              axios.get(`/api/nonprofit`, {headers: {Authorization: `Bearer ${accessToken}`}})
              .then((response) => {
                console.log(response.data)
                setNonprofits(response.data)
                })
            } catch (e) {
              console.log(e);
            }
          };
        getNonprofits();
    }, [user])

    const updateField = e => {
        setForm({
          ...form,
          [e.target.name]: e.target.value
        });
      };
    
      const postNonprofit = async () => {
        try {
          const accessToken = await getAccessTokenSilently({
            audience: 'wewyll-api',
          });
          axios.post(`/api/nonprofit`, form, {headers: {Authorization: `Bearer ${accessToken}`}})
          .then((response) => {
            console.log(response.data);
            })
        } catch (e) {
          console.log(e);
        }
      };

    return (
      <div>
        <Container>
            <Row className='justify-content-center'>
                <Col>
                    <h4 className='blue-text center'>create new nonprofit profile</h4>
                    <form className='round-rectangle green' onSubmit={postNonprofit}>
                            <Row>
                                <label>Nonprofit Name</label>
                                <div className='form-row'>
                                    <input
                                        type="text"
                                        name='name'
                                        placeholder='Name'
                                        value={form.firstName}
                                        onChange={updateField}
                                        required
                                        />
                                </div>
                            </Row>
                            <Row>
                                <label>Description</label>
                                <textarea
                                    cols="15"
                                    rows="3"
                                    className='justify-content-md-center center'
                                    name='description'
                                    placeholder='Description'
                                    value={form.description}
                                    style={{marginLeft:10, width:'80%'}}
                                    onChange={updateField}
                                    required
                                />
                            </Row>
                        <br/>
                        <Row className='justify-content-center'>
                          <input
                              type="submit"
                              value='Create Nonprofit Profile'
                              className='signup-btn blue center'
                          />
                        </Row>
                    </form>
                </Col>
                <Col>
                    <h4 className='blue-text center'>join existing nonprofit profile</h4>
                    
                </Col>
            </Row>
        </Container>
        <NonprofitList />
      </div>
    )
}

export default NewNonprofit
