import React, { Component } from 'react';
import Carousel from 'react-bootstrap/Carousel'
import './Carou.css';
import groupstudy from '../imgs/group-study.jpg'
import groupstudy2 from '../imgs/groupstudy.jpg'
import groupstudy3 from '../imgs/groupstudy3.jpg'
class Carou extends Component {
  
  render() {
    console.log(groupstudy);
    return (
      
      <div className="App">
        <Carousel className = "card">>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={groupstudy}
              
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={groupstudy2}
              alt="Second slide" 
            />

            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={groupstudy3}
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    );
  }
}

export default Carou;