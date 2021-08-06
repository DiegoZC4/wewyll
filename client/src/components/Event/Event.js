import React from 'react'
import {Button} from 'react-bootstrap';

export const Event = ({ post, index, profile, onDelete }) => {
    return (
        <div>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            {profile === 'admin' || profile === 'nonprofit' ? (
            <Button type='submit' variant='danger' onClick={onDelete}>Delete</Button>
            ) : (
            <Button type='submit' variant='primary'>RSVP</Button>
            )}
        </div>
    )
}

export default Event;