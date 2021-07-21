import React, {useState} from 'react'
import axios from 'axios';
import {Button} from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";

const NewEvent = ({ Nonprofit }) => {
  const defaultForm = {
    nonprofit: '93557eee-26ec-4438-9900-3297f292bd2d',
    title: '',
    when: '',
    description: '', 
  }

  const [form, setForm] = useState(defaultForm);
  
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  
  const postEvent = async (event) => {
    event.preventDefault();
    try {
      const accessToken = await getAccessTokenSilently({
        audience: 'wewyll-api',
      });
      console.log(accessToken);
      axios.post('/api/event', form, {headers: {Authorization: `Bearer ${accessToken}`}})
      .then((response) => {
        console.log('Event has been posted', response, isAuthenticated);
        resetUserInputs();
      })
    } catch (e) {
      console.log(e.message);
    }
  };

  const updateField = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetUserInputs = () => {
    setForm(defaultForm);
  };

  
  return (
        <form onSubmit={ postEvent }>
          <h2>Add Event</h2>
          <div className="form-input">
            <input 
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={updateField}
            />
          </div>
          <div className="form-input">
            <input 
              type="text"
              name="when"
              placeholder="When"
              value={form.when}
              onChange={updateField}
            />
          </div>
          <div className="form-input">
            <textarea
              placeholder="description"
              name="description"
              cols="30"
              rows="10"
              value={form.description}
              onChange={updateField}
            >
              
            </textarea>
          </div>
          <Button variant='primary' type='submit'>Submit</Button>
        </form>
    )
}

export default NewEvent
