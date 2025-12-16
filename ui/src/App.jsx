import React, { useState, useMemo } from 'react';
import './App.css';
import Header from './components/Header';
import Menu from './components/Menu';
import Cart from './components/Cart';
import AdminView from './components/AdminView';

// --- 데이터 ---
const initialMenuItems = [
  {
    id: 1,
    name: '아메리카노 (ICE)',
    price: 4000,
    description: '시원하고 깔끔한 클래식 커피',
    options: [{ name: '샷 추가', price: 500 }, { name: '시럽 추가', price: 0 }],
    image: '/americano-ice.jpg',
  },
  {
    id: 2,
    name: '아메리카노 (HOT)',
    price: 4000,
    description: '따뜻하고 부드러운 클래식 커피',
    options: [{ name: '샷 추가', price: 500 }, { name: '시럽 추가', price: 0 }],
    image: '/americano-hot.jpg',
  },
  {
    id: 3,
    name: '카페라떼',
    price: 5000,
    description: '부드러운 우유와 에스프레소의 조화',
    options: [{ name: '샷 추가', price: 500 }, { name: '두유로 변경', price: 500 }],
    image: '/caffe-latte.jpg',
  },
];

const initialStock = [
    { id: 1, name: '아메리카노 (ICE)', stock: 10 },
    { id: 2, name: '아메리카노 (HOT)', stock: 10 },
    { id: 3, name: '카페라떼', stock: 10 },
];

const initialOrders = [];

// --- 컴포넌트 ---

function App() {
  const [activeView, setActiveView] = useState('order');
  const [menuItems] = useState(initialMenuItems);
  const [cartItems, setCartItems] = useState([]);
  const [stock, setStock] = useState(initialStock);
  const [orders, setOrders] = useState(initialOrders);

  const handleAddToCart = (item, options) => {
    const optionPrice = options.reduce((sum, opt) => sum + opt.price, 0);
    const finalPrice = item.price + optionPrice;
    const cartId = `${item.id}-${options.map(o => o.name).sort().join('-')}`;
    
    setCartItems(prevItems => {
        const existingItem = prevItems.find(i => i.cartId === cartId);
        if (existingItem) {
            return prevItems.map(i => 
                i.cartId === cartId 
                ? { ...i, quantity: i.quantity + 1, totalPrice: (i.unitPrice) * (i.quantity + 1) } 
                : i
            );
        } else {
            return [...prevItems, { ...item, cartId, options, quantity: 1, unitPrice: finalPrice, totalPrice: finalPrice }];
        }
    });
  };

  const handleRemoveFromCart = (cartId) => {
      setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  };

  const handlePlaceOrder = () => {
      if (cartItems.length === 0) return;
      const newOrder = {
          id: Date.now(),
          date: new Date(),
          items: cartItems.map(({ id, name, quantity, options }) => ({ id, name, quantity, options })),
          total: cartItems.reduce((sum, item) => sum + item.totalPrice, 0),
          status: '주문 접수',
      };
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      setCartItems([]);
  };

  const handleStockChange = (itemId, amount) => {
      setStock(prevStock => prevStock.map(item =>
          item.id === itemId ? { ...item, stock: Math.max(0, item.stock + amount) } : item
      ));
  };
  
  const handleUpdateOrderStatus = (orderId, orderItems) => {
    const orderToUpdate = orders.find(order => order.id === orderId);
    if (!orderToUpdate) return;

    let newStatus;
    if (orderToUpdate.status === '주문 접수') {
      newStatus = '제조 중';
    } else if (orderToUpdate.status === '제조 중') {
      newStatus = '제조 완료';
    } else {
      return; // Already completed or other status
    }

    // If the order is being completed, update the stock first
    if (newStatus === '제조 완료') {
      orderItems.forEach(orderItem => {
        // Find the corresponding stock item
        const stockItem = stock.find(s => s.id === orderItem.id);
        if (stockItem) {
          // Use a function for the state update to ensure it's based on the latest state
          setStock(prevStock => prevStock.map(s => 
            s.id === orderItem.id 
              ? { ...s, stock: Math.max(0, s.stock - orderItem.quantity) } 
              : s
          ));
        }
      });
    }

    // Then, update the order status
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
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