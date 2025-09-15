import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Button, Form, InputGroup } from 'react-bootstrap';
import './Navbar.css';

const Navbar = ({
  darkMode,
  setDarkMode,
  cartCount,
  favoritesCount,
  customerName,
  setCustomerName,
  tableNo,
  setTableNo,
  cart,
  cartTotal,
  placeOrder,
  printReceipt,
  removeFromCart,
  updateCartItemQuantity
}) => {
  const [showCart, setShowCart] = useState(false);

  const handleClose = () => setShowCart(false);
  const handleShow = () => setShowCart(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light custom-navbar fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">🍽️ Food King</Link>
          
          <div className="d-flex align-items-center ms-auto">
            <Link className="btn btn-outline-primary me-2" to="/">🏠 Home</Link>
            
            <Button 
              className="btn-outline-primary position-relative me-2" 
              onClick={handleShow}
            >
              🛒 Order <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">{cartCount}</span>
            </Button>
            
            <Button 
              className="btn-outline-danger position-relative me-3"
              onClick={() => alert('Favorites:\n' + cart.map(f => f.name).join('\n'))}
            >
              ♥ Favorites <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">{favoritesCount}</span>
            </Button>
            
            <Button 
              className="toggle-mode badge bg-secondary me-2"
              onClick={toggleDarkMode}
            >
              {darkMode ? '☀️' : '🌙'}
            </Button>
            
            <Button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#mainNav"
            >
              <span className="navbar-toggler-icon"></span>
            </Button>
          </div>
          
          <div className="collapse navbar-collapse justify-content-end" id="mainNav">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/history">History</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Customer & Table Inputs Below Navbar */}
      <div className="container mt-3 pt-5">
        <div className="row">
          <div className="col-md-6">
            <InputGroup size="sm">
              <InputGroup.Text>👤</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </InputGroup>
          </div>
          <div className="col-md-6">
            <InputGroup size="sm">
              <InputGroup.Text>🪑</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Table No."
                value={tableNo}
                onChange={(e) => setTableNo(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>
      </div>

      {/* Cart Offcanvas */}
      <Offcanvas show={showCart} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>🍽️ Digital Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column">
          <h6>🛒 Your Order</h6>
          
          <div className="cart-items mb-3">
            {cart.length === 0 ? (
              <p className="text-muted">Your cart is empty</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="cart-item d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                  <div className="flex-grow-1">
                    <div className="fw-bold">{item.name}</div>
                    <div className="text-muted">₹{item.price} x {item.qty}</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => updateCartItemQuantity(item.name, item.qty - 1)}
                    >
                      -
                    </Button>
                    <span className="mx-2">{item.qty}</span>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => updateCartItemQuantity(item.name, item.qty + 1)}
                    >
                      +
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      className="ms-2"
                      onClick={() => removeFromCart(item.name)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-auto">
            <div className="d-flex justify-content-between mb-2">
              <strong>Total:</strong> 
              <span>₹{cartTotal}</span>
            </div>
            <Button 
              className="btn-success w-100 mb-2" 
              onClick={placeOrder}
              disabled={cart.length === 0}
            >
              Place Order
            </Button>
            <Button 
              className="btn-outline-secondary w-100" 
              onClick={printReceipt}
              disabled={cart.length === 0}
            >
              Print Receipt
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Navbar;
