import React from 'react'

export const Event = ({ post, index }) => {
    return (
        <div>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
        </div>
    )
}

export default Event;