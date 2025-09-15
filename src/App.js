import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import History from './pages/History';
import Kitchen from './pages/Kitchen';
import Receipt from './pages/Receipt';
import { apiService } from './services/api';
import './App.css';

function AppContent() {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    table: ''
  });
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedFavorites = localStorage.getItem('favorites');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedCustomerInfo = localStorage.getItem('customerInfo');
    const savedOrders = localStorage.getItem('orders');

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    if (savedCustomerInfo) setCustomerInfo(JSON.parse(savedCustomerInfo));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
  }, [customerInfo]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const addToCart = (dish) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === dish.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...dish, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (dishId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== dishId));
  };

  const updateCartItemQuantity = (dishId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(dishId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === dishId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToFavorites = (dish) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorite = prevFavorites.some(fav => fav.id === dish.id);
      if (isAlreadyFavorite) {
        return prevFavorites.filter(fav => fav.id !== dish.id);
      } else {
        return [...prevFavorites, dish];
      }
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const setTableNo = (tableNo) => {
    setCustomerInfo(prev => ({ ...prev, table: tableNo }));
  };

  const setCustomerName = (name) => {
    setCustomerInfo(prev => ({ ...prev, name }));
  };

  // Place order to database
  const placeOrder = async () => {
    if (!customerInfo.name || !customerInfo.table) {
      alert('Please enter customer name and table number');
      return;
    }

    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    try {
      // Prepare order data for database
      const orderData = {
        customer: {
          name: customerInfo.name,
          table_no: customerInfo.table
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };

      // Send order to database
      const response = await apiService.placeOrder(orderData);
      
      if (response.success) {
        // Create order object for local storage
        const newOrder = {
          id: response.order_id,
          customer: customerInfo.name,
          table: customerInfo.table,
          time: new Date().toISOString(),
          cart: [...cart],
          total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };

        // Add to local orders
        setOrders(prev => [newOrder, ...prev]);
        
        // Clear cart
        clearCart();
        
        // Navigate to receipt
        navigate('/receipt', { 
          state: { 
            receiptData: newOrder 
          } 
        });
        
        console.log('Order placed successfully:', response);
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
      
      // Fallback: save to localStorage only
      const newOrder = {
        id: Date.now(),
        customer: customerInfo.name,
        table: customerInfo.table,
        time: new Date().toISOString(),
        cart: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };

      setOrders(prev => [newOrder, ...prev]);
      clearCart();
      navigate('/receipt', { 
        state: { 
          receiptData: newOrder 
        } 
      });
    }
  };

  const printReceipt = (orderData) => {
    navigate('/receipt', { 
      state: { 
        receiptData: orderData 
      } 
    });
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar
        cart={cart}
        favorites={favorites}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        customerInfo={customerInfo}
        setCustomerName={setCustomerName}
        setTableNo={setTableNo}
        removeFromCart={removeFromCart}
        updateCartItemQuantity={updateCartItemQuantity}
        clearCart={clearCart}
        placeOrder={placeOrder}
      />
      
      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <Home
                addToCart={addToCart}
                addToFavorites={addToFavorites}
                favorites={favorites}
                cart={cart}
              />
            } 
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/history" 
            element={
              <History 
                orders={orders}
                printReceipt={printReceipt}
              />
            } 
          />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route 
            path="/receipt" 
            element={
              <Receipt 
                orders={orders}
                printReceipt={printReceipt}
              />
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
