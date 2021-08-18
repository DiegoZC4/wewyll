import React, {useState, useEffect} from 'react'
import axios from 'axios';
import {Button} from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";
import Event from './Event';

const EventList = ({ profile, U, myEventsOnly }) => {
  const [events, setEvents] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  const getEvent = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: 'wewyll-api',
      });
      axios.get('/api/event', {headers: {Authorization: `Bearer ${accessToken}`}})
      .then(({data}) => {
        setEvents(data);
        console.log('Data has been received!!', data);
      })
    } catch (e) {
      console.log(e.message);
    }
  };
    
  useEffect(() => {
      getEvent();
    }, []);

  const displayEvents = () => {
    
    let posts = myEventsOnly ? (profile==='volunteer') ? 
      events.filter((e)=>e.volunteers.includes(U.volunteer)) : 
      (profile === 'nonprofit') ?
      events.filter((e)=>e.nonprofit === U.nonprofit) : events : events;
    if (!posts.length) return;
    console.log(posts);
    
    return posts.map((post, index) => {
        let button = 'none';
        if (profile === 'admin' || (profile === 'nonprofit' && post.nonprofit === U.nonprofit)) button = 'delete';
        if (profile === 'volunteer') button = post.volunteers.includes(U.volunteer) ? 'unrsvp' : 'rsvp';
        
        return <Event key={index} post={post} button={button} U={U}/>
    });
  };
  
  
    
    return (
        <div className="blog-">
            <h2>Events</h2>
            <Button variant='success' onClick={getEvent}>Refresh</Button>
            {displayEvents()}
        </div>
    );
  
}

export default EventList