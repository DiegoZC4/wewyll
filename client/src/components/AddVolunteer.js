import React from 'react'

import { useState } from 'react'

const defaultForm = {
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    dob: '',
    zipcode: '',
    prevExperience: false,
    languages: '',
    interests: '',
    transportation: ''
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
            <div className='form-control'>
                <label>Volunteer Name</label>
                <div className='form-row'>
                    <input
                        type="text"
                        name='firstName'
                        placeholder='First Name'
                        value={form.firstName}
                        onChange={updateField}

                    />
                
                    <input
                        type="text"
                        name='lastName'
                        placeholder='Last Name'
                        value={form.lastName}
                        onChange={updateField}
                    />
                </div>
            </div>
            <div className='form-control'>
                <label>Email Address</label>
                <input
                    type="text"
                    name='email'
                    placeholder='Email'
                    value={form.email}
                    onChange={updateField}

                />
            </div>
            <div className="form-row">
                <div className='form-control'>
                        <label>Gender</label>
                        <select>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Prefer not to say">Prefer not to say</option>

                        </select>
                </div>
                <div className='form-control'>
                        <label>Date of Birth</label>
                        <input
                            type="text"
                            name='dob'
                            placeholder='MM/DD/YYYY'
                            value={form.dob}
                            onChange={updateField}
                        />
                </div>
            </div>
            <div className="form-row">
                <div className='form-control'>
                    <label>Zip Code</label>
                    <input
                        type="text"
                        name='zipcode'
                        placeholder='Zip Code'
                        value={form.zipcode}
                        onChange={updateField}

                    />
                </div>
                <div className='form-control form-control-check'>
                    <label>Previous Volunteer Experience</label>
                    <input
                        type="checkbox"
                    />
                </div>
            </div>

            <div className='form-control'>
                <label>Languages</label>
                <input
                    type="text"
                    name='languages'
                    placeholder='Ex. English, Spanish'
                    value={form.languages}
                    onChange={updateField}
                />
            </div>
            <div className='form-control'>
                <label>Volunteer Interests</label>
                <input
                    type="text"
                    name='interests'
                    placeholder='Interests'
                    value={form.interests}
                    onChange={updateField}
                />
            </div>
            <div className='form-control'>
                <label>Available Methods of Transportation</label>
                <input
                    type="text"
                    name="transportation"
                    placeholder='Transportation'
                    value={form.transportation}
                    onChange={updateField}
                />
            </div>


            <input
                type="submit"
                value='Sign-Up'
                className='btn btn-block'
            />
        </form>
    )
}

export default AddVolunteer
