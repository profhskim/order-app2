import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import Menu from './components/Menu';
import Cart from './components/Cart';
import AdminView from './components/AdminView';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function App() {
  const [activeView, setActiveView] = useState('order');
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [stock, setStock] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      if (activeView === 'order') {
        const response = await fetch(`${API_URL}/menus`);
        const data = await response.json();
        setMenuItems(data);
      } else { // admin view
        const ordersRes = await fetch(`${API_URL}/admin/orders`);
        const ordersData = await ordersRes.json();
        setOrders(ordersData);

        const stockRes = await fetch(`${API_URL}/admin/menus`);
        const stockData = await stockRes.json();
        setStock(stockData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [activeView]);

  useEffect(() => {
    fetchData();
    
    // Set up polling for admin view
    if (activeView === 'admin') {
      const intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds
      return () => clearInterval(intervalId);
    }
  }, [fetchData, activeView]);

  const handleAddToCart = (item, options) => {
    const optionPrice = options.reduce((sum, opt) => sum + opt.price, 0);
    const finalPrice = item.price + optionPrice;
    
    // Create a unique ID for the cart item based on the menu item and its selected options
    const cartId = `${item.id}-${options.map(o => o.id).sort().join('-')}`;
    
    setCartItems(prevItems => {
        const existingItem = prevItems.find(i => i.cartId === cartId);
        if (existingItem) {
            return prevItems.map(i => 
                i.cartId === cartId 
                ? { ...i, quantity: i.quantity + 1, totalPrice: i.unitPrice * (i.quantity + 1) } 
                : i
            );
        } else {
            return [...prevItems, { 
              ...item,
              menu_id: item.id, // for order payload
              cartId, 
              options, 
              quantity: 1, 
              unitPrice: finalPrice, 
              totalPrice: finalPrice 
            }];
        }
    });
  };

  const handleRemoveFromCart = (cartId) => {
      setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  };

  const handlePlaceOrder = async () => {
      if (cartItems.length === 0) return;

      const orderPayload = {
        items: cartItems.map(item => ({
          menu_id: item.menu_id,
          quantity: item.quantity,
          options: item.options.map(opt => opt.id),
          total_price: item.totalPrice,
        }))
      };

      try {
        const response = await fetch(`${API_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });

        if (!response.ok) {
          throw new Error('Order placement failed');
        }
        
        setCartItems([]);
        fetchData(); // Refresh data
        alert('주문이 성공적으로 접수되었습니다.');
      } catch (error) {
        console.error("Failed to place order:", error);
        alert('주문 처리 중 오류가 발생했습니다.');
      }
  };

  const handleStockChange = async (itemId, amount) => {
    const item = stock.find(s => s.id === itemId);
    if (!item) return;

    const newStockValue = Math.max(0, item.stock + amount);

    try {
      const response = await fetch(`${API_URL}/admin/menus/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStockValue }),
      });

      if (!response.ok) {
        throw new Error('Stock update failed');
      }
      
      // On success, update the state directly
      setStock(prevStock => prevStock.map(s =>
        s.id === itemId ? { ...s, stock: newStockValue } : s
      ));

    } catch (error) {
      console.error('Failed to update stock:', error);
      alert('재고 업데이트에 실패했습니다.');
    }
  };
  
  const handleUpdateOrderStatus = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    let newStatus;
    switch (order.status) {
      case '주문 접수':
        newStatus = '제조 중';
        break;
      case '제조 중':
        newStatus = '완료';
        break;
      default:
        return; 
    }

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Order status update failed');

      fetchData(); // Refresh data
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div className="app-container">
      <Header activeView={activeView} setActiveView={setActiveView} />
      <main>
        {activeView === 'order' ? (
          <>
            <Menu items={menuItems} onAddToCart={handleAddToCart} />
            <Cart items={cartItems} onRemoveItem={handleRemoveFromCart} onPlaceOrder={handlePlaceOrder} />
          </>
        ) : (
          <AdminView 
            orders={orders} 
            stock={stock} 
            onStockChange={handleStockChange}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        )}
      </main>
    </div>
  );
}

export default App;