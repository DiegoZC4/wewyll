import {FaTimes} from 'react-icons/fa'
import React from 'react'

const Volunteer = ({ volunteer, onDelete }) => {
    return (
        <div className='volunteer'>
            <h3>
                {volunteer.firstName}
                <FaTimes 
                    id='delete'
                    style={{ color:'white', cursor: 'pointer'}}
                    onClick={onDelete}
                />
            </h3>
            <p>{volunteer.email}</p>
        </div>
    )
}

export default Volunteer
