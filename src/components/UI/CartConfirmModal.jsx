import React from 'react';
import { ShoppingBag, X, Sparkles } from 'lucide-react';
import './CartConfirmModal.css';

export default function CartConfirmModal({ isOpen, onClose, onConfirm, itemName, itemColor, itemIcon, itemDesc }) {
  if (!isOpen) return null;

  return (
    <div className="cart-confirm-overlay" onClick={onClose}>
      <div 
        className="cart-confirm-modal modal-glow jiggle-in" 
        onClick={(e) => e.stopPropagation()}
        style={{ '--accent-glow': itemColor }}
      >
        {/* 모달 닫기 */}
        <button className="cart-confirm-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* 상단 엠블럼 데코 */}
        <div className="cart-confirm-emblem" style={{ backgroundColor: itemColor }}>
          <ShoppingBag size={24} className="emblem-bag-icon" />
          <div className="emblem-sparkles">
            <Sparkles size={12} className="sparkle-1" />
            <Sparkles size={10} className="sparkle-2" />
          </div>
        </div>

        {/* 콘텐츠 바디 */}
        <div className="cart-confirm-body">
          <span className="cart-confirm-tag">CART ADD CONFIRM</span>
          <h3 className="cart-confirm-title">장바구니에 담을까요?</h3>
          
          {/* 선택한 제품 정보 프리뷰 카드 */}
          <div className="cart-confirm-preview-card" style={{ borderColor: `${itemColor}44` }}>
            <div className="preview-card-left" style={{ textShadow: `0 0 10px ${itemColor}` }}>
              {itemIcon}
            </div>
            <div className="preview-card-right">
              <h4 style={{ color: itemColor }}>[나만의 인센스] {itemName} 세트</h4>
              <p>{itemDesc}</p>
            </div>
          </div>

          <p className="cart-confirm-notice">
            정성을 담아 제작하는 캔틀 수제 인센스 캔 세트입니다.<br />
            장바구니에 추가하고 바로 확인해 보세요.
          </p>
        </div>

        {/* 모달 하단 버튼 액션 */}
        <div className="cart-confirm-footer">
          <button className="cart-confirm-btn btn-cancel" onClick={onClose}>
            돌아가기
          </button>
          <button 
            className="cart-confirm-btn btn-confirm" 
            onClick={onConfirm}
            style={{ 
              backgroundColor: itemColor,
              boxShadow: `0 8px 20px ${itemColor}44`
            }}
          >
            장바구니에 담기
          </button>
        </div>
      </div>
    </div>
  );
}
