import React from 'react';
import AdminDashboard from './AdminDashboard';
import StockStatus from './StockStatus';
import OrderStatus from './OrderStatus';

const AdminView = ({ orders, stock, onStockChange, onUpdateStatus }) => (
    <>
        <AdminDashboard orders={orders} />
        <StockStatus stock={stock} onStockChange={onStockChange} />
        <OrderStatus orders={orders} stock={stock} onUpdateStatus={onUpdateStatus} />
    </>
);

export default AdminView;