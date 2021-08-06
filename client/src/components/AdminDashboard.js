import React from 'react'
import NewEvent from './Event/NewEvent';
import EventList from './Event/EventList';

const AdminDashboard = ({ profile }) => {
    return (
        <div>
            <NewEvent />
            <EventList profile={profile}/>
        </div>
    )
}

export default AdminDashboard
