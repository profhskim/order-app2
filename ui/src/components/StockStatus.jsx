import React from 'react';

const StockStatus = ({ stock, onStockChange }) => {
    const getStatus = (stockCount) => {
        if (stockCount === 0) return '품절';
        if (stockCount < 5) return '주의';
        return '정상';
    };

    return (
        <div className="admin-section">
            <h2>재고 현황</h2>
            <div className="stock-grid">
                {stock.map(item => (
                    <div key={item.id} className="stock-item">
                        <p>{item.name}</p>
                        <div className="stock-info">
                          <p>재고: {item.stock}</p>
                          <span className={`stock-status-${getStatus(item.stock)}`}>{getStatus(item.stock)}</span>
                        </div>
                        <div>
                            <button onClick={() => onStockChange(item.id, 1)}>+</button>
                            <button onClick={() => onStockChange(item.id, -1)} disabled={item.stock === 0}>-</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StockStatus;