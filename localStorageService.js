// localStorageService.js - Centralized localStorage management for the entire project

class LocalStorageService {
  constructor() {
    this.initializeData();
  }

  // Initialize default data if localStorage is empty
  initializeData() {
    // Initialize orders if not exists
    if (!localStorage.getItem('orders')) {
      localStorage.setItem('orders', JSON.stringify([]));
    }

    // Initialize favorites if not exists
    if (!localStorage.getItem('favorites')) {
      localStorage.setItem('favorites', JSON.stringify([]));
    }

    // Initialize dishes if not exists (this will be the main menu data)
    if (!localStorage.getItem('dishes')) {
      const defaultDishes = [
        { id: 1, name: "Paneer Butter Masala", price: 220, img: "images/paneer-butter-masala.jpg", category: "North Indian" },
        { id: 2, name: "Chole Bhature", price: 150, img: "images/Chole+Bhature.jpg", category: "North Indian" },
        { id: 3, name: "Masala Dosa", price: 120, img: "images/Masala+Dosa.jpg", category: "South Indian" },
        { id: 4, name: "Butter Naan", price: 40, img: "images/Butter+Naan.jpg", category: "North Indian" },
        { id: 5, name: "Dal Makhani", price: 180, img: "images/Dal+Makhani.jpg", category: "North Indian" },
        { id: 6, name: "Veg Biryani", price: 200, img: "images/Veg+Biryani.jpg", category: "Biryani" },
        { id: 7, name: "Egg Biryani", price: 240, img: "images/Egg+Biryani.jpg", category: "Biryani" },
        { id: 8, name: "Chicken Biryani", price: 300, img: "images/Chicken+Biryani.jpg", category: "Biryani" },
        { id: 9, name: "Fish Curry", price: 280, img: "images/Fish+Curry.jpg", category: "Seafood" },
        { id: 10, name: "Prawn Masala", price: 350, img: "images/Prawn+Masala.jpg", category: "Seafood" },
        { id: 11, name: "Samosa", price: 30, img: "images/Samosa.jpg", category: "Snacks" },
        { id: 12, name: "Aloo Tikki", price: 50, img: "images/Aloo+Tikki.jpg", category: "Snacks" },
        { id: 13, name: "Pav Bhaji", price: 100, img: "images/Pav+Bhaji.jpg", category: "Street Food" },
        { id: 14, name: "Vada Pav", price: 40, img: "images/Vada+Pav.jpg", category: "Street Food" },
        { id: 15, name: "Idli Sambhar", price: 80, img: "images/Idli+Sambhar.jpg", category: "South Indian" },
        { id: 16, name: "Medu Vada", price: 70, img: "images/Medu+Vada.jpg", category: "South Indian" },
        { id: 17, name: "Rava Upma", price: 90, img: "images/Rava+Upma.jpg", category: "South Indian" },
        { id: 18, name: "Misal Pav", price: 110, img: "images/Misal+Pav.jpg", category: "Maharashtrian" },
        { id: 19, name: "Pani Puri", price: 60, img: "images/Pani+Puri.jpg", category: "Street Food" },
        { id: 20, name: "Dahi Puri", price: 70, img: "images/Dahi+Puri.jpg", category: "Street Food" },
        { id: 21, name: "Rajma Chawal", price: 150, img: "images/Rajma+Chawal.jpg", category: "North Indian" },
        { id: 22, name: "Baingan Bharta", price: 160, img: "images/Baingan+Bharta.jpg", category: "North Indian" },
        { id: 23, name: "Kadai Paneer", price: 200, img: "images/Kadai+Paneer.jpg", category: "North Indian" },
        { id: 24, name: "Matar Paneer", price: 190, img: "images/Matar+Paneer.jpg", category: "North Indian" },
        { id: 25, name: "Shahi Paneer", price: 210, img: "images/Shahi+Paneer.jpg", category: "North Indian" },
        { id: 26, name: "Gobi Manchurian", price: 170, img: "images/Gobi+Manchurian.jpg", category: "Chinese" },
        { id: 27, name: "Chilli Paneer", price: 180, img: "images/Chilli+Paneer.jpg", category: "Chinese" },
        { id: 28, name: "Hakka Noodles", price: 160, img: "images/Hakka+Noodles.jpg", category: "Chinese" },
        { id: 29, name: "Spring Rolls", price: 140, img: "images/Spring+Rolls.jpg", category: "Chinese" },
        { id: 30, name: "Panipuri", price: 120, img: "image/panipuri.jpg", category: "Chinese" },
        { id: 31, name: "Dal Makhani", price: 100, img: "image/Dal Makhani.jpg", category: "Soups" },
        { id: 32, name: "Mendul Wada", price: 110, img: "image/mendul wada.jpg", category: "Soups" },
        { id: 33, name: "Bread Pakoda", price: 120, img: "image/bread pakora.jpeg", category: "Soups" },
        { id: 34, name: "Franki", price: 130, img: "image/franki.jpg", category: "Chinese" },
        { id: 35, name: "Chana Masala", price: 150, img: "image/Chana Masala.jpg", category: "North Indian" },
        { id: 36, name: "Jalebi Fafada", price: 140, img: "image/Jalebi fafada.jpeg", category: "Gujrati" },
        { id: 37, name: "Cutlet", price: 160, img: "image/cutlet.jpg", category: "North Indian" },
        { id: 38, name: "Naan", price: 180, img: "image/Naan.jpg", category: "Rice" },
        { id: 39, name: "Paratha", price: 200, img: "image/paratha.jpg", category: "Rice" },
        { id: 40, name: "Puff", price: 170, img: "image/Puff.jpeg", category: "Chinese" },
        { id: 41, name: "Kulfi", price: 190, img: "image/Kulfi.jpg", category: "Chinese" },
        { id: 42, name: "Sweet White Jamun", price: 320, img: "image/rasgulla.jpg", category: "Mughlai" },
        { id: 43, name: "Ras Malai", price: 330, img: "image/Rasmalai.jpg", category: "Mughlai" },
        { id: 44, name: "Khaman", price: 300, img: "image/Khaman.jpg", category: "surati" },
        { id: 45, name: "Manchuriyan", price: 300, img: "image/Manchuriyan.jpg", category: "Chinese" },
        { id: 46, name: "Lassi", price: 300, img: "image/Lassi.jpg", category: "Chinese" },
        { id: 47, name: "Gulab Jamun", price: 300, img: "image/Gulab jamun.jpg", category: "Chinese" },
        { id: 48, name: "Barfi", price: 300, img: "image/Barfi.jpg", category: "Chinese" },
        { id: 49, name: "Momos", price: 300, img: "image/momos.jpeg", category: "Chinese" },
        { id: 50, name: "Garlic-Bread", price: 300, img: "image/Garlic.jpg", category: "Chinese" },
        { id: 51, name: "Chaat", price: 300, img: "image/Chaat.jpg", category: "Chinese" },
        { id: 52, name: "Chocalate Ice-Cream", price: 280, img: "image/chocalateice.jpg", category: "Ice-cream" },
        { id: 53, name: "Vanila Ice-Cream", price: 150, img: "image/vanila.jpg", category: "Ice-cream" },
        { id: 54, name: "Stobery Ice-Cream", price: 330, img: "image/stobaryice.jpg", category: "Ice-cream" }
      ];
      localStorage.setItem('dishes', JSON.stringify(defaultDishes));
    }

    // Initialize categories if not exists
    if (!localStorage.getItem('categories')) {
      const categories = [
        "North Indian", "South Indian", "Biryani", "Seafood", "Snacks", 
        "Street Food", "Maharashtrian", "Chinese", "Soups", "Gujrati", 
        "Rice", "Mughlai", "surati", "Ice-cream"
      ];
      localStorage.setItem('categories', JSON.stringify(categories));
    }

    // Initialize settings if not exists
    if (!localStorage.getItem('settings')) {
      const defaultSettings = {
        theme: 'light',
        currency: '₹',
        language: 'en',
        notifications: true,
        autoSave: true
      };
      localStorage.setItem('settings', JSON.stringify(defaultSettings));
    }
  }

  // Order Management Methods
  getAllOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  }

  getOrderById(orderId) {
    const orders = this.getAllOrders();
    return orders.find(order => order.id === orderId);
  }

  addOrder(orderData) {
    const orders = this.getAllOrders();
    const newOrder = {
      id: Date.now(), // Simple ID generation
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending',
      completed: false
    };
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    return newOrder;
  }

  updateOrder(orderId, updates) {
    const orders = this.getAllOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex] = { ...orders[orderIndex], ...updates };
      localStorage.setItem('orders', JSON.stringify(orders));
      return orders[orderIndex];
    }
    return null;
  }

  deleteOrder(orderId) {
    const orders = this.getAllOrders();
    const filteredOrders = orders.filter(order => order.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(filteredOrders));
    return true;
  }

  getOrdersByStatus(status) {
    const orders = this.getAllOrders();
    return orders.filter(order => order.status === status);
  }

  getOrdersByCustomer(customerName) {
    const orders = this.getAllOrders();
    return orders.filter(order => 
      order.customer && order.customer.toLowerCase().includes(customerName.toLowerCase())
    );
  }

  getOrdersByTable(tableNo) {
    const orders = this.getAllOrders();
    return orders.filter(order => order.table === tableNo);
  }

  // Dish Management Methods
  getAllDishes() {
    return JSON.parse(localStorage.getItem('dishes') || '[]');
  }

  getDishById(dishId) {
    const dishes = this.getAllDishes();
    return dishes.find(dish => dish.id === dishId);
  }

  addDish(dishData) {
    const dishes = this.getAllDishes();
    const newDish = {
      id: Date.now(),
      ...dishData,
      createdAt: new Date().toISOString()
    };
    dishes.push(newDish);
    localStorage.setItem('dishes', JSON.stringify(dishes));
    return newDish;
  }

  updateDish(dishId, updates) {
    const dishes = this.getAllDishes();
    const dishIndex = dishes.findIndex(dish => dish.id === dishId);
    if (dishIndex !== -1) {
      dishes[dishIndex] = { ...dishes[dishIndex], ...updates };
      localStorage.setItem('dishes', JSON.stringify(dishes));
      return dishes[dishIndex];
    }
    return null;
  }

  deleteDish(dishId) {
    const dishes = this.getAllDishes();
    const filteredDishes = dishes.filter(dish => dish.id !== dishId);
    localStorage.setItem('dishes', JSON.stringify(filteredDishes));
    return true;
  }

  getDishesByCategory(category) {
    const dishes = this.getAllDishes();
    return dishes.filter(dish => dish.category === category);
  }

  searchDishes(query) {
    const dishes = this.getAllDishes();
    return dishes.filter(dish => 
      dish.name.toLowerCase().includes(query.toLowerCase()) ||
      dish.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Category Management Methods
  getAllCategories() {
    return JSON.parse(localStorage.getItem('categories') || '[]');
  }

  addCategory(categoryName) {
    const categories = this.getAllCategories();
    if (!categories.includes(categoryName)) {
      categories.push(categoryName);
      localStorage.setItem('categories', JSON.stringify(categories));
    }
    return categories;
  }

  deleteCategory(categoryName) {
    const categories = this.getAllCategories();
    const filteredCategories = categories.filter(cat => cat !== categoryName);
    localStorage.setItem('categories', JSON.stringify(filteredCategories));
    return filteredCategories;
  }

  // Favorites Management Methods
  getAllFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  }

  addToFavorites(dishData) {
    const favorites = this.getAllFavorites();
    const existingIndex = favorites.findIndex(fav => fav.id === dishData.id);
    
    if (existingIndex === -1) {
      const favoriteItem = {
        ...dishData,
        dateAdded: new Date().toISOString()
      };
      favorites.push(favoriteItem);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      return favoriteItem;
    }
    return null; // Already exists
  }

  removeFromFavorites(dishId) {
    const favorites = this.getAllFavorites();
    const filteredFavorites = favorites.filter(fav => fav.id !== dishId);
    localStorage.setItem('favorites', JSON.stringify(filteredFavorites));
    return true;
  }

  isFavorite(dishId) {
    const favorites = this.getAllFavorites();
    return favorites.some(fav => fav.id === dishId);
  }

  // Settings Management Methods
  getSettings() {
    return JSON.parse(localStorage.getItem('settings') || '{}');
  }

  updateSettings(newSettings) {
    const currentSettings = this.getSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    localStorage.setItem('settings', JSON.stringify(updatedSettings));
    return updatedSettings;
  }

  // Statistics and Analytics Methods
  getOrderStatistics() {
    const orders = this.getAllOrders();
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.completed || order.status === 'completed').length;
    const pendingOrders = orders.filter(order => !order.completed && order.status !== 'completed').length;
    const totalRevenue = orders.reduce((sum, order) => {
      const orderTotal = order.cart ? order.cart.reduce((cartSum, item) => cartSum + (item.qty * item.price), 0) : 0;
      return sum + orderTotal;
    }, 0);

    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      totalRevenue,
      completionRate: totalOrders > 0 ? (completedOrders / totalOrders * 100).toFixed(2) : 0
    };
  }

  getPopularDishes(limit = 10) {
    const orders = this.getAllOrders();
    const dishCounts = {};

    orders.forEach(order => {
      if (order.cart) {
        order.cart.forEach(item => {
          dishCounts[item.name] = (dishCounts[item.name] || 0) + item.qty;
        });
      }
    });

    return Object.entries(dishCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  getRevenueByDate(days = 7) {
    const orders = this.getAllOrders();
    const revenueByDate = {};
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      revenueByDate[dateStr] = 0;
    }

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt || order.time).toISOString().split('T')[0];
      if (revenueByDate.hasOwnProperty(orderDate)) {
        const orderTotal = order.cart ? order.cart.reduce((sum, item) => sum + (item.qty * item.price), 0) : 0;
        revenueByDate[orderDate] += orderTotal;
      }
    });

    return revenueByDate;
  }

  // Export/Import Methods
  exportData() {
    const data = {
      orders: this.getAllOrders(),
      dishes: this.getAllDishes(),
      categories: this.getAllCategories(),
      favorites: this.getAllFavorites(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString()
    };
    return data;
  }

  importData(data) {
    try {
      if (data.orders) localStorage.setItem('orders', JSON.stringify(data.orders));
      if (data.dishes) localStorage.setItem('dishes', JSON.stringify(data.dishes));
      if (data.categories) localStorage.setItem('categories', JSON.stringify(data.categories));
      if (data.favorites) localStorage.setItem('favorites', JSON.stringify(data.favorites));
      if (data.settings) localStorage.setItem('settings', JSON.stringify(data.settings));
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }

  // Utility Methods
  clearAllData() {
    localStorage.removeItem('orders');
    localStorage.removeItem('dishes');
    localStorage.removeItem('categories');
    localStorage.removeItem('favorites');
    localStorage.removeItem('settings');
    this.initializeData();
  }

  getStorageSize() {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
      }
    }
    return totalSize;
  }

  // Backup and Restore
  createBackup() {
    const backup = {
      data: this.exportData(),
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    return backup;
  }

  restoreBackup(backup) {
    if (backup && backup.data) {
      return this.importData(backup.data);
    }
    return false;
  }
}

// Create global instance
const localStorageService = new LocalStorageService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = localStorageService;
} else {
  window.localStorageService = localStorageService;
}
