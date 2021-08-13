import React from 'react'
import NewEvent from './Event/NewEvent';
import EventList from './Event/EventList';

const AdminDashboard = ({ profile, U, availableProfiles}) => {
    return (
        <div>
            <NewEvent />
            <EventList profile={profile} U={U} availableProfiles={availableProfiles}/>
        </div>
    )
}

export default AdminDashboard
