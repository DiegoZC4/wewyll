import Volunteer from './Volunteer.js'
import React from 'react'

const Volunteers = ({ volunteers, onDelete }) => {

    return (
        <div>
            {volunteers.map((volunteer) => (
                <Volunteer key={volunteer.email} volunteer={volunteer}
                onDelete={() => onDelete(volunteer.email)}/>
            ))}
        </div>
    )
}

export default Volunteers
