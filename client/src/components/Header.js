import React from 'react'
import Button from './Button'

const Header = ({ title, onAdd, showAdd }) => {
    return (
        <header className='header'>
            <h1 style={{ color:'white'}}>{title}</h1>
            <Button text={showAdd ? 'Close' : 'Sign-Up'}
            onClick={onAdd}
            />
        </header>
    )
}

export default Header
