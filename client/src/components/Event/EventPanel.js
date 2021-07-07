import Header from './Header'
import React from 'react'
import AddEvent from './AddEvent'
import Events from './Events'
import { useState } from 'react'


function EventPanel() {
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [events, setEvents] = useState([
    {
        id: 1,
        organization: 'American Red Cross',
        title: 'Screener',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis perferendis similique aut asperiores, quibusdam aliquam nemo quia et tempore maiores?',
        why: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium modi sed error enim mollitia odit fugiat aspernatur ipsa nisi veniam.',
        when: 'DATE',
        where: 'LOCATION',
        isInperson: true,
        isRemote: false,
        reward: 100,
        isOnetime: true,
        isRecurring: false,
    },
    {
      id: 2,
      organization: 'CA Food Bank',
      title: 'Food Pantry Stocker',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis perferendis similique aut asperiores, quibusdam aliquam nemo quia et tempore maiores?',
      why: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium modi sed error enim mollitia odit fugiat aspernatur ipsa nisi veniam.',
      when: 'DATE',
      where: 'LOCATION',
      isInperson: true,
      isRemote: false,
      reward: 100,
      isOnetime: false,
      isRecurring: true,
    },
    {
      id: 3,
      organization: 'CA Construction',
      title: 'House Painter',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis perferendis similique aut asperiores, quibusdam aliquam nemo quia et tempore maiores?',
      why: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium modi sed error enim mollitia odit fugiat aspernatur ipsa nisi veniam.',
      when: 'DATE',
      where: 'LOCATION',
      isInperson: true,
      isRemote: false,
      reward: 100,
      isOnetime: true,
      isRecurring: false,
    }
  ])

  const addEvent = (event) => {
    setEvents([...events, event])
  }

  const deleteVolunteer = (id) => {
    setEvents(events.filter((event) => event.id !== id))
  }

  return (
    <div className='contain'>
      <Header
      title="Event"
      showAdd={showAddEvent}
      onAdd={() => {
        setShowAddEvent(!showAddEvent)
      }
        
      }
      />
      {showAddEvent && <AddEvent onAdd={addEvent}/>}
      {events.length > 0 ? <Events events={events} onDelete={deleteVolunteer}/> :
      <h2 style={{ color: 'white'}}>No Events to Display</h2>}
    </div>
  );
}

export default EventPanel;

