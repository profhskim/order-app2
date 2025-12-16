import React from 'react';

const OrderStatus = ({ orders, onUpdateStatus }) => {
    const pendingOrders = orders.filter(o => o.status !== '제조 완료');
    return (
        <div className="admin-section">
            <h2>주문 현황</h2>
            <div className="order-list">
                {pendingOrders.map(order => (
                    <div key={order.id} className="order-list-item">
                        <span>{new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(order.date)}</span>
                        <span>{order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</span>
                        <span>{order.total.toLocaleString()}원</span>
                        <button onClick={() => onUpdateStatus(order.id, order.items)}>
                            {order.status === '주문 접수' ? '제조 시작' : '제조 완료'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderStatus;