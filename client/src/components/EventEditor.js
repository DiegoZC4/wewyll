import React from 'react'
import axios from 'axios';
import {Button} from 'react-bootstrap';

class EventEditor extends React.Component {
  state = {
    title: '',
    body: '',
    posts: []
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };


  submit = (event) => {
    event.preventDefault();

    const payload = {
      title: this.state.title,
      body: this.state.body
    };

    axios({
      url: '/api/save',
      method: 'POST',
      data: payload
    })
      .then(() => {
        console.log('Data has been sent to the server');
        this.resetUserInputs();
        //this.getEvent();
      })
      .catch((err) => {
        console.log(err);
      });;
  };

  resetUserInputs = () => {
    this.setState({
      title: '',
      body: ''
    });
  };

  render(){
    return (
        <form onSubmit={this.submit}>
          <h2>Add Event</h2>
          <div className="form-input">
            <input 
              type="text"
              name="title"
              placeholder="Title"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-input">
            <textarea
              placeholder="body"
              name="body"
              cols="30"
              rows="10"
              value={this.state.body}
              onChange={this.handleChange}
            >
              
            </textarea>
          </div>
          <Button variant='primary' type='submit'>Submit</Button>
        </form>
    )
  }
}

export default EventEditor
