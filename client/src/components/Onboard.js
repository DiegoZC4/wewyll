import React from 'react'
import {Button, Container, Row, Col} from 'react-bootstrap';
import NewVolunteer from './Volunteer/NewVolunteer';
import NewNonprofit from './Nonprofit/NewNonprofit';
import NewBusiness from './Business/NewBusiness';
// import Volunteer from '../../../models/volunteer';

const Onboard = ({onboardType, setOnboardType, onboardOptions}) => {
    const onboardBtnStyle = {
        height: 40,
        width: 220,
        borderRadius: 20,
        borderWidth: 0,
        margin: 20,
    }
    const btn = (text) => {
        return (<Button style={onboardBtnStyle} className='blue' key={text} onClick={()=>setOnboardType(text)}>{`sign-in as a ${text}`}</Button>)
    }
    const chooseForm = (type) => {
        switch (type){
            case 'volunteer': return <NewVolunteer/>
            case 'nonprofit': return <NewNonprofit/>
            case 'business':  return <NewBusiness/>
            default: console.log('Error choosing onboarding form')
        }
    }
    return (
        <Container>
            <br/>
            <Row className="justify-content-md-center">
                {chooseForm(onboardType)}
            </Row>
            <Row className="justify-content-md-center">
                {onboardOptions.map((option)=>onboardType!==option && btn(option))}
            </Row>
        </Container>
    )
}

export default Onboard
