import React from 'react'
import NewEvent from './Event/NewEvent';
import EventList from './Event/EventList';

const AdminDashboard = () => {
    return (
        <div>
            <NewEvent />
            <EventList />
        </div>
    )
}

export default AdminDashboard
