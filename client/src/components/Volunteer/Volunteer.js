import {FaTimes} from 'react-icons/fa'
import React from 'react'

const Volunteer = ({ volunteer, onDelete }) => {

    const fullName = volunteer.firstName.concat(' ',volunteer.lastName)

    return (
        <div className='volunteer'>
            <h3>
                {fullName}
                <FaTimes 
                    id='delete'
                    style={{ color:'white', cursor: 'pointer'}}
                    onClick={onDelete}
                />
            </h3>
            <p>{volunteer.email}</p>
            {/* <p>{volunteer.zipcode}</p>
            <p>{volunteer.interests}</p> */}
        </div>
    )
}

export default Volunteer
