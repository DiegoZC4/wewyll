import Volunteer from './Volunteer.js'
import React from 'react'

const Volunteers = ({ volunteers, onDelete }) => {

    return (
        <div>
            {volunteers.map((volunteer) => (
                <Volunteer key={volunteer.firstName} volunteer={volunteer}
                onDelete={() => onDelete(volunteer.firstName)}/>
            ))}
        </div>
    )
}

export default Volunteers
