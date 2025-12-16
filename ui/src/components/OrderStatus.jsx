import React from 'react';

const OrderStatus = ({ orders, stock, onUpdateStatus }) => {

    const getMenuName = (menuId) => {
        const menuItem = stock.find(item => item.id === menuId);
        return menuItem ? menuItem.name : 'Unknown Item';
    };

    const calculateTotal = (items) => {
        return items.reduce((sum, item) => sum + item.total_price, 0);
    };

    const pendingOrders = orders.filter(o => o.status !== '완료');
    
    return (
        <div className="admin-section">
            <h2>주문 현황</h2>
            <div className="order-list">
                {pendingOrders.map(order => (
                    <div key={order.id} className="order-list-item">
                        <span>{new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(new Date(order.order_timestamp))}</span>
                        <span>{order.items.map(i => `${getMenuName(i.menu_id)} x${i.quantity}`).join(', ')}</span>
                        <span>{calculateTotal(order.items).toLocaleString()}원</span>
                        <button onClick={() => onUpdateStatus(order.id)}>
                            {order.status === '주문 접수' ? '제조 시작' : '제조 완료'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderStatus;