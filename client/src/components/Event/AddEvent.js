import React from 'react'

import { useState } from 'react'

const defaultForm = {
    id: 0,
    eventOrganization: '',
    eventTitle: '',
    description: '',
    why: '',
    when: '',
    where: '',
    isInperson: false,
    isRemote: false,
    reward: 0,
    isOnetime: false,
    isRecurring: false,
}

const AddEvent = ({ onAdd }) => {

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
                <label>Organization</label>
                <input
                    type="text"
                    name='organization'
                    placeholder='Name of Organization'
                    value={form.organization}
                    onChange={updateField}
                />
            </div>
            <div className='formcontrol'>
                <label>Event Title</label>
                <input
                    type="text"
                    name='title'
                    placeholder='Title of Event'
                    value={form.title}
                    onChange={updateField}
                />
            </div>
            <div className='formcontrol'>
                <label>Description</label>
                <input
                    type="text"
                    name='description'
                    placeholder='Description of the Event'
                    value={form.description}
                    onChange={updateField}
                />
            </div>
            <div className='formcontrol'>
                <label>Significance</label>
                <input
                    type="text"
                    name='why'
                    placeholder='Significance of the Event'
                    value={form.why}
                    onChange={updateField}
                />
            </div>
            <div className='formcontrol'>
                <label>When</label>
                <input
                    type="text"
                    name='when'
                    placeholder='Time of the Event'
                    value={form.when}
                    onChange={updateField}
                />
            </div>
            <div className='formcontrol'>
                <label>Where</label>
                <input
                    type="text"
                    name='where'
                    placeholder='Location of the Event'
                    value={form.where}
                    onChange={updateField}
                />
            </div>
            <input
                type="submit"
                value='Submit Event'
                className='signup-butn'
            />
        </form>
    )
}

export default AddEvent
