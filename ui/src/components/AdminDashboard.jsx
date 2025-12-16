import React from 'react';

const AdminDashboard = ({ orders }) => {
    const totalOrders = orders.filter(o => o.status !== '제조 완료').length;
    const received = orders.filter(o => o.status === '주문 접수').length;
    const inProduction = orders.filter(o => o.status === '제조 중').length;
    const completed = orders.filter(o => o.status === '제조 완료').length;

    return (
        <div className="admin-section">
            <h2>관리자 대시보드</h2>
            <div className="dashboard-summary">
                <span>총 주문: {totalOrders}</span> /
                <span>주문 접수: {received}</span> /
                <span>제조 중: {inProduction}</span> /
                <span>제조 완료: {completed}</span>
            </div>
        </div>
    );
};

export default AdminDashboard;