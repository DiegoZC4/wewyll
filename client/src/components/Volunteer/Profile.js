import React from 'react'
import {Button} from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

const Profile = ({U}) => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();


    const rsvpEvents = U.rsvpEvent;

    const deleteVolunteer = async () => {
        try {
          const accessToken = await getAccessTokenSilently({
            audience: 'wewyll-api',
          });
          axios.delete(`/api/volunteer/${U.volunteer}`, {headers: {Authorization: `Bearer ${accessToken}`}})
          .then((response) => {
            console.log('deleted volunteer');
          })
        } catch (e) {
          console.log(e);
        }
      };
    return (
        <div>
            <Button onClick={deleteVolunteer}>Delete Volunteer</Button>
            <Button>Delete User</Button>
            

        </div>
    )
}

export default Profile
