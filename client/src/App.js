import React, {useEffect, useState} from 'react';
import axios from 'axios';

import Header from './components/Header';
import Home from './components/Home';
import Loading from './components/Loading';
import Error from './components/Error';

import NonprofitPendingApproval from './components/Nonprofit/NonprofitPendingApproval';

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

  const vol = 'nonprofit';

  const [profileTypes, setProfileTypes] = useState(['volunteer', 'nonprofit', 'business']);
  const [profile, setProfile] = useState(vol);
  const [availableProfiles, setAvailableProfiles] = useState([]);
  // console.log(availableProfiles,profileTypes)

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
          return U.nonprofitApproved ? (
            <Switch>
              <Route path="/home">
                <Home />
              </Route>
            </Switch>
          ) : <NonprofitPendingApproval U={U} setU={setU}/>
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
              <AdminDashboard profile={profile} U={U}/>
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
            let newProfileTypes = (data.admin) ? [...profileTypes, 'admin']: profileTypes;
            let newAvailableProfiles = newProfileTypes.filter((type)=> data[type]);
            // console.log(data,newProfileTypes,newAvailableProfiles);
            setU(data);
            setProfileTypes(newProfileTypes);
            setAvailableProfiles(newAvailableProfiles.map((item) => {

              const getProfile = async (route, id) => {

                console.log('getting profile');
                try {
                  console.log('Route', route, "ID", id);
                  const accessToken = await getAccessTokenSilently({
                    audience: 'wewyll-api',
                  });
                  axios.get(`/api/${route}/${id}`, {headers: {Authorization: `Bearer ${accessToken}`}})
                  .then((response) => {
                    console.log('Got profile', response);
                  })
                } catch (e) {
                  console.log(e.message);
                }
              }
              if (item === 'volunteer' || item === 'nonprofit') {
                return getProfile(item, data[item]);
              }
              return item;
            }));

            if (newAvailableProfiles) setProfile(newAvailableProfiles[0]);
          })
        } catch (e) {
          console.log(e);
        }
      };
    console.log("auth0 data",user);
    getUser();
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

      <Footer U={U} availableProfiles={availableProfiles}/>

    </div>
  );
  // }
  // return (
  //   <div>
  //   </div>
  //   );


}


export default App;
