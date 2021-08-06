import React, {useEffect, useState} from 'react';
import axios from 'axios';

import Header from './components/Header';
import Home from './components/Home';
import Loading from './components/Loading';
import Error from './components/Error';

import Profile from './components/Volunteer/Profile';
import About from './components/About';
import Footer from './components/Footer';
import Onboard from './components/Onboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';
import { useAuth0 } from "@auth0/auth0-react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";

const App = () => {
  const { user, isAuthenticated, getAccessTokenSilently, isLoading, error } = useAuth0();

  const [U, setU] = useState({});

  const [profileTypes, setProfileTypes] = useState(['volunteer', 'nonprofit', 'business']);
  const [profile, setProfile] = useState(profileTypes[0]);
  const [availableProfiles, setAvailableProfiles] = useState([]);


  const getProfileRoutes = (profile) => {
    if (!availableProfiles.includes(profile)) return <Onboard onboardType={profile} setOnboardType={setProfile} onboardOptions={profileTypes.filter((o)=>o!=='admin')}/>
    switch (profile) {
      case 'volunteer':
        return (
          <Switch>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/profile">
              <Profile U={U}/>
            </Route>
            <Route path="/">
            </Route>
          </Switch>
        )
        case 'nonprofit':
          return (
            <Switch>
              <Route path="/home">
                <Home />
              </Route>
            </Switch>
          )
          case 'business':
            return (
              <Switch>
                <Route path="/home">
                  <Home />
                </Route>
              </Switch>
            )
          case 'admin':
            return (
              <AdminDashboard profile={profile} />
            )
          default:
            console.log('Error determining profile type')
    }
  }

  useEffect( ()=>{
    const getUser = async () => {
        try {
          const accessToken = await getAccessTokenSilently({
            audience: 'wewyll-api',
          });
          axios.get(`/api/user/${user.sub}`, {headers: {Authorization: `Bearer ${accessToken}`}})
          .then(({data}) => {
            console.log(data);
            let newProfileTypes = [...profileTypes, 'admin']
            if (data.admin) {setProfileTypes(newProfileTypes)}
            setU(data);
            setAvailableProfiles(newProfileTypes.filter((type)=> data[type]));
          })
        } catch (e) {
          console.log(e);
        }
      };
    console.log("auth0 data",user);
    if (user) getUser();
  }, [user]);
  //JSX
  // if (isAuthenticated){
  return(
    <div className="app" style={{padding: 0, display: 'flex', minHeight: '100vh', flexDirection:'column'}}>
      <Header
        U={U} 
        profileTypes={profileTypes} 
        setProfile={setProfile} 
        availableProfiles={availableProfiles} 
        profile={profile}
      />
      <div style={{flex:1}}>
        {isLoading ? 
          <Loading/> : 
            error ? 
              <Error error={error}/>  : 
                (isAuthenticated) ? 
                  <Router> {getProfileRoutes(profile)}</Router>: <About />}
      </div>

      <Footer/>

    </div>
  );
  // }
  // return (
  //   <div>
  //   </div>
  //   );

  
}


export default App;