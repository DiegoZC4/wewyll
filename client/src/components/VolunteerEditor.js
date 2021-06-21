import React from 'react'
import axios from 'axios';
import {Button} from 'react-bootstrap';
//import {Form, Col, Dropdown} from 'react-bootstrap';
import Select from 'react-select'

// const options = [
//   { value: 'Male', label: 'Male' },
//   { value: 'Female', label: 'Female' },
//   { value: 'Prefer not to say', label: 'Prefer not to say' }
// ]


class VolunteerEditor extends React.Component {
  state = {
    firstname: '',
    firstnameError: '',
    lastname: '',
    lastnameError: '',
    email: '',
    emailError: '',
    age: '',
    volunteertype: '',
    interests: '',
    zipcode: '',
    transportation: '',
    gender: '',
    languages: '',
    previousExperience: '',
    resume: '',
    posts: []
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };


  validate = () => {
    let firstnameError = "";
    let lastnameError = "";
    let emailError = "";

    if(!this.state.firstname) {
      firstnameError = "Required"
    }

    if(!this.state.lastname) {
      lastnameError = "Required"
    }

    if (!this.state.email.includes('@')) {
      emailError = 'Invalid email address';
    }
    if (firstnameError || lastnameError || emailError) {
      this.setState({ firstnameError, lastnameError, emailError });
      return false;
    }


    return true;
  }

  submit = (volunteer) => {
    volunteer.preventDefault();

    const isValid = this.validate();
    if (isValid) {
      const payload = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.email,
        age: this.state.age,
        volunteertype: this.state.volunteertype,
        interests: this.state.interests,
        zipcode: this.state.zipcode,
        transportation: this.state.transportation,
        gender: this.state.gender,
        languages: this.state.languages,
        previousExperience: this.state.previousExperience,
        resume: this.state.resume

      };

      axios({
        url: '/api/saveVolunteer',
        method: 'POST',
        data: payload
      })
        .then(() => {
          console.log('Data has been sent to the server');
          this.resetUserInputs();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  resetUserInputs = () => {
    this.setState({
      firstname: '',
      firstnameError: '',
      lastname: '',
      lastnameError: '',
      email: '',
      emailError: '',
      age: '',
      volunteertype: '',
      interests: '',
      zipcode: '',
      transportation: '',
      gender: '',
      languages: '',
      previousExperience: '',
      resume: ''
    });
  };

  render(){
    return (
        <form onSubmit={this.submit}>
          <h2>Add Volunteer</h2>

          <div className="form-input">
            <textarea
              placeholder="First name"
              name="firstname"
              cols="30"
              rows="1"
              value={this.state.firstname}
              onChange={this.handleChange}
            >
            </textarea>
          </div>

          <div style={{ color: 'red'}} className="form-input">
            {this.state.lastnameError}
          </div>

          <div className="form-input">
            <textarea
              placeholder="Last name"
              name="lastname"
              cols="30"
              rows="1"
              value={this.state.lastname}
              onChange={this.handleChange}
            >
            </textarea>
          </div>

          <div style={{ color: 'red'}} className="form-input">
            {this.state.lastnameError}
          </div>

          <div className="form-input">
            <textarea
              placeholder="Email"
              name="email"
              cols="30"
              rows="1"
              value={this.state.email}
              onChange={this.handleChange}
            >
            </textarea>
          </div>

          <div style={{ color: 'red'}} className="form-input">
            {this.state.emailError}
          </div>

          <div className="form-input">
            <textarea
              placeholder="Age"
              name="age"
              cols="30"
              rows="1"
              value={this.state.age}
              onChange={this.handleChange}
            >
            </textarea>
          </div>

          <div className="form-input">
            <textarea
              placeholder="Volunteer Type"
              name="volunteertype"
              cols="30"
              rows="1"
              value={this.state.volunteertype}
              onChange={this.handleChange}
            >
            </textarea>
          </div>

          <div className="form-input">
            <textarea
              placeholder="Interests"
              name="interests"
              cols="30"
              rows="3"
              value={this.state.interests}
              onChange={this.handleChange}
            >
            </textarea>
          </div>

          <div className="form-input">
            <textarea
              placeholder="Zip code"
              name="zipcode"
              cols="30"
              rows="1"
              value={this.state.zipcode}
              onChange={this.handleChange}
            >
            </textarea>
          </div>

          <div className="form-input">
            <textarea
              placeholder="Method(s) of transportation"
              name="transportation"
              cols="30"
              rows="1"
              value={this.state.transportation}
              onChange={this.handleChange}
            >
            </textarea>
          </div>

          <div className="container p-5">
            <select
              className="custom-select"
              onChange={(e) => {
                const gender = e.target.value;
                this.setState({ gender });
              }}
            >
              <option value="Gender" disabled>Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-input">
            <textarea
              placeholder="Languages"
              name="languages"
              cols="30"
              rows="1"
              value={this.state.languages}
              onChange={this.handleChange}
            >
            </textarea>
          </div>

          <div className="form-input">
            <textarea
              placeholder="Previous experience"
              name="previousExperience"
              cols="30"
              rows="3"
              value={this.state.previousExperience}
              onChange={this.handleChange}
            >
            </textarea>
          </div>

          

          <div className="form-input">
            <textarea
              placeholder="Resume"
              name="resume"
              cols="30"
              rows="5"
              value={this.state.resume}
              onChange={this.handleChange}
            >
            </textarea>
          </div>

          {/* <Select onChange={ (e) => {
            const gender = e.target.value;
            this.setState({ gender });
          }
          }
            options={options}
          /> */}
                  
          <Button variant='primary' type='submit'>Submit</Button>
        </form>
    )
  }
}

export default VolunteerEditor