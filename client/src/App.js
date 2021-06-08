import React from 'react';
import WeNav from './components/WeNav';
import EventEditor from './components/EventEditor';
import EventList from './components/EventList';
import './App.css';

class App extends React.Component {

  render() {

    //console.log('State: ', this.state);

    //JSX
    return(
      <div className="app">
        <WeNav/>
        <br/>
        <h1>Welcome to WeWyll</h1>
        <EventList/>
        <br/>
        <EventEditor/>
        <br/>
        <br/>
      </div>
    );
  }
}


export default App;