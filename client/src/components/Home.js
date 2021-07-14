import React from 'react';
// import {useEffect, useState} from 'react';
// import { useAuth0 } from "@auth0/auth0-react";
// import axios from 'axios';

import EventEditor from './Event/EventEditor';
import EventList from './Event/EventList';

const Home = () => {

    return (
        <div>
            <EventList/>
            <br/>
            <EventEditor/>
        </div>);
}
export default Home