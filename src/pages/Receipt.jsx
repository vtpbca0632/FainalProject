import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { 
  Printer, 
  Download, 
  Share2, 
  ArrowLeft, 
  Clock, 
  User, 
  Hash, 
  Phone,
  MapPin,
  Star
} from 'react-bootstrap-icons';
import './Receipt.css';

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [receiptData, setReceiptData] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    // Get receipt data from URL parameters or localStorage
    const urlParams = new URLSearchParams(location.search);
    const dataParam = urlParams.get('data');
    
    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        setReceiptData(parsedData);
      } catch (error) {
        console.error('Error parsing receipt data:', error);
      }
    }
    
    // Fallback to latest order from localStorage
    if (!receiptData) {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      if (orders.length > 0) {
        const latestOrder = orders[orders.length - 1];
        setReceiptData({
          orderId: `ORD-${Date.now()}`,
          customerName: latestOrder.customer || 'Guest',
          tableNo: latestOrder.table || 'N/A',
          items: latestOrder.cart || [],
          orderTime: latestOrder.time || new Date().toLocaleString(),
          total: latestOrder.cart?.reduce((sum, item) => sum + (item.qty * item.price), 0) || 0
        });
      }
    }
  }, [location.search, receiptData]);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const handleDownload = () => {
    // Create a downloadable version of the receipt
    const receiptContent = document.getElementById('receipt-content').innerHTML;
    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receiptData?.orderId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Restaurant Receipt',
        text: `Order ${receiptData?.orderId} - Total: ₹${receiptData?.total}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`Order ${receiptData?.orderId} - Total: ₹${receiptData?.total}`);
      alert('Receipt details copied to clipboard!');
    }
  };

  if (!receiptData) {
    return (
      <Container className="receipt-container">
        <div className="text-center py-5">
          <h3>No receipt data available</h3>
          <Button variant="primary" onClick={() => navigate('/')}>
            <ArrowLeft className="me-2" />
            Back to Menu
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="receipt-container" fluid>
      <Row className="justify-content-center">
        <Col lg={8} md={10} sm={12}>
          {/* Receipt Header */}
          <div className="receipt-header text-center mb-4">
            <Button 
              variant="outline-secondary" 
              className="back-btn"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="me-2" />
              Back to Menu
            </Button>
            <h1 className="restaurant-name">🍽️ Spice Garden</h1>
            <p className="restaurant-tagline">Authentic Indian Cuisine</p>
          </div>

          {/* Receipt Card */}
          <Card className="receipt-card" id="receipt-content">
            {/* Receipt Header */}
            <div className="receipt-card-header">
              <div className="receipt-logo">
                <div className="logo-circle">
                  <Star className="logo-icon" />
                </div>
              </div>
              <div className="receipt-title">
                <h2>Order Receipt</h2>
                <p className="receipt-subtitle">Thank you for dining with us!</p>
              </div>
              <div className="receipt-qr">
                <div className="qr-placeholder">
                  <span>QR</span>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="receipt-details">
              <Row className="g-3 mb-4">
                <Col md={6}>
                  <div className="detail-item">
                    <User className="detail-icon" />
                    <div>
                      <label>Customer</label>
                      <span>{receiptData.customerName}</span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <Hash className="detail-icon" />
                    <div>
                      <label>Table No.</label>
                      <span>{receiptData.tableNo}</span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <Clock className="detail-icon" />
                    <div>
                      <label>Order Time</label>
                      <span>{receiptData.orderTime}</span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <Hash className="detail-icon" />
                    <div>
                      <label>Order ID</label>
                      <span>{receiptData.orderId}</span>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Items List */}
              <div className="items-section">
                <h5 className="section-title">Order Items</h5>
                <div className="items-list">
                  {receiptData.items.map((item, index) => (
                    <div key={index} className="item-row">
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">×{item.qty}</span>
                      </div>
                      <span className="item-price">₹{(item.qty * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Section */}
              <div className="total-section">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>₹{receiptData.total.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>GST (5%):</span>
                  <span>₹{(receiptData.total * 0.05).toFixed(2)}</span>
                </div>
                <div className="total-row total-final">
                  <span>Total Amount:</span>
                  <span>₹{(receiptData.total * 1.05).toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Status */}
              <div className="payment-status">
                <Badge bg="success" className="status-badge">
                  Payment Completed
                </Badge>
                <p className="payment-note">Payment received via Digital Menu System</p>
              </div>

              {/* Restaurant Info */}
              <div className="restaurant-info">
                <div className="info-row">
                  <MapPin className="info-icon" />
                  <span>123 Spice Street, Food City, FC 12345</span>
                </div>
                <div className="info-row">
                  <Phone className="info-icon" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="info-row">
                  <Clock className="info-icon" />
                  <span>Open: 11:00 AM - 11:00 PM</span>
                </div>
              </div>

              {/* Footer */}
              <div className="receipt-footer">
                <p className="footer-text">
                  Thank you for choosing Spice Garden! 
                  <br />
                  We hope you enjoyed your meal. Please visit us again!
                </p>
                <div className="footer-badges">
                  <Badge bg="primary" className="footer-badge">100% Vegetarian</Badge>
                  <Badge bg="success" className="footer-badge">Fresh Ingredients</Badge>
                  <Badge bg="warning" className="footer-badge">Hygienic Kitchen</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="receipt-actions">
            <Row className="g-3">
              <Col md={4}>
                <Button 
                  variant="primary" 
                  className="action-btn print-btn"
                  onClick={handlePrint}
                  disabled={isPrinting}
                >
                  <Printer className="me-2" />
                  {isPrinting ? 'Printing...' : 'Print Receipt'}
                </Button>
              </Col>
              <Col md={4}>
                <Button 
                  variant="outline-primary" 
                  className="action-btn"
                  onClick={handleDownload}
                >
                  <Download className="me-2" />
                  Download
                </Button>
              </Col>
              <Col md={4}>
                <Button 
                  variant="outline-success" 
                  className="action-btn"
                  onClick={handleShare}
                >
                  <Share2 className="me-2" />
                  Share
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Receipt;
