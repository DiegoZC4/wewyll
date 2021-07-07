import React from 'react';
// import WeNav from './components/WeNav';
// import EventEditor from './components/EventEditor';
// import EventList from './components/EventList';
// import OrganizationEditor from './components/OrganizationEditor';
// import OrganizationList from './components/OrganizationList';
// import VolunteerEditor from './components/VolunteerEditor';
// import VolunteerList from './components/VolunteerList';
// import Upload from './components/Upload';
import VolunteerOnboard from './components/VolunteerOnboard';

import './index.css';

import './App.css';

class App extends React.Component {

  render() {

    //console.log('State: ', this.state);

    //JSX
    return(
      <div className="app">
        {/* <WeNav/> */}
        <h1>Welcome to WeWyll</h1>

        <VolunteerOnboard />

        {/* <EventList/>
        <br/>
        <EventEditor/>
        <hr/>
        <br/>
        <OrganizationList/>
        <br/>
        <OrganizationEditor/>
        <hr/>
        <br />
        <VolunteerList/>
        <br/>
        <VolunteerEditor/> */}
      </div>
    );
  }
}


export default App;