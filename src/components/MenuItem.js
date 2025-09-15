import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import './MenuItem.css';

const MenuItem = ({ dish, addToCart, addToFavorites, removeFromFavorites, isFavorite }) => {
  const handleAddToCart = () => {
    addToCart(dish);
  };

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites(dish.name);
    } else {
      addToFavorites(dish);
    }
  };

  return (
    <Card className="dish-card h-100 shadow-sm">
      <div className="position-relative">
        <Badge 
          bg="primary" 
          className="badge-cat position-absolute top-0 start-0 m-2"
        >
          {dish.category}
        </Badge>
        
        <Card.Img 
          variant="top" 
          src={dish.img} 
          alt={dish.name}
          className="dish-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Food+Image';
          }}
        />
        
        <Button
          variant={isFavorite ? "danger" : "outline-danger"}
          size="sm"
          className="favorite-btn position-absolute top-0 end-0 m-2"
          onClick={handleFavoriteToggle}
        >
          {isFavorite ? '♥' : '♡'}
        </Button>
      </div>
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="dish-title mb-2">{dish.name}</Card.Title>
        <Card.Text className="dish-price text-primary fw-bold mb-3">
          ₹{dish.price}
        </Card.Text>
        
        <div className="d-grid gap-2 mt-auto">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleAddToCart}
            className="add-to-cart-btn"
          >
            🛒 Add to Order
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MenuItem;
