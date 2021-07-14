import React from 'react'

const Nonprofit = ({data}) => {
    return (
        <div className='green round-rectangle'>
            <p>{data.name}</p>
            <p>{data.description}</p>
        </div>
    )
}

export default Nonprofit
