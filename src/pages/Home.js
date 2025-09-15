import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Card, Badge } from 'react-bootstrap';
import MenuItem from '../components/MenuItem';
import './Home.css';

const Home = ({ addToCart, addToFavorites, favorites, removeFromFavorites }) => {
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample dishes data (you can replace this with API call)
  const sampleDishes = [
    { name: "Paneer Butter Masala", price: 220, img: "images/paneer-butter-masala.jpg", category: "North Indian" },
    { name: "Chole Bhature", price: 150, img: "images/Chole+Bhature.jpg", category: "North Indian" },
    { name: "Masala Dosa", price: 120, img: "images/Masala+Dosa.jpg", category: "South Indian" },
    { name: "Butter Naan", price: 40, img: "images/Butter+Naan.jpg", category: "North Indian" },
    { name: "Dal Makhani", price: 180, img: "images/Dal+Makhani.jpg", category: "North Indian" },
    { name: "Veg Biryani", price: 200, img: "images/Veg+Biryani.jpg", category: "Biryani" },
    { name: "Egg Biryani", price: 240, img: "images/Egg+Biryani.jpg", category: "Biryani" },
    { name: "Chicken Biryani", price: 300, img: "images/Chicken+Biryani.jpg", category: "Biryani" },
    { name: "Fish Curry", price: 280, img: "images/Fish+Curry.jpg", category: "Seafood" },
    { name: "Prawn Masala", price: 350, img: "images/Prawn+Masala.jpg", category: "Seafood" },
    { name: "Samosa", price: 30, img: "images/Samosa.jpg", category: "Snacks" },
    { name: "Aloo Tikki", price: 50, img: "images/Aloo+Tikki.jpg", category: "Snacks" },
    { name: "Pav Bhaji", price: 100, img: "images/Pav+Bhaji.jpg", category: "Street Food" },
    { name: "Vada Pav", price: 40, img: "images/Vada+Pav.jpg", category: "Street Food" },
    { name: "Idli Sambhar", price: 80, img: "images/Idli+Sambhar.jpg", category: "South Indian" },
    { name: "Medu Vada", price: 70, img: "images/Medu+Vada.jpg", category: "South Indian" },
    { name: "Rava Upma", price: 90, img: "images/Rava+Upma.jpg", category: "South Indian" },
    { name: "Misal Pav", price: 110, img: "images/Misal+Pav.jpg", category: "Maharashtrian" },
    { name: "Pani Puri", price: 60, img: "images/Pani+Puri.jpg", category: "Street Food" },
    { name: "Dahi Puri", price: 70, img: "images/Dahi+Puri.jpg", category: "Street Food" },
    { name: "Rajma Chawal", price: 150, img: "images/Rajma+Chawal.jpg", category: "North Indian" },
    { name: "Baingan Bharta", price: 160, img: "images/Baingan+Bharta.jpg", category: "North Indian" },
    { name: "Kadai Paneer", price: 200, img: "images/Kadai+Paneer.jpg", category: "North Indian" },
    { name: "Matar Paneer", price: 190, img: "images/Matar+Paneer.jpg", category: "North Indian" },
    { name: "Shahi Paneer", price: 210, img: "images/Shahi+Paneer.jpg", category: "North Indian" },
    { name: "Gobi Manchurian", price: 170, img: "images/Gobi+Manchurian.jpg", category: "Chinese" },
    { name: "Chilli Paneer", price: 180, img: "images/Chilli+Paneer.jpg", category: "Chinese" },
    { name: "Hakka Noodles", price: 160, img: "images/Hakka+Noodles.jpg", category: "Chinese" },
    { name: "Spring Rolls", price: 140, img: "images/Spring+Rolls.jpg", category: "Chinese" }
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setDishes(sampleDishes);
      setFilteredDishes(sampleDishes);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(sampleDishes.map(dish => dish.category))];
      setCategories(uniqueCategories);
      
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter dishes based on search term and category
    let filtered = dishes;
    
    if (searchTerm) {
      filtered = filtered.filter(dish => 
        dish.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(dish => dish.category === selectedCategory);
    }
    
    setFilteredDishes(filtered);
  }, [searchTerm, selectedCategory, dishes]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  if (loading) {
    return (
      <Container className="mt-5 pt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading delicious dishes...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4 pt-5">
      {/* Search and Filter Section */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button 
            variant="outline-secondary" 
            onClick={clearFilters}
            className="w-100"
          >
            Clear
          </Button>
        </Col>
      </Row>

      {/* Results Count */}
      <Row className="mb-3">
        <Col>
          <p className="text-muted">
            Showing {filteredDishes.length} of {dishes.length} dishes
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory && ` in ${selectedCategory}`}
          </p>
        </Col>
      </Row>

      {/* Dishes Grid */}
      <Row>
        {filteredDishes.length === 0 ? (
          <Col className="text-center py-5">
            <div className="text-muted">
              <h4>🍽️ No dishes found</h4>
              <p>Try adjusting your search or category filter</p>
              <Button variant="outline-primary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </Col>
        ) : (
          filteredDishes.map((dish, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-3">
              <MenuItem
                dish={dish}
                addToCart={addToCart}
                addToFavorites={addToFavorites}
                removeFromFavorites={removeFromFavorites}
                isFavorite={favorites.some(fav => fav.name === dish.name)}
              />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Home;
