import React, { Component } from 'react'
import axios from 'axios';
import {Button} from 'react-bootstrap';

class EventList extends Component {
    state = {
        posts: []
    }
    
  componentDidMount = () => {
    this.getEvent();
  };

  getEvent = () => {
    axios.get('/api')
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
  displayEvent = (posts) => {

    if (!posts.length) return null;
    console.log(posts);

    return posts.map((post, index) => (
      <form onSubmit={this.deleteEvent} key={index} id={post._id}>
        <div className="blog-post__display">
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <Button type='submit' variant='danger'>Delete</Button>
        </div>
      </form>
    ));
  };

  
  deleteEvent = (event) => {
    console.log(event.target.id);
    event.preventDefault();
    axios({
      url: '/api/delete',
      method: 'POST',
      data: {id: event.target.id}
    })
      .then(() => {
        console.log('Event has been deleted');
        this.getEvent();
      })
      .catch((err) => {
        console.log('Error',err);
      });;
  };

    render() {
        return (
            <div className="blog-">
                <h2>Events</h2>
                <Button variant='success' onClick={this.getEvent}>Refresh</Button>
                {this.displayEvent(this.state.posts)}
            </div>
        )
    }
}

export default EventList