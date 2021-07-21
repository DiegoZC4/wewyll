import React from 'react'

const Nonprofit = ({data}) => {
    return (
        <div className='green round-rectangle'>
            <h5>{data.name}</h5>
            <p>Members: {data.members ? data.members: 0}<br/>
            Description: {data.description}</p>
        </div>
    )
}

export default Nonprofit
