import React from 'react';
import MenuItem from './MenuItem';

const Menu = ({ items, onAddToCart }) => (
    <section className="menu-section">
      <div className="menu-grid">
        {items.map(item => <MenuItem key={item.id} item={item} onAddToCart={onAddToCart} />)}
      </div>
    </section>
  );

export default Menu;