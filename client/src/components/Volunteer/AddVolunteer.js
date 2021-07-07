import React from 'react'

import { useState } from 'react'

const defaultForm = {
    firstName: '',
    lastName: '',
    email: '',
    zipcode: '',
    interests: '',
}

const AddVolunteer = ({ onAdd }) => {

    const [form, setForm] = useState(defaultForm)

    const updateField = e => {
        setForm({
          ...form,
          [e.target.name]: e.target.value
        });
      };

    const onSubmit = (e) => {
        e.preventDefault()

        onAdd( form )

        setForm(defaultForm)
    }

    return (
        <form className='add-form' onSubmit={onSubmit}>
            <div className='formcontrol'>
                <label>Volunteer Name</label>
                <div className='form-row'>
                    <input
                        type="text"
                        name='firstName'
                        placeholder='First Name'
                        value={form.firstName}
                        onChange={updateField}
                        required

                    />
                
                    <input
                        type="text"
                        name='lastName'
                        placeholder='Last Name'
                        value={form.lastName}
                        onChange={updateField}
                        required
                    />
                </div>
            </div>
            <div className='formcontrol'>
                <label>Email Address</label>
                <input
                    type="text"
                    name='email'
                    placeholder='Email'
                    value={form.email}
                    onChange={updateField}
                    required
                />
            </div>
            <div className='formcontrol'>
                <label>Zip Code</label>
                <input
                    type="text"
                    name='zipcode'
                    placeholder='Zip Code'
                    value={form.zipcode}
                    onChange={updateField}
                    required
                />
            </div>
            <div className='formcontrol'>
                <label>Volunteer Interests (Optional)</label>
                <input
                    type="text"
                    name='interests'
                    placeholder='Interests'
                    value={form.interests}
                    onChange={updateField}
                />
            </div>


            <input
                type="submit"
                value='Sign-Up'
                className='signup-butn'
            />

        </form>
    )
}

export default AddVolunteer
