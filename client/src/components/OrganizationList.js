import React, { Component } from 'react'
import axios from 'axios';
import {Button} from 'react-bootstrap';

class OrganizationList extends Component {
    state = {
        posts: []
    }
    
  componentDidMount = () => {
    this.getOrganization();
  };

  getOrganization = () => {
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
  displayOrganization = (posts) => {

    if (!posts.length) return null;
    console.log(posts);

    return posts.map((post, index) => (
      <form onSubmit={this.deleteOrganization} key={index} id={post._id}>
        <div className="blog-post__display">
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <Button type='submit' variant='danger'>Delete</Button>
        </div>
      </form>
    ));
  };

  
  deleteOrganization = (organization) => {
    console.log(organization.target.id);
    organization.preventDefault();
    axios({
      url: '/api/delete',
      method: 'POST',
      data: {id: organization.target.id}
    })
      .then(() => {
        console.log('Organization has been deleted');
        this.getOrganization();
      })
      .catch((err) => {
        console.log('Error',err);
      });;
  };

    render() {
        return (
            <div className="blog-">
                <h2>Organizations</h2>
                <Button variant='success' onClick={this.getOrganization}>Refresh</Button>
                {this.displayOrganization(this.state.posts)}
            </div>
        )
    }
}

export default OrganizationList