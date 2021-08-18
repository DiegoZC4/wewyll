import React from 'react'
import {Button} from 'react-bootstrap';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from 'react'

export const Event = ({ post, button, U }) => {
    console.log(post._id)
    const { getAccessTokenSilently } = useAuth0();

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
          for (let vol of post.volunteers){
            axios.get(`/api/volunteer/${vol}`, {headers: {Authorization: `Bearer ${accessToken}`}})
            .then(({data}) => {
              axios.patch(`/api/volunteer/${vol._id}`, {...data,rsvps:data.rsvps.filter((e)=>e!==post._id)}, {headers: {Authorization: `Bearer ${accessToken}`}})
              .then((response) => {
                console.log('removed event',post._id,'from volunteer',vol._id);
              })
            })
          }
        } catch (e) {
          console.log(e.message);
        }
        window.location.reload()
      }

      const rsvpEvent = async () => {
        console.log('RSVP Event')
        try {
          console.log("ID", post._id);
          const accessToken = await getAccessTokenSilently({
            audience: 'wewyll-api',
          });
          axios.patch(`/api/event/${post._id}`, {...post,volunteers:[...post.volunteers, U.volunteer]}, {headers: {Authorization: `Bearer ${accessToken}`}})
          .then((response) => {
            console.log('added volunteer to event', response);
          })
          axios.get(`/api/volunteer/${U.volunteer}`, {headers: {Authorization: `Bearer ${accessToken}`}})
          .then(({data}) => {
            console.log(data)
            axios.patch(`/api/volunteer/${data._id}`, {...data,rsvps:[...data.rsvps, post._id]}, {headers: {Authorization: `Bearer ${accessToken}`}})
            .then((response) => {
              console.log('added event to volunteer');
            })
          })
        } catch (e) {
          console.log(e.message);
        }
        window.location.reload()
      }

      const unRsvp = async () =>{
        try {
          console.log("ID", post._id);
          const accessToken = await getAccessTokenSilently({
            audience: 'wewyll-api',
          });
          let vol = U.volunteer;
          axios.get(`/api/volunteer/${vol}`, {headers: {Authorization: `Bearer ${accessToken}`}})
          .then(({data}) => {
            axios.patch(`/api/volunteer/${vol._id}`, {...data,rsvps:data.rsvps.filter((e)=>e!==post._id)}, {headers: {Authorization: `Bearer ${accessToken}`}})
            .then((response) => {
              console.log('removed event',post._id,'from volunteer',vol._id);
            })
          })
          axios.patch(`/api/event/${post._id}`, {...post,volunteers:post.volunteers.filter((e)=>e!==U.volunteer)}, {headers: {Authorization: `Bearer ${accessToken}`}})
          .then((response) => {
            console.log('added volunteer to event', response);
          })
        } catch (e) {
          console.log(e.message);
        }
      }

      //   try {
      //     console.log("ID", post._id);
      //     let present = false
      //     for (let i = 0; i < U.rsvpEvent.length; i++) {
      //       if (U.rsvpEvent[i] === post._id) {
      //         present = true
      //       }
      //     }
      //     if (!present) {
      //       U.rsvpEvent = [...U.rsvpEvent, post._id];
      //     } else {
      //       console.log('ID already listed')
      //     }
          
      //   } catch (e) {
      //     console.log(e.message);
      //   }
      // }

    return (
        <div>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            {/* {profile === 'admin' || (profile === 'nonprofit' && post.nonprofit === U.nonprofit)  */}
            {button === 'delete' ? 
              (<Button type='submit' variant='danger' onClick = {deleteEvent}>Delete</Button>) : 
                (button==='rsvp') ?
                  (<Button type='submit' variant='primary' onClick = {rsvpEvent}>RSVP</Button>) :
                    (button ==='unrsvp') ?
                      (<Button type='submit' variant='primary' onClick = {unRsvp}>unRSVP</Button>) :
                        <div/>}
        </div>
    )
}

export default Event;