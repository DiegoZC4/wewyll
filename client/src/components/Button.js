import React from 'react'

const Button = ({ text, onClick }) => {
    return (
        <button className='btn'
        style={{ backgroundColor: '#40ccb4', width: 130 }}
        className='btn'
        onClick={ onClick }
        >
            {text}
        </button>
    )
}

export default Button
