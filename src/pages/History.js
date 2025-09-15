import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table } from 'react-bootstrap';
import './History.css';

const History = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = (cart) => {
    return cart.reduce((sum, item) => sum + (item.qty * item.price), 0);
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all order history? This action cannot be undone.')) {
      localStorage.removeItem('orders');
      setOrders([]);
      setSelectedOrder(null);
    }
  };

  const deleteOrder = (orderIndex) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const updatedOrders = orders.filter((_, index) => index !== orderIndex);
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      if (selectedOrder && selectedOrder.index === orderIndex) {
        setSelectedOrder(null);
      }
    }
  };

  if (orders.length === 0) {
    return (
      <Container className="mt-5 pt-5">
        <Row>
          <Col className="text-center">
            <div className="empty-history">
              <h2>📋 No Order History</h2>
              <p className="text-muted">
                You haven't placed any orders yet. Start ordering delicious food 
                from our menu to see your order history here!
              </p>
              <Button variant="primary" href="/">
                🍽️ Browse Menu
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-5">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>📋 Order History</h1>
            <Button variant="outline-danger" onClick={clearHistory}>
              🗑️ Clear History
            </Button>
          </div>
          <p className="text-muted">
            You have placed {orders.length} order{orders.length !== 1 ? 's' : ''} so far
          </p>
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          <Card className="shadow">
            <Card.Header>
              <h5 className="mb-0">📋 Recent Orders</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="order-list">
                {orders.map((order, index) => (
                  <div
                    key={index}
                    className={`order-item ${selectedOrder?.index === index ? 'active' : ''}`}
                    onClick={() => setSelectedOrder({ ...order, index })}
                  >
                    <div className="order-header">
                      <div className="order-info">
                        <h6 className="mb-1">{order.customer}</h6>
                        <small className="text-muted">
                          Table {order.table} • {formatDate(order.time)}
                        </small>
                      </div>
                      <div className="order-actions">
                        <Badge bg="primary">
                          ₹{calculateTotal(order.cart)}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteOrder(index);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                    <div className="order-summary">
                      <small>
                        {order.cart.length} item{order.cart.length !== 1 ? 's' : ''} • 
                        {order.cart.reduce((sum, item) => sum + item.qty, 0)} total quantity
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          {selectedOrder ? (
            <Card className="shadow">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Order Details</h5>
                  <Badge bg="success">Completed</Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    <h6>👤 Customer Information</h6>
                    <p><strong>Name:</strong> {selectedOrder.customer}</p>
                    <p><strong>Table:</strong> {selectedOrder.table}</p>
                    <p><strong>Order Time:</strong> {formatDate(selectedOrder.time)}</p>
                  </Col>
                  <Col md={6}>
                    <h6>📊 Order Summary</h6>
                    <p><strong>Total Items:</strong> {selectedOrder.cart.length}</p>
                    <p><strong>Total Quantity:</strong> {selectedOrder.cart.reduce((sum, item) => sum + item.qty, 0)}</p>
                    <p><strong>Total Amount:</strong> ₹{calculateTotal(selectedOrder.cart)}</p>
                  </Col>
                </Row>

                <h6>🍽️ Order Items</h6>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.cart.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={item.img} 
                              alt={item.name} 
                              className="order-item-image me-2"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40x40?text=Food';
                              }}
                            />
                            {item.name}
                          </div>
                        </td>
                        <td>{item.category}</td>
                        <td>₹{item.price}</td>
                        <td>{item.qty}</td>
                        <td>₹{item.price * item.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="text-end">
                  <h5>Total: ₹{calculateTotal(selectedOrder.cart)}</h5>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow">
              <Card.Body className="text-center py-5">
                <h4>📋 Select an Order</h4>
                <p className="text-muted">
                  Click on any order from the list to view its details
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default History;
