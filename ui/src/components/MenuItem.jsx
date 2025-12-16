import React, { useState } from 'react';

const MenuItem = ({ item, onAddToCart }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
  
    const handleOptionChange = (option, isChecked) => {
      if (isChecked) {
        setSelectedOptions(prev => [...prev, option]);
      } else {
        setSelectedOptions(prev => prev.filter(opt => opt.name !== option.name));
      }
    };
  
    const handleAddClick = () => {
      onAddToCart(item, selectedOptions);
      setSelectedOptions([]); // Reset options after adding
      document.querySelectorAll(`input[name="option-${item.id}"]:checked`).forEach(el => el.checked = false);
    };
    
    return (
      <div className="menu-item-card">
        <img src={item.image} alt={item.name} className="item-image" />
        <h3 className="item-name">{item.name}</h3>
        <p className="item-price">{item.price.toLocaleString()}원</p>
        <p className="item-description">{item.description}</p>
        <div className="item-options">
          {item.options.map(opt => (
            <div key={opt.name}>
              <input 
                type="checkbox" 
                id={`${item.id}-${opt.name}`} 
                name={`option-${item.id}`}
                onChange={(e) => handleOptionChange(opt, e.target.checked)} 
              />
              <label htmlFor={`${item.id}-${opt.name}`}>{opt.name} (+{opt.price.toLocaleString()}원)</label>
            </div>
          ))}
        </div>
        <button className="add-to-cart-btn" onClick={handleAddClick}>담기</button>
      </div>
    );
  };

  export default MenuItem;