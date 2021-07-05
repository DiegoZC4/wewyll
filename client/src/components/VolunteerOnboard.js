import Header from './Header'
import React from 'react'
import AddVolunter from './AddVolunteer'
import Volunteers from './Volunteers'
import { useState } from 'react'


function VolunteerOnboard() {
  const [showAddVolunteer, setShowAddVolunteer] = useState(false)
  const [volunteers, setVolunteers] = useState([
    {
        firstName: 'Shane Jones',
        email: 'sjones5@swarthmore.edu',
        dob: '10/30/1999',
        zipcode: '06001',
    },
    {
        firstName: 'John',
        email: 'john5@swarthmore.edu',
        dob: '05/30/85',
        zipcode: '19121',
    },
    {
        firstName: 'Tom',
        email: 'toms5@swarthmore.edu',
        dob: '07/27/95',
        zipcode: '90864',
    }
  ])

  const addVolunteer = (volunteer) => {
    setVolunteers([...volunteers, volunteer])
  }

  const deleteVolunteer = (firstName) => {
    setVolunteers(volunteers.filter((volunteer) => volunteer.firstName !== firstName))
  }

  return (
    <div className='container'>
      <Header
      title="Volunteer"
      showAdd={showAddVolunteer}
      onAdd={() => {
        setShowAddVolunteer(!showAddVolunteer)
      }
        
      }
      />
      {showAddVolunteer && <AddVolunter onAdd={addVolunteer}/>}
      {volunteers.length > 0 ? <Volunteers volunteers={volunteers} onDelete={deleteVolunteer}/> :
      <h2 style={{ color: 'white'}}>No Volunteers to Display</h2>}
    </div>
  );
}

export default VolunteerOnboard;