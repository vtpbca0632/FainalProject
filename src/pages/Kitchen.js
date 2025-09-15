import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, InputGroup, Form } from 'react-bootstrap';
import { Search, RefreshCw, CheckCircle, Trash2 } from 'react-feather';
import { apiService } from '../services/api';
import './Kitchen.css';

const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [availableTables, setAvailableTables] = useState([]);
  const [filter, setFilter] = useState('all');
  const [tableFilter, setTableFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Load orders from database
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getPendingOrders();
      
      // Transform database data to match our component structure
      const transformedOrders = data.map((order, index) => ({
        ...order,
        index: index,
        status: order.status || 'pending',
        cart: order.cart || []
      }));
      
      setOrders(transformedOrders);
      console.log('Loaded orders from database:', transformedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      // Fallback to localStorage if database fails
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(localOrders);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update available tables when orders change
  const updateAvailableTables = useCallback(() => {
    const tables = [...new Set(orders.map(order => order.table))].sort();
    setAvailableTables(tables);
    console.log('Available tables updated:', tables);
  }, [orders]);

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Update available tables when orders change
  useEffect(() => {
    updateAvailableTables();
  }, [updateAvailableTables]);

  // Memoized filtered orders to prevent unnecessary recalculations
  const filteredOrders = useMemo(() => {
    console.log('=== FILTERING ORDERS ===');
    console.log('Total orders:', orders.length);
    console.log('Current filters:', { filter, tableFilter, searchTerm });
    
    let filtered = [...orders];
    console.log('Starting with orders:', filtered.length);

    // Apply status filter
    switch (filter) {
      case 'pending':
        filtered = filtered.filter(order => !order.status || order.status === 'pending');
        console.log('After status filter (pending):', filtered.length);
        break;
      case 'completed':
        filtered = filtered.filter(order => order.status === 'completed');
        console.log('After status filter (completed):', filtered.length);
        break;
      default:
        console.log('No status filter applied (all)');
        break;
    }

    // Apply table filter
    if (tableFilter !== 'all') {
      console.log('Applying table filter for:', tableFilter);
      const beforeTableFilter = filtered.length;
      filtered = filtered.filter(order => {
        const orderTable = order.table;
        const matches = orderTable === tableFilter;
        console.log(`Order: ${order.customer}, Table: ${orderTable}, Filter: ${tableFilter}, Matches: ${matches}`);
        return matches;
      });
      console.log(`Table filter: ${beforeTableFilter} -> ${filtered.length} orders`);
    } else {
      console.log('No table filter applied (all tables)');
    }

    // Apply search filter
    if (searchTerm.trim()) {
      console.log('Applying search filter for:', searchTerm);
      const beforeSearchFilter = filtered.length;
      filtered = filtered.filter(order => {
        const customerMatch = order.customer?.toLowerCase().includes(searchTerm.toLowerCase());
        const tableMatch = order.table?.toLowerCase().includes(searchTerm.toLowerCase());
        const itemMatch = order.cart?.some(item => 
          item.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matches = customerMatch || tableMatch || itemMatch;
        console.log(`Order: ${order.customer}, Customer: ${customerMatch}, Table: ${tableMatch}, Item: ${itemMatch}, Matches: ${matches}`);
        return matches;
      });
      console.log(`Search filter: ${beforeSearchFilter} -> ${filtered.length} orders`);
    } else {
      console.log('No search filter applied');
    }

    console.log('=== FINAL RESULT ===');
    console.log('Final filtered orders:', filtered.length);
    console.log('Filtered orders:', filtered.map(o => ({ customer: o.customer, table: o.table, status: o.status })));
    return filtered;
  }, [orders, filter, tableFilter, searchTerm]);

  const getOrderStatus = useCallback((order) => {
    if (order.status === 'completed') {
      return <Badge bg="success">Completed</Badge>;
    }
    return <Badge bg="warning">Pending</Badge>;
  }, []);

  const getTimeAgo = useCallback((dateString) => {
    try {
      const now = new Date();
      const orderTime = new Date(dateString);
      const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    } catch (error) {
      return 'Unknown time';
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      loadOrders();
      setLoading(false);
    }, 500);
  }, [loadOrders]);

  const clearFilters = useCallback(() => {
    setFilter('all');
    setTableFilter('all');
    setSearchTerm('');
  }, []);

  const handleTableFilterChange = useCallback((e) => {
    const newTableFilter = e.target.value;
    console.log('=== TABLE FILTER CHANGE ===');
    console.log('Changing table filter from:', tableFilter, 'to:', newTableFilter);
    console.log('Available tables:', availableTables);
    console.log('Current orders:', orders.map(o => ({ customer: o.customer, table: o.table })));
    
    setTableFilter(newTableFilter);
    
    // Test filtering logic
    if (newTableFilter !== 'all') {
      const testFiltered = orders.filter(order => order.table === newTableFilter);
      console.log(`Test: Orders for table ${newTableFilter}:`, testFiltered.length);
      console.log('Test filtered orders:', testFiltered.map(o => ({ customer: o.customer, table: o.table })));
    } else {
      console.log('Test: All tables selected, should show all orders');
    }
  }, [tableFilter, availableTables, orders]);

  const handleStatusFilterChange = useCallback((e) => {
    const newStatusFilter = e.target.value;
    console.log('Status filter changing from', filter, 'to', newStatusFilter);
    setFilter(newStatusFilter);
  }, [filter]);

  const handleSearchChange = useCallback((e) => {
    const newSearchTerm = e.target.value;
    console.log('Search term changing from', searchTerm, 'to', newSearchTerm);
    setSearchTerm(newSearchTerm);
  }, [searchTerm]);

  // Test function to debug filtering
  const testFiltering = useCallback(() => {
    console.log('=== TESTING FILTERING ===');
    console.log('Current state:', {
      orders: orders.length,
      filter,
      tableFilter,
      searchTerm,
      availableTables
    });
    
    // Test table filtering
    if (tableFilter !== 'all') {
      const tableFiltered = orders.filter(order => order.table === tableFilter);
      console.log(`Table filter "${tableFilter}" results:`, tableFiltered.length);
    } else {
      console.log('Table filter "all" - should show all orders');
    }
    
    // Test status filtering
    let statusFiltered = orders;
    switch (filter) {
      case 'pending':
        statusFiltered = orders.filter(order => !order.status || order.status === 'pending');
        break;
      case 'completed':
        statusFiltered = orders.filter(order => order.status === 'completed');
        break;
    }
    console.log(`Status filter "${filter}" results:`, statusFiltered.length);
    
    // Test search filtering
    let searchFiltered = statusFiltered;
    if (searchTerm.trim()) {
      searchFiltered = statusFiltered.filter(order => 
        order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.table?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.cart?.some(item => 
          item.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    console.log(`Search filter "${searchTerm}" results:`, searchFiltered.length);
    
    console.log('Final test result should match filteredOrders:', filteredOrders.length);
  }, [orders, filter, tableFilter, searchTerm, availableTables, filteredOrders]);

  // Mark order as completed
  const markOrderComplete = useCallback(async (orderId) => {
    try {
      await apiService.updateOrderStatus(orderId, 'completed');
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'completed' }
            : order
        )
      );
      
      console.log(`Order ${orderId} marked as completed`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  }, []);

  // Delete order
  const deleteOrder = useCallback(async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await apiService.deleteOrder(orderId);
        
        // Update local state
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        
        console.log(`Order ${orderId} deleted`);
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order. Please try again.');
      }
    }
  }, []);

  const calculateTotal = useCallback((cart) => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, []);

  const formatDate = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  }, []);

  return (
    <Container className="mt-5 pt-5">
      <Row className="mb-4">
        <Col>
          <h1>👨‍🍳 Kitchen Dashboard</h1>
          <p className="text-muted">
            Manage and track all customer orders
          </p>
        </Col>
      </Row>

      {/* Debug Info */}
      <Row className="mb-3">
        <Col>
          <Alert variant="info" className="py-2">
            <div className="d-flex justify-content-between align-items-center">
              <small>
                <strong>Debug Info:</strong> 
                Orders: {orders.length} | 
                Filter: {filter} | 
                Table Filter: {tableFilter} | 
                Search: "{searchTerm}" | 
                Filtered: {filteredOrders.length}
              </small>
              <Button 
                variant="outline-info" 
                size="sm" 
                onClick={testFiltering}
                className="ms-2"
              >
                Test Filtering
              </Button>
            </div>
          </Alert>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow stats-card">
            <Card.Body>
              <h3 className="text-primary">{orders.length}</h3>
              <p className="mb-0">Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow stats-card">
            <Card.Body>
              <h3 className="text-warning">
                {orders.filter(order => !order.status || order.status === 'pending').length}
              </h3>
              <p className="mb-0">Pending Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow stats-card">
            <Card.Body>
              <h3 className="text-success">
                {orders.filter(order => order.status === 'completed').length}
              </h3>
              <p className="mb-0">Completed Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow stats-card">
            <Card.Body>
              <h3 className="text-info">
                ₹{orders.reduce((sum, order) => sum + calculateTotal(order.cart), 0)}
              </h3>
              <p className="mb-0">Total Revenue</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by customer, table, or item..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={tableFilter}
            onChange={handleTableFilterChange}
            className="filter-select"
          >
            <option value="all">All Tables</option>
            {availableTables.map(table => (
              <option key={table} value={table}>Table {table}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filter}
            onChange={handleStatusFilterChange}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              onClick={clearFilters}
              size="sm"
              className="action-btn"
            >
              Clear
            </Button>
            <Button
              variant="outline-primary"
              onClick={handleRefresh}
              disabled={loading}
              size="sm"
              className="action-btn"
            >
              <RefreshCw className={loading ? 'spinning' : ''} />
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filter Summary */}
      {(searchTerm || tableFilter !== 'all' || filter !== 'all') && (
        <Row className="mb-3">
          <Col>
            <Alert variant="info" className="py-2 filter-summary">
              <small>
                <strong>Active Filters:</strong> 
                {searchTerm && ` Search: "${searchTerm}"`}
                {tableFilter !== 'all' && ` Table: ${tableFilter}`}
                {filter !== 'all' && ` Status: ${filter}`}
                <span className="ms-2">({filteredOrders.length} results)</span>
              </small>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <Row>
          <Col md={8}>
            <div className="orders-list">
              {filteredOrders.map((order, index) => (
                <Card key={order.index || index} className="mb-3 order-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-1">
                          <strong>{order.customer || 'Unknown Customer'}</strong>
                        </h6>
                        <p className="text-muted mb-1">
                          Table {order.table} • {getTimeAgo(order.orderTime)}
                        </p>
                        <div className="mb-2">
                          {getOrderStatus(order)}
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        {order.status !== 'completed' && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => markOrderComplete(order.id)}
                            className="action-btn"
                          >
                            <CheckCircle size={16} />
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteOrder(order.id)}
                          className="action-btn"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="order-items">
                      {order.cart && order.cart.length > 0 ? (
                        order.cart.map((item, itemIndex) => (
                          <div key={itemIndex} className="order-item">
                            <span className="item-name">{item.name || 'Unknown Item'}</span>
                            <span className="item-quantity">x{item.quantity}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">No items found</p>
                      )}
                    </div>
                    
                    <div className="order-total mt-2">
                      <strong>Total: ₹{calculateTotal(order.cart)}</strong>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>
          
          <Col md={4}>
            <Card className="order-details-card">
              <Card.Header>
                <h6 className="mb-0">Order Details</h6>
              </Card.Header>
              <Card.Body>
                {selectedOrder ? (
                  <div>
                    <p><strong>Customer:</strong> {selectedOrder.customer}</p>
                    <p><strong>Table:</strong> {selectedOrder.table}</p>
                    <p><strong>Time:</strong> {formatDate(selectedOrder.orderTime)}</p>
                    <p><strong>Status:</strong> {getOrderStatus(selectedOrder)}</p>
                    
                    <h6 className="mt-3">Items:</h6>
                    <div className="order-items-table">
                      {selectedOrder.cart && selectedOrder.cart.map((item, index) => (
                        <div key={index} className="order-item-row">
                          <span>{item.name}</span>
                          <span>x{item.quantity}</span>
                          <span>₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="order-total-row">
                      <strong>Total: ₹{calculateTotal(selectedOrder.cart)}</strong>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted">Select an order to view details</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <div className="empty-state text-center py-5">
              <div className="empty-icon mb-3">🍽️</div>
              <h4>No orders found</h4>
              <p className="text-muted">
                {loading ? 'Loading orders...' : 'No orders match your current filters'}
              </p>
              {!loading && (
                <Button onClick={clearFilters} variant="outline-primary">
                  Clear Filters
                </Button>
              )}
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Kitchen;
