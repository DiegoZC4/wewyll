import React from 'react'
import {Button} from 'react-bootstrap';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from 'react'

export const Nonprofit = ({ post, button, U }) => {
    console.log(post._id)
    const { getAccessTokenSilently } = useAuth0();

    const deleteNonprofit = async () => {

        console.log('Deleting nonprofit');
        try {
          console.log("ID", post._id);
          const accessToken = await getAccessTokenSilently({
            audience: 'wewyll-api',
          });
          axios.delete(`/api/nonprofit/${post._id}`, {headers: {Authorization: `Bearer ${accessToken}`}})
          .then((response) => {
            console.log('nonprofit deleted', response);
          })
        } catch (e) {
          console.log(e.message);
        }
        window.location.reload()
      }

      const getButtonType = () => {
        if (post.visible && (U.admin || U.nonprofit == post._id)) {
            return <Button type='submit' variant='danger' onClick = {deleteNonprofit}>Delete</Button>
        } else if (post.visible && !U.admin) {
            return <Button type='submit' variant='primary'>Join</Button>
        } else {
            return <p>No button to display</p>
        }
      }

      console.log("HERE")
      console.log(U)


    return (
        <div>
            {post.visible && (U.admin || (U.nonprofit == post._id)) ? 
              (<div>
                <h3>{post.name}</h3>
                <p>{post.description}</p>
                {getButtonType()}
                
            </div>) : 
                        <div/>}
        </div>
    )
}

export default Nonprofit;



// import React from 'react'

// const Nonprofit = ({data}) => {
//     return (
//         <div className='green round-rectangle'>
//             <h5>{data.name}</h5>
//             <p>Members: {data.members ? data.members: 0}<br/>
//             Description: {data.description}</p>
//         </div>
//     )
// }

// export default Nonprofit
