import React, {useState } from 'react'
import axios from 'axios';
import {Button} from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";
import Event from './Event';

const EventList = ({ profile, U, availableProfiles }) => {
  const [events, setEvents] = useState([]);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  // const accessToken = getAccessTokenSilently({
  //   audience: `wewyll-api`,
  // });
  
  // const getEvent = () => {

  //   axios.get('/api/event', {headers: {Authorization: `Bearer ${accessToken}`}})
  //     .then((response) => {
  //       const data = response.data;
  //       setEvents(data);
  //       console.log('Data has been received!!', user, isAuthenticated);
  //     })
  //     .catch((err) => {
  //       alert('Error retrieving data!!!');
  //       console.log(err);
  //     });
  //   }


  const getEvent = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: 'wewyll-api',
      });
      axios.get('/api/event', {headers: {Authorization: `Bearer ${accessToken}`}})
      .then((response) => {
        const data = response.data;
        setEvents(data);
        console.log('Data has been received!!', isAuthenticated);
      })
    } catch (e) {
      console.log(e.message);
    }
  };
    
  // useEffect(() => {
  //     getEvent();
  //   }, []);
    
    // useEffect(() => {
    //   getEvent();
    // });

  const displayEvents = (posts) => {

    if (!posts.length) return null;
    console.log(posts);

    return isAuthenticated && posts.map((post, index) => (
      <div>
        <Event key={index} post={post} profile={profile} U={U} availableProfiles={availableProfiles}/>
      </div>
    ));
  };
  
  
    
    return (
        <div className="blog-">
            <h2>Events</h2>
            <Button variant='success' onClick={getEvent}>Refresh</Button>
            {displayEvents(events)}
        </div>
    );
  
}

export default EventList