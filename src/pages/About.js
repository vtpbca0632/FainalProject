import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './About.css';

const About = () => {
  return (
    <Container className="mt-5 pt-5">
      <Row>
        <Col>
          <h1 className="text-center mb-5">🍽️ About Food King</h1>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col md={6}>
          <Card className="h-100 shadow">
            <Card.Body>
              <h3>Our Story</h3>
              <p>
                Food King is a premium restaurant that brings you the authentic flavors 
                of Indian cuisine. We started our journey in 2020 with a simple mission: 
                to serve delicious, high-quality food that brings people together.
              </p>
              <p>
                Our chefs are experts in traditional Indian cooking methods, using 
                fresh ingredients and authentic spices to create memorable dining experiences.
              </p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="h-100 shadow">
            <Card.Body>
              <h3>Our Mission</h3>
              <p>
                We are committed to providing exceptional dining experiences through:
              </p>
              <ul>
                <li>Fresh, locally sourced ingredients</li>
                <li>Traditional cooking techniques</li>
                <li>Warm, welcoming atmosphere</li>
                <li>Excellent customer service</li>
                <li>Innovative digital ordering system</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col>
          <Card className="shadow">
            <Card.Body>
              <h3 className="text-center mb-4">Why Choose Food King?</h3>
              <Row>
                <Col md={3} className="text-center mb-3">
                  <div className="feature-icon">🍅</div>
                  <h5>Fresh Ingredients</h5>
                  <p>We use only the freshest ingredients sourced from local markets.</p>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="feature-icon">👨‍🍳</div>
                  <h5>Expert Chefs</h5>
                  <p>Our chefs have years of experience in authentic Indian cuisine.</p>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="feature-icon">📱</div>
                  <h5>Digital Menu</h5>
                  <p>Modern QR-based ordering system for convenience.</p>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="feature-icon">🌟</div>
                  <h5>Quality Service</h5>
                  <p>Dedicated to providing the best dining experience.</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Body>
              <h3 className="text-center mb-4">Visit Us</h3>
              <Row>
                <Col md={6}>
                  <h5>📍 Location</h5>
                  <p>123 Food Street, Cuisine Lane<br />
                  Food City, FC 12345</p>
                  
                  <h5>📞 Contact</h5>
                  <p>Phone: +91 98765 43210<br />
                  Email: info@foodking.com</p>
                </Col>
                <Col md={6}>
                  <h5>🕒 Hours</h5>
                  <p>Monday - Friday: 11:00 AM - 11:00 PM<br />
                  Saturday - Sunday: 10:00 AM - 12:00 AM</p>
                  
                  <h5>🚗 Delivery</h5>
                  <p>Free delivery within 5km<br />
                  Fast delivery in 30 minutes</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
