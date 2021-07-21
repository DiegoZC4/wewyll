import React, {useState, useEffect} from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Button } from 'react-bootstrap';
import axios from 'axios';

const NonprofitPendingApproval = ({U, setU}) => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [nonprofit, setNonprofit] = useState({});

    
    useEffect(()=>{
      const getNonprofit = async () => {
          try {
            const accessToken = await getAccessTokenSilently({
              audience: 'wewyll-api',
            });
            axios.get(`/api/nonprofit/${U.nonprofit}`, {headers: {Authorization: `Bearer ${accessToken}`}})
            .then(({data}) => {
              console.log(data);
              setNonprofit(data);
            })
          } catch (e) {
            console.log(e.message);
          }
        };
      if (!nonprofit._id) getNonprofit();
    }, [nonprofit]);

    const nonprofitReqStr = (action, npo) => 
      <div>
        {`Your request to ${action} `}
        <h3 className='green-text'>
          {npo.name}
        </h3>
        {` has been received and will be reviewed by a WeWyll admin.`}
      </div>

    const removeRequest = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: 'wewyll-api',
        });
        const newU = {...U, nonprofit:''};
        axios.patch(`/api/user/${U._id}`, newU,{headers: {Authorization: `Bearer ${accessToken}`}})
        .then(() => {
          console.log('changed user');
          setU(newU);
        })
      } catch (e) {
        console.log(e.message);
      }
    };

    return (
        <Container>
            <h4 className='blue-text justify-content-center'>
              <br/>
              <br/>
              {nonprofit.members ? nonprofitReqStr('join',nonprofit) :
                nonprofitReqStr('create a nonprofit profile for',nonprofit)}
            </h4>
            <Button onClick={removeRequest}>withdraw request</Button>
        </Container>
    )
}

export default NonprofitPendingApproval
