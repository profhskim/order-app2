import React from 'react';

const Header = ({ activeView, setActiveView }) => (
    <header className="app-header">
      <h1 className="logo">COZY</h1>
      <nav>
        <button 
          className={activeView === 'order' ? 'active' : ''} 
          onClick={() => setActiveView('order')}>
          주문하기
        </button>
        <button 
          className={activeView === 'admin' ? 'active' : ''} 
          onClick={() => setActiveView('admin')}>
          관리자
        </button>
      </nav>
    </header>
  );

export default Header;
