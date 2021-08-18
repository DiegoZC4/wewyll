import { Col, Row, Container } from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import Nonprofit from './Nonprofit';
import {Button} from 'react-bootstrap';
import React, {useState, useEffect} from 'react'

const NonprofitList = () => { //{nonprofits}
    const [nonprofits, setNonprofits] = useState([]);
    const { getAccessTokenSilently } = useAuth0();

    
    useEffect(()=>{
        const getNonprofits = async () => {
            try {
              const accessToken = await getAccessTokenSilently({
                audience: 'wewyll-api',
              });
              axios.get('/api/nonprofit', {headers: {Authorization: `Bearer ${accessToken}`}})
              .then(({data}) => {
                setNonprofits(data.filter((a)=>a.visible));
                // console.log('Data has been received!!', isAuthenticated);
              })
            } catch (e) {
              console.log(e.message);
            }
          };
        if (!nonprofits) getNonprofits()
      }, [nonprofits])

      const displayNonprofits = () => {
        // console.log(nonprofits)
        // if (!nonprofits.length) getNonprofits();
        // console.log(nonprofits);
    
        return nonprofits.length ? nonprofits.map((nonprofit, index) => (
          <form className='round-rectangle green' onSubmit={deleteNonprofit} key={index} id={nonprofit._id}>
            <div className="blog-nonprofit__display">
              <h3>{nonprofit.name}</h3>
              <p>{nonprofit.description}</p>
              <Button type='submit' variant='danger'>Delete</Button>
            </div>
          </form>
        )) : <h5 className='blue-text'>no existing nonprofits available</h5>;
      };

      const deleteNonprofit = async (nonprofit) => {
        try {
          let id = nonprofit.target.id;
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
        <Container>
            {displayNonprofits()}
            {/* <Button variant='success' onClick={getNonprofits}>Refresh</Button> */}
        </Container>
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
