import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import './CartDrawer.css';

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem }) {
  
  // 장바구니 총 가격 산출
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      let price = 15000; // stick 기본값
      if (item.option === 'can') price = 24000;
      if (item.option === 'bundle') price = 25300;
      return sum + price;
    }, 0).toLocaleString();
  };

  const getItemPrice = (option) => {
    if (option === 'stick') return '15,000원';
    if (option === 'can') return '24,000원';
    if (option === 'bundle') return '25,300원';
    return '0원';
  };

  return (
    <div className={`cart-drawer-viewport ${isOpen ? 'drawer-active' : ''}`}>
      {/* 바깥 블러 배경 장막 */}
      <div className="cart-drawer-backdrop" onClick={onClose} />

      {/* 우측에서 밀려 나오는 사이드 쉘 보드 */}
      <div className="cart-drawer-body">
        
        {/* 드로어 헤더 */}
        <div className="cart-drawer-header">
          <div className="drawer-title-flex">
            <ShoppingBag size={20} className="header-bag-icon" />
            <h3>보관함 장바구니</h3>
            <span className="drawer-count-chip">{cartItems.length}</span>
          </div>
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 메인 리스트 영역 */}
        <div className="cart-drawer-content">
          {cartItems.length > 0 ? (
            <div className="cart-items-scroll-list">
              {cartItems.map((item) => (
                <div key={item.cartId} className="cart-item-brutal-card">
                  
                  {/* 향/캔 아이콘 그래픽 */}
                  <div className="cart-item-avatar-wrap">
                    <span className="cart-item-avatar-emoji">
                      {item.option === 'stick' && '🪵'}
                      {item.option === 'can' && '🔥'}
                      {item.option === 'bundle' && (item.canIcon || '🎁')}
                    </span>
                  </div>

                  {/* 아이템 상세 세부사항 */}
                  <div className="cart-item-info">
                    <h5 className="cart-item-title-name">
                      {item.option === 'stick' && '시그니처 인센스 스틱 (30ea)'}
                      {item.option === 'can' && '아날로그 틴 캔 단품'}
                      {item.option === 'bundle' && '인센스 스틱 + 틴 캔 번들'}
                    </h5>
                    
                    {item.option === 'bundle' && (
                      <span className="cart-item-aroma-badge">
                        조합 향 ─ <strong>{item.canName || 'PALO'}</strong>
                      </span>
                    )}
                    
                    <div className="cart-item-price-tag">
                      <span>{getItemPrice(item.option)}</span>
                      <span className="badge-sale">즉시 할인 적용</span>
                    </div>
                  </div>

                  {/* 삭제 버튼 */}
                  <button 
                    className="cart-item-delete-btn"
                    onClick={() => onRemoveItem(item.cartId)}
                    title="아이템 제거"
                  >
                    <Trash2 size={15} />
                  </button>

                </div>
              ))}
            </div>
          ) : (
            /* 빈 장바구니 전용 감성 일러스트 뷰 */
            <div className="empty-cart-view">
              <div className="empty-graphic-wrap">
                <div className="empty-flicker-flame">
                  <ShoppingBag size={48} className="empty-bag-shake" />
                </div>
              </div>
              <h4>보관고가 비어 있습니다</h4>
              <p>
                인센스 번들 할인 혜택으로 향기로운 진짜 온기를 채워보세요. 째깍째깍, 오늘 특가 선착순 마감 직전!
              </p>
              <button className="empty-explore-btn" onClick={onClose}>
                인센스 번들 구경하기 <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* 하단 가격 합산 및 결제 가속 발판 */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            
            {/* 안전인증 문구 */}
            <div className="drawer-security-row">
              <ShieldCheck size={14} className="shield-green" />
              <span>우체국 안심 무료 배송 | 캔틀 공식 정품 보증</span>
            </div>

            {/* 정산 요약 */}
            <div className="drawer-summary-board">
              <div className="drawer-sum-row">
                <span>선택 상품 ({cartItems.length}개)</span>
                <span>{calculateTotal()}원</span>
              </div>
              <div className="drawer-sum-row">
                <span>배송비</span>
                <span className="free-shipping-accent">무료 배송 (0원)</span>
              </div>
              <div className="drawer-sum-row drawer-grand-total">
                <span>최종 결제 예정 금액</span>
                <span>{calculateTotal()}원</span>
              </div>
            </div>

            {/* 체크아웃 주문 제출 버튼 */}
            <button 
              className="drawer-checkout-action-btn"
              onClick={() => {
                alert(`🛒 총 ${cartItems.length}개의 향기로운 오브제 번들 주문이 안전하게 신청되었습니다! \n결제 및 보관고 등록이 연동됩니다.`);
                onClose();
              }}
            >
              <Sparkles size={16} />
              <span>이 꿀조합으로 결제하기</span>
            </button>

            <button className="drawer-continue-shopping-btn" onClick={onClose}>
              쇼핑 계속하기
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
