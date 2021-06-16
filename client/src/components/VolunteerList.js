import React, { Component } from 'react'
import axios from 'axios';
import {Button} from 'react-bootstrap';

class VolunteerList extends Component {
    state = {
        posts: []
    }
    
  componentDidMount = () => {
    this.getVolunteer();
  };

  getVolunteer = () => {
    axios.get('/api/getVolunteer')
      .then((response) => {
        const data = response.data;
        this.setState({ posts: data });
        console.log('Data has been received!!');
      })
      .catch((err) => {
        alert('Error retrieving data!!!');
        console.log(err);
      });
  }
  displayVolunteer = (posts) => {

    if (!posts.length) return null;
    console.log(posts);

    return posts.map((post, index) => (
      <form onSubmit={this.deleteVolunteer} key={index} id={post._id}>
        <div className="blog-post__display">
          <p>{post.firstname}</p>
          <p>{post.lastname}</p>
          <p>{post.email}</p>
          <p>{post.age}</p>
          <p>{post.volunteertype}</p>
          <p>{post.interests}</p>
          <p>{post.zipcode}</p>
          <p>{post.transportation}</p>
          <p>{post.gender}</p>
          <p>{post.languages}</p>
          <p>{post.previousExperience}</p>
          <p>{post.resume}</p>
          <Button type='submit' variant='danger'>Delete</Button>
        </div>
      </form>
    ));
  };

  
  deleteVolunteer = (volunteer) => {
    console.log(volunteer.target.id);
    volunteer.preventDefault();
    axios({
      url: '/api/deleteVolunteer',
      method: 'POST',
      data: {id: volunteer.target.id}
    })
      .then(() => {
        console.log('Volunteer has been deleted');
        this.getVolunteer();
      })
      .catch((err) => {
        console.log('Error',err);
      });;
  };

    render() {
        return (
            <div className="blog-">
                <h2>Volunteers</h2>
                <Button variant='success' onClick={this.getVolunteer}>Refresh</Button>
                {this.displayVolunteer(this.state.posts)}
            </div>
        )
    }
}

export default VolunteerList