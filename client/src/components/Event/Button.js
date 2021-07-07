import React from 'react'

const Button = ({ text, onClick }) => {
    return (
        <button 
        className='butn'
        // style={{ backgroundColor: '#40ccb4', width: 130, color:'white' }}
        onClick={ onClick }
        >
            {text}
        </button>
    )
}

export default Button
