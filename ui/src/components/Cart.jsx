import React, { useMemo } from 'react';

const Cart = ({ items, onRemoveItem, onPlaceOrder }) => {
    const total = useMemo(() => 
        items.reduce((sum, item) => sum + item.totalPrice, 0),
    [items]);

  return (
    <section className="cart-section">
      <h2 className="cart-title">장바구니</h2>
      <div className="cart-layout">
        <div className="cart-order-list">
          {items.length === 0 ? (
            <p>장바구니가 비어있습니다.</p>
          ) : (
            items.map(item => (
              <div key={item.cartId} className="cart-item">
                <div className="cart-item-info">
                  <span className="cart-item-name">
                    {item.name} 
                    {item.options.length > 0 && ` (${item.options.map(o => o.name).join(', ')})`}
                    &nbsp;x {item.quantity}
                  </span>
                  <span className="cart-item-price">{(item.totalPrice).toLocaleString()}원</span>
                </div>
                <button onClick={() => onRemoveItem(item.cartId)} className="remove-item-btn">삭제</button>
              </div>
            ))
          )}
        </div>
        <div className="cart-summary-area">
          <div className="cart-summary">
            <span className="total-label">총 금액</span>
            <span className="total-price">{total.toLocaleString()}원</span>
          </div>
          <button className="place-order-btn" onClick={onPlaceOrder} disabled={items.length === 0}>주문하기</button>
        </div>
      </div>
    </section>
  );
};

export default Cart;