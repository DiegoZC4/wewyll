import Header from './Header'
import React from 'react'
import AddVolunter from './AddVolunteer'
import Volunteers from './Volunteers'
import { useState } from 'react'


function VolunteerOnboard() {
  const [showAddVolunteer, setShowAddVolunteer] = useState(false)
  const [volunteers, setVolunteers] = useState([
    {
        firstName: 'Shane',
        lastName: 'Jones',
        email: 'sjones5@swarthmore.edu',
        zipcode: '06001',
        interests: 'Food banks'
    },
    {
        firstName: 'Sara',
        lastName: 'Lee',
        email: 'slee1@swarthmore.edu',
        zipcode: '19121',
        interests: 'Construction'
    },
    {
        firstName: 'Tom',
        lastName: 'Peterson',
        email: 'tpeterson3@swarthmore.edu',
        zipcode: '90864',
        interests: 'Painting'
    }
  ])

  const addVolunteer = (volunteer) => {
    setVolunteers([...volunteers, volunteer])
  }

  const deleteVolunteer = (email) => {
    setVolunteers(volunteers.filter((volunteer) => volunteer.email !== email))
  }

  return (
    <div className='contain'>
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