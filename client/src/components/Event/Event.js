import {FaTimes} from 'react-icons/fa'
import React from 'react'

const Event = ({ event, onDelete }) => {

    return (
        <div className='event'>
            <h3 className='event-title'>
                {event.title}
                <FaTimes 
                    id='delete'
                    style={{ color:'white', cursor: 'pointer'}}
                    onClick={onDelete}
                />
            </h3>
            <div className="inforow">
                <div className='event-values'>Organization</div>
                <div className='event-keys'>{event.organization}</div>
            </div>
            <div className="inforow">
                <div className='event-values'>Description</div>
                <div className='event-keys'>{event.description}</div>
            </div>
            <div className="inforow">
                <div className='event-values'>Significance</div>
                <div className='event-keys'>{event.why}</div>
            </div>
            <div className="inforow">
                <div className='event-values'>When</div>
                <div className='event-keys'>{event.when}</div>
            </div>
            <div className="inforow">
                <div className='event-values'>Where</div>
                <div className='event-keys'>{event.where}</div>
            </div>

            
        </div>
    )
}

export default Event