import React, { useState, useEffect } from 'react';
import MenuItem from '../components/MenuItem';
import { apiService } from '../services/api';
import './Home.css';

const Home = ({ addToCart, addToFavorites, favorites, cart }) => {
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dishes from database
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDishes();
        
        // Transform database data to match our component structure
        const transformedDishes = data.map(dish => ({
          id: dish.id,
          name: dish.name,
          price: parseFloat(dish.price),
          image: dish.img_url || '/image/default-dish.jpg',
          category: dish.category_id || 'other',
          description: dish.description || 'Delicious dish'
        }));
        
        setDishes(transformedDishes);
        setFilteredDishes(transformedDishes);
        setError(null);
      } catch (err) {
        console.error('Error fetching dishes:', err);
        setError('Failed to load dishes. Please try again.');
        // Fallback to sample data if database fails
        const fallbackDishes = [
          {
            id: 1,
            name: 'Butter Chicken',
            price: 250,
            image: '/image/Butter Chicken.jpg',
            category: 'main',
            description: 'Creamy and rich butter chicken'
          },
          {
            id: 2,
            name: 'Biryani',
            price: 300,
            image: '/image/Biriyani.jpg',
            category: 'main',
            description: 'Aromatic rice dish with spices'
          },
          {
            id: 3,
            name: 'Naan',
            price: 30,
            image: '/image/Naan.jpg',
            category: 'bread',
            description: 'Soft and fluffy bread'
          }
        ];
        setDishes(fallbackDishes);
        setFilteredDishes(fallbackDishes);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  // Filter dishes based on search and category
  useEffect(() => {
    let filtered = dishes;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dish => dish.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(dish =>
        dish.name.toLowerCase().includes(searchLower) ||
        dish.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredDishes(filtered);
  }, [dishes, searchTerm, selectedCategory]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'main', label: 'Main Course' },
    { value: 'bread', label: 'Bread' },
    { value: 'dessert', label: 'Desserts' },
    { value: 'drink', label: 'Drinks' },
    { value: 'other', label: 'Others' }
  ];

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading delicious dishes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error-container">
          <div className="alert alert-warning" role="alert">
            <h4>⚠️ {error}</h4>
            <p>Using sample data for now. Please check your database connection.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search for delicious dishes..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <i className="search-icon">🔍</i>
          </div>
        </div>

        <div className="filter-container">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-filter"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          {(searchTerm || selectedCategory !== 'all') && (
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Showing {filteredDishes.length} of {dishes.length} dishes
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== 'all' && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
        </p>
      </div>

      {/* Dishes Grid */}
      {filteredDishes.length > 0 ? (
        <div className="dishes-grid">
          {filteredDishes.map(dish => (
            <MenuItem
              key={dish.id}
              dish={dish}
              addToCart={addToCart}
              addToFavorites={addToFavorites}
              isFavorite={favorites.some(fav => fav.id === dish.id)}
              cartQuantity={cart.find(item => item.id === dish.id)?.quantity || 0}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No dishes found</h3>
          <p>
            {searchTerm 
              ? `No dishes match "${searchTerm}"`
              : 'No dishes available in this category'
            }
          </p>
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
