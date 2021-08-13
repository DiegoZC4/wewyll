import React from 'react'
import {Button} from 'react-bootstrap';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from 'react'

export const Event = ({ post, index, profile, U, availableProfiles }) => {
    console.log(post._id)
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    const deleteEvent = async () => {

        console.log('Deleting event');
        try {
          console.log("ID", post._id);
          const accessToken = await getAccessTokenSilently({
            audience: 'wewyll-api',
          });
          axios.delete(`/api/event/${post._id}`, {headers: {Authorization: `Bearer ${accessToken}`}})
          .then((response) => {
            console.log('Event deleted', response);
          })
        } catch (e) {
          console.log(e.message);
        }
      }

      const rsvpEvents = async () => {
        console.log('RSVP Event')
        try {
          console.log("ID", post._id);
          let present = false
          for (let i = 0; i < U.rsvpEvent.length; i++) {
            if (U.rsvpEvent[i] === post._id) {
              present = true
            }
          }
          if (!present) {
            U.rsvpEvent = [...U.rsvpEvent, post._id];
          } else {
            console.log('ID already listed')
          }
          
        } catch (e) {
          console.log(e.message);
        }
      }

    return (
        <div>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            {profile === 'admin' || profile === 'nonprofit' ? (
            <Button type='submit' variant='danger' onClick = {deleteEvent}>Delete</Button>
            ) : (
            <Button type='submit' variant='primary' onClick = {rsvpEvents}>RSVP</Button>
            )}
        </div>
    )
}

export default Event;