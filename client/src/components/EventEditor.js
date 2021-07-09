import React, {useState, useEffect } from 'react'
import axios from 'axios';
import {Button} from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";

const EventEditor = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  
  const postEvent = async (title) => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: 'wewyll-api',
      });
      console.log(accessToken);
      axios.post('/api/event', {headers: {Authorization: `Bearer ${accessToken}`}, title: title, user:user})
      .then((response) => {
        console.log('Event has been posted', response, isAuthenticated);
        resetUserInputs();
      })
    } catch (e) {
      console.log(e.message);
    }
  };

  const submitEvent = (event) => {
    event.preventDefault();
    postEvent(title);

    // const payload = {
    //   title: this.state.title,
    //   body: this.state.body
    // };

    // axios({
    //   url: '/api/save',
    //   method: 'POST',
    //   data: payload
    // })
    //   .then(() => {
    //     console.log('Data has been sent to the server');
    //     this.resetUserInputs();
    //     //this.getEvent();
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });;
  };

  const resetUserInputs = () => {
    setTitle('');
    setBody('');
  };

  
  return (
        <form onSubmit={submitEvent}>
          <h2>Add Event</h2>
          <div className="form-input">
            <input 
              type="text"
              name="title"
              placeholder="Title"
              value={title}
              onChange={(ev)=>{setTitle(ev.target.value)}}
            />
          </div>
          <div className="form-input">
            <textarea
              placeholder="body"
              name="body"
              cols="30"
              rows="10"
              value={body}
              onChange={(ev)=>{setBody(ev.target.value)}}
            >
              
            </textarea>
          </div>
          <Button variant='primary' type='submit'>Submit</Button>
        </form>
    )
  
}

export default EventEditor
