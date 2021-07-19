import { Col, Row, Container } from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import Nonprofit from './Nonprofit';
import {Button} from 'react-bootstrap';
import React, {useState } from 'react'

const NonprofitList = () => { //{nonprofits}
    const [nonprofits, setNonprofits] = useState([]);
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    const getNonprofit = async () => {
        try {
          const accessToken = await getAccessTokenSilently({
            audience: 'wewyll-api',
          });
          axios.get('/api/nonprofit', {headers: {Authorization: `Bearer ${accessToken}`}})
          .then((response) => {
            const data = response.data;
            setNonprofits(data);
            console.log('Data has been received!!', isAuthenticated);
          })
        } catch (e) {
          console.log(e.message);
        }
      };

      const displayNonprofits = (nonprofits) => {

        if (!nonprofits.length) return null;
        console.log(nonprofits);
    
        return isAuthenticated && nonprofits.map((nonprofit, index) => (
          <form onSubmit={deleteNonprofit} key={index} id={nonprofit._id}>
            <div className="blog-nonprofit__display">
              <h3>{nonprofit.name}</h3>
              <p>{nonprofit.description}</p>
              <Button type='submit' variant='danger'>Delete</Button>
            </div>
          </form>
        ));
      };

      const deleteNonprofit = async (nonprofit) => {
        try {
          let id = nonprofit.target.id
          console.log(id);
          nonprofit.preventDefault();
          const accessToken = await getAccessTokenSilently({
            audience: 'wewyll-api',
          });
          axios.delete(`/api/nonprofit/${id}`, {headers: {Authorization: `Bearer ${accessToken}`}})
          .then((response) => {
            console.log('Nonprofit deleted', response);
          })
        } catch (e) {
          console.log(e.message);
        }
      }

      return (
        <div className="blog-">
            <h2>Nonprofits</h2>
            <Button variant='success' onClick={getNonprofit}>Refresh</Button>
            {displayNonprofits(nonprofits)}
        </div>
    );


    // return (
    //     <div>
    //         <h2>Nonprofit List</h2>
    //         <p>TEST</p>
    //         {/* {nonprofits.map((npo)=>
    //                 <Row key={npo.name}><Nonprofit data={npo.description}/></Row>)} */}
    //     </div>
    // )
}

export default NonprofitList
