import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';

describe('Header Component', () => {
  it('renders the logo and navigation buttons', () => {
    render(<Header activeView="order" setActiveView={() => {}} />);
    
    // 로고 확인
    expect(screen.getByText('COZY')).toBeInTheDocument();
    
    // 네비게이션 버튼 확인
    expect(screen.getByRole('button', { name: '주문하기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '관리자' })).toBeInTheDocument();
  });

  it('highlights the active navigation button', () => {
    const { rerender } = render(<Header activeView="order" setActiveView={() => {}} />);
    
    // '주문하기' 탭이 활성화 상태인지 확인
    expect(screen.getByRole('button', { name: '주문하기' })).toHaveClass('active');
    expect(screen.getByRole('button', { name: '관리자' })).not.toHaveClass('active');
    
    // '관리자' 탭으로 뷰를 변경하여 리렌더링
    rerender(<Header activeView="admin" setActiveView={() => {}} />);
    
    // '관리자' 탭이 활성화 상태인지 확인
    expect(screen.getByRole('button', { name: '주문하기' })).not.toHaveClass('active');
    expect(screen.getByRole('button', { name: '관리자' })).toHaveClass('active');
  });

  it('calls setActiveView with the correct view when a button is clicked', () => {
    const setActiveViewMock = vi.fn();
    render(<Header activeView="order" setActiveView={setActiveViewMock} />);
    
    // '관리자' 버튼 클릭
    fireEvent.click(screen.getByRole('button', { name: '관리자' }));
    
    // setActiveView가 'admin'과 함께 호출되었는지 확인
    expect(setActiveViewMock).toHaveBeenCalledWith('admin');
    
    // '주문하기' 버튼 클릭
    fireEvent.click(screen.getByRole('button', { name: '주문하기' }));
    
    // setActiveView가 'order'와 함께 호출되었는지 확인
    expect(setActiveViewMock).toHaveBeenCalledWith('order');
  });
});