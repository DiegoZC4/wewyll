import React from 'react'

const Error = ({error}) => {
    return (
        <h1>
            {error.message}
        </h1>
    )
}

export default Error
