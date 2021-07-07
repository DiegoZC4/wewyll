import Event from './Event'
import React from 'react'

const Events = ({ events, onDelete }) => {

    return (
        <div>
            {events.map((event) => (
                <Event key={event.id} event={event}
                onDelete={() => onDelete(event.id)}/>
            ))}
        </div>
    )
}

export default Events
