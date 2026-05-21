import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Sparkles, Plus, Minus, CreditCard, CheckCircle2 } from 'lucide-react';
import './CartDrawer.css';

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity, onClearCart }) {
  const [paymentStep, setPaymentStep] = useState('idle'); // idle, processing, receipt
  const [hudMessage, setHudMessage] = useState('');
  const [receiptNo, setReceiptNo] = useState('');

  // 드로어가 열릴 때 결제 단계를 다시 idle로 초기화
  useEffect(() => {
    if (isOpen) {
      setPaymentStep('idle');
    }
  }, [isOpen]);

  // 장바구니 총 가격 산출 (각 아이템의 수량 반영)
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      let price = 15000; // stick 기본값
      if (item.option === 'can') price = 24000;
      if (item.option === 'bundle') price = 25300;
      return sum + (price * (item.quantity || 1));
    }, 0);
  };

  const getItemPrice = (option) => {
    if (option === 'stick') return 15000;
    if (option === 'can') return 24000;
    if (option === 'bundle') return 25300;
    return 0;
  };

  // 가상 HUD 결제 프로세스 시작
  const handleStartCheckout = () => {
    setPaymentStep('processing');
    
    const messages = [
      'INITIALIZING RITUAL ENCRYPTED TUNNEL...',
      'CONNECTING TO SECURE VIP PAYMENT GATEWAY...',
      'ESTABLISHING TLS_AES_256_GCM HANDSHAKE...',
      'DECRYPTING RITUAL TRANSACTION VAULT...',
      `AUTHORIZING SECURE AMOUNT: ${calculateTotal().toLocaleString()}원...`,
      'VERIFYING SPECIAL BUNDLE PROMO DISCOUNT (35% OFF)...',
      'MINTING BURN-TO-CHILL DIGITAL CERTIFICATE...',
      'TRANSACTION SUCCESSFUL. GENERATING RECEIPT...'
    ];

    let currentMsgIdx = 0;
    setHudMessage(messages[0]);

    const interval = setInterval(() => {
      currentMsgIdx++;
      if (currentMsgIdx < messages.length) {
        setHudMessage(messages[currentMsgIdx]);
      } else {
        clearInterval(interval);
        // 고유 가상 영수증 번호 생성
        const randomNo = 'BTC-' + Math.floor(100000 + Math.random() * 900000) + '-' + Date.now().toString().slice(-4);
        setReceiptNo(randomNo);
        setPaymentStep('receipt');
      }
    }, 220);
  };

  // 가상 영수증 확인 후 최종 완료 처리 및 장바구니 비우기
  const handleReceiptConfirm = () => {
    if (onClearCart) {
      onClearCart();
    }
    onClose();
  };

  return (
    <div className={`cart-drawer-viewport ${isOpen ? 'drawer-active' : ''}`}>
      {/* 바깥 블러 배경 장막 */}
      <div className="cart-drawer-backdrop" onClick={paymentStep === 'processing' ? null : onClose} />

      {/* 우측에서 밀려 나오는 사이드 쉘 보드 */}
      <div className="cart-drawer-body">
        
        {/* 드로어 헤더 */}
        <div className="cart-drawer-header">
          <div className="drawer-title-flex">
            <ShoppingBag size={20} className="header-bag-icon" />
            <h3>보관함 장바구니</h3>
            <span className="drawer-count-chip">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button 
            className="drawer-close-btn" 
            onClick={onClose} 
            disabled={paymentStep === 'processing'}
            style={{ opacity: paymentStep === 'processing' ? 0.3 : 1 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 1단계: 장바구니 리스트 모드 (IDLE) */}
        {paymentStep === 'idle' && (
          <>
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
                        
                        {/* 가격 및 즉시할인 배지 */}
                        <div className="cart-item-price-tag">
                          <span>{(getItemPrice(item.option) * item.quantity).toLocaleString()}원</span>
                          <span className="badge-sale">즉시 할인 적용</span>
                        </div>

                        {/* 수량 증감 버튼 영역 */}
                        <div className="cart-item-quantity-control">
                          <button 
                            className="qty-btn"
                            onClick={() => onUpdateQuantity(item.cartId, -1)}
                            title="수량 1개 감소"
                          >
                            <Minus size={11} strokeWidth={3} />
                          </button>
                          <span className="qty-number font-mono">{item.quantity}</span>
                          <button 
                            className="qty-btn"
                            onClick={() => onUpdateQuantity(item.cartId, 1)}
                            title="수량 1개 증가"
                          >
                            <Plus size={11} strokeWidth={3} />
                          </button>
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
                    <span>선택 상품 ({cartItems.reduce((acc, item) => acc + item.quantity, 0)}개)</span>
                    <span>{calculateTotal().toLocaleString()}원</span>
                  </div>
                  <div className="drawer-sum-row">
                    <span>배송비</span>
                    <span className="free-shipping-accent">무료 배송 (0원)</span>
                  </div>
                  <div className="drawer-sum-row drawer-grand-total">
                    <span>최종 결제 예정 금액</span>
                    <span>{calculateTotal().toLocaleString()}원</span>
                  </div>
                </div>

                {/* 체크아웃 주문 제출 버튼 */}
                <button 
                  className="drawer-checkout-action-btn"
                  onClick={handleStartCheckout}
                >
                  <Sparkles size={16} />
                  <span>이 꿀조합으로 결제하기</span>
                </button>

                <button className="drawer-continue-shopping-btn" onClick={onClose}>
                  쇼핑 계속하기
                </button>

              </div>
            )}
          </>
        )}

        {/* 2단계: 사이버네틱 HUD 결제 로딩 모드 (PROCESSING) */}
        {paymentStep === 'processing' && (
          <div className="hud-payment-loading-view">
            <div className="hud-cyber-scan-line" />
            <div className="hud-matrix-spinner">
              <div className="hud-inner-glow-core" />
            </div>
            
            <h4 className="hud-loading-title font-mono">SECURE VIP TRANSACTION</h4>
            <div className="hud-terminal-log-box">
              <div className="hud-log-cursor-line font-mono">&gt; {hudMessage}</div>
              <div className="hud-log-subline font-mono">DO NOT CLOSE THIS PANEL. CRYPTOGRAPHIC HANDSHAKE IN PROGRESS...</div>
            </div>
            
            <div className="hud-footer-branding font-mono">
              BURN-TO-CHILL // SECURE VAULT v4.19
            </div>
          </div>
        )}

        {/* 3단계: 가상 VIP 결제 완료 영수증 모드 (RECEIPT) */}
        {paymentStep === 'receipt' && (
          <div className="hud-receipt-done-view">
            <div className="receipt-brutal-card-paper">
              {/* 스파클 장식 */}
              <div className="receipt-sparkle-header">
                <CheckCircle2 size={36} className="receipt-success-check" />
                <h4 className="font-mono">VIP INVOICE SECURED</h4>
              </div>
              
              <div className="receipt-dashed-line" />
              
              {/* 주문 명세 정보 */}
              <div className="receipt-meta-grid font-mono">
                <div className="receipt-meta-row">
                  <span>RECEIPT NO.</span>
                  <strong>{receiptNo}</strong>
                </div>
                <div className="receipt-meta-row">
                  <span>STATUS</span>
                  <span className="receipt-status-badge">PAID VIP</span>
                </div>
                <div className="receipt-meta-row">
                  <span>DATE</span>
                  <span>{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                </div>
              </div>

              <div className="receipt-dashed-line" />

              {/* 상품 목록 */}
              <div className="receipt-goods-list">
                <span className="goods-section-lbl font-mono">ORDERED OBJECTS</span>
                {cartItems.map((item) => (
                  <div key={item.cartId} className="receipt-goods-row">
                    <span className="goods-name">
                      {item.option === 'stick' && '🪵 Signature Incense Stick (30ea)'}
                      {item.option === 'can' && '🔥 Analog Tin Can Solo'}
                      {item.option === 'bundle' && `🎁 ${item.canName || 'PALO'} Stick + Can Bundle`}
                      <span className="goods-qty"> x{item.quantity}</span>
                    </span>
                    <span className="goods-price font-mono">
                      {(getItemPrice(item.option) * item.quantity).toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>

              <div className="receipt-dashed-line" />

              {/* 금액 합계 */}
              <div className="receipt-total-grid font-mono">
                <div className="receipt-total-row">
                  <span>SUBTOTAL</span>
                  <span>{calculateTotal().toLocaleString()}원</span>
                </div>
                <div className="receipt-total-row">
                  <span>SHIPPING</span>
                  <span className="free-tag">FREE (0원)</span>
                </div>
                <div className="receipt-dashed-line-thin" />
                <div className="receipt-total-row receipt-grand-total">
                  <span>GRAND TOTAL</span>
                  <span className="grand-accent">{calculateTotal().toLocaleString()}원</span>
                </div>
              </div>

              <div className="receipt-dashed-line" />

              {/* 가상 바코드 */}
              <div className="receipt-barcoded-box">
                <div className="bar-code-stripes" />
                <span className="bar-code-digits font-mono">* B U R N T O C H I L L *</span>
              </div>
              
              <p className="receipt-warm-thankyou">
                인센스 처방 가공 및 틴 캔 패키징이 정밀 개시되었습니다. 번투칠 VIP 전용 우체국 안심 특송으로 내일 안전하게 도착합니다.
              </p>
            </div>

            {/* 영수증 닫기 액션 */}
            <div className="receipt-footer-actions">
              <button 
                className="receipt-confirm-btn"
                onClick={handleReceiptConfirm}
              >
                <span>보관함 영수증 보관 및 닫기</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
