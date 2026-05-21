import React, { useState, useEffect, useRef } from 'react';
import { Flame, Sparkles, Check, ShoppingBag, Info, ShieldAlert } from 'lucide-react';
import './PurchaseSection.css';

export default function PurchaseSection({ isIgnited, onIgnite, addToCart, selectedCan, setSelectedCan }) {
  const sectionRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState('bundle'); // stick, can, bundle (기본 번들 추천)
  const [showCartToast, setShowCartToast] = useState(false);
  const [pulseCount, setPulseCount] = useState(17); // 남은 수량 실시간 펄스용
  const [viewCount, setViewCount] = useState(86);  // 실시간 조회수

  const [hasScrolledIn, setHasScrolledIn] = useState(false);

  // 화면 스크롤 시 섹션이 뷰포트 중앙에 도달하면 자동으로 점화식(onIgnite) 트리거
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasScrolledIn(true);
        }
        if (onIgnite) {
          onIgnite(entry.isIntersecting);
        }
      },
      {
        rootMargin: '-18% 0px -18% 0px', // 스크롤 시 화면에 들어오기 시작하면 부드럽게 활성화되도록 마진 완화
        threshold: 0.1
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [onIgnite]);

  // 실시간 수량 및 조회수 미세 변동 시뮬레이션 (생동감 극대화)
  useEffect(() => {
    const timer = setInterval(() => {
      // 10% 확률로 수량 감소
      if (Math.random() < 0.1 && pulseCount > 3) {
        setPulseCount(prev => prev - 1);
      }
      // 조회수 무작위 변동 (+- 3명)
      setViewCount(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next > 60 && next < 150 ? next : prev;
      });
    }, 4000);
    return () => clearInterval(timer);
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    card.style.setProperty('--mx', `${xPercent}%`);
    card.style.setProperty('--my', `${yPercent}%`);
    
    const xTilt = ((x / rect.width) - 0.5) * 10;
    const yTilt = ((y / rect.height) - 0.5) * -10;
    card.style.setProperty('--card-tilt-x', `${yTilt}deg`);
    card.style.setProperty('--card-tilt-y', `${xTilt}deg`);
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty('--mx', `50%`);
    card.style.setProperty('--my', `50%`);
    card.style.setProperty('--card-tilt-x', `0deg`);
    card.style.setProperty('--card-tilt-y', `0deg`);
  };

  const incenseCans = [
    {
      name: 'PALO SANTO',
      icon: '🪵',
      color: '#E5A93B',
      desc: '신성한 정화의 황금빛 야생 나무 향'
    },
    {
      name: 'SMOKED SANDALWOOD',
      icon: '🔥',
      color: '#FF6B35',
      desc: '포근하고 무거운 숲속 모닥불 잔향'
    },
    {
      name: 'WHITE SAGE',
      icon: '🌿',
      color: '#65A30D',
      desc: '잡내를 씻어내는 싱그러운 풀빛 새벽 향'
    },
    {
      name: 'BLACK PATCHOULI',
      icon: '🔮',
      color: '#8B5CF6',
      desc: '밤새 이국적으로 번지는 다크 머스크 향'
    }
  ];

  const handleBuyClick = () => {
    // 실제 장바구니에 아이템을 추가
    if (addToCart) {
      addToCart({
        option: selectedOption,
        canIcon: selectedOption === 'bundle' ? incenseCans[selectedCan].icon : undefined,
        canName: selectedOption === 'bundle' ? incenseCans[selectedCan].name.split(' ')[0] : undefined
      });
    }

    // 토스트 알림 노출
    setShowCartToast(true);
    setTimeout(() => {
      setShowCartToast(false);
    }, 3500);
  };

  // 선택된 캔에 따른 동적 백그라운드 그라데이션 및 악센트 컬러 생성
  const activeColor = incenseCans[selectedCan].color;

  return (
    <section className={`purchase-section ${hasScrolledIn ? 'scrolled-in' : ''}`} ref={sectionRef} style={{ '--active-accent': activeColor }}>
      <div className="purchase-grid-bg"></div>

      <div className="purchase-container">
        
        {/* 공통 가로 분할 헤더 (02번 구매 섹션) */}
        <div className="section-header-row">
          <div className="header-left">
            <span className="section-badge">
              <span className="badge-num">02</span>
              <span className="badge-divider">/</span>
              <span className="badge-text">100% HANDMADE INCENSE</span>
            </span>
          </div>
          <div className="header-right">
            <h2 className="goblin-text section-title-unified">
              향 스틱만 태우기엔<br />
              <span className="promo-emphasis-text">2% 아쉬우니까.</span>
            </h2>
            <p className="section-desc-main">
              스틱의 온전한 정취를 전용 틴 캔 속에 안전하게 가두어 소장하는 가장 감각적인 기회.
            </p>
            <p className="section-desc-sub">
              스틱과 캔의 시너지를 극대화하는 꿀조합 묶음 번들 패키지로, <strong>35% 할인된 특별 혜택가</strong>에 무료 배송으로 소장해 보세요.
            </p>
          </div>
        </div>

        {/* 메인 콘텐츠: 좌측 옵션 셀렉터 / 우측 번들 세부 캔 픽커 & 최종 결제 가속 카드 */}
        <div className="purchase-main-box">
          
          {/* 좌측: 3대 상품 옵션 카드 레이아웃 */}
          <div className="promo-options-column">
            
            {/* 옵션 1: 스틱 단품 */}
            <div 
              className={`promo-option-card ${selectedOption === 'stick' ? 'active-option' : ''}`}
              onClick={() => setSelectedOption('stick')}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="option-checkbox">
                {selectedOption === 'stick' && <Check size={14} className="check-icon" />}
              </div>
              <div className="option-details">
                <span className="option-badge standard">STANDARD</span>
                <h4 className="option-name">시그니처 인센스 스틱 (1팩 / 30ea)</h4>
                <p className="option-card-desc">화이트 세이지 등 천연 나무 가루만을 배합한 향 스틱</p>
              </div>
              <div className="option-price-box">
                <span className="card-final-price">15,000원</span>
              </div>
            </div>

            {/* 옵션 2: 캔 단품 */}
            <div 
              className={`promo-option-card ${selectedOption === 'can' ? 'active-option' : ''}`}
              onClick={() => setSelectedOption('can')}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="option-checkbox">
                {selectedOption === 'can' && <Check size={14} className="check-icon" />}
              </div>
              <div className="option-details">
                <span className="option-badge standard">TRENDY BOX</span>
                <h4 className="option-name">아날로그 틴 캔 보관함 (1개)</h4>
                <p className="option-card-desc">아름다운 일러스트와 3D 스 swings 가치를 담은 스틸 소장통</p>
              </div>
              <div className="option-price-box">
                <span className="card-final-price">24,000원</span>
              </div>
            </div>

            {/* 옵션 3: 꿀조합 묶음 번들 (추천) */}
            <div 
              className={`promo-option-card bundle-promo-card ${selectedOption === 'bundle' ? 'active-option' : ''}`}
              onClick={() => setSelectedOption('bundle')}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="bundle-fire-ribbon">35% BUNDLE OFF</div>
              <div className="option-checkbox">
                {selectedOption === 'bundle' && <Check size={14} className="check-icon" />}
              </div>
              <div className="option-details">
                <span className="option-badge bundle-badge">RECOMMENDED</span>
                <h4 className="option-name">인센스 스틱 + 아날로그 틴 캔 번들 세트</h4>
                <p className="option-card-desc">스틱의 깊은 향과 틴 캔의 3D 뚜껑 부유 모션 시너지를 한 번에 소장</p>
              </div>
              <div className="option-price-box">
                <span className="card-original-price strike-through">39,000원</span>
                <span className="card-final-price discount-price">25,300원</span>
              </div>
            </div>

          </div>

          {/* 우측: 캔 픽커 및 동적 가격 혜택 & 구매 유도 카드 */}
          <div className="promo-checkout-board">
            <div className="checkout-board-inner">
              
              {selectedOption === 'bundle' ? (
                <>
                  <div className="picker-header">
                    <span className="picker-step-tag">STEP 2</span>
                    <h4>트렌디 캔 아로마 조합 선택</h4>
                    <p>번들 세트에 포함될 캔 디자인과 시그니처 아로마 향을 선택해 보세요.</p>
                  </div>

                  {/* 가로형 통통 튀는 캔 픽커 */}
                  <div className="checkout-can-picker">
                    {incenseCans.map((can, idx) => (
                      <div 
                        key={idx}
                        className={`picker-can-item ${selectedCan === idx ? 'can-picked' : ''}`}
                        onClick={() => setSelectedCan(idx)}
                        onMouseMove={handleCardMouseMove}
                        onMouseLeave={handleCardMouseLeave}
                        data-scent-color={can.color}
                        style={{ '--can-color': can.color }}
                      >
                        <div className="picker-can-icon-wrap">
                          <span className="picker-can-emoji">{can.icon}</span>
                          {selectedCan === idx && (
                            <span className="picked-badge"><Check size={10} /></span>
                          )}
                        </div>
                        <span className="picker-can-name">{can.name.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>

                  {/* 선택된 향의 간략 브리핑 칩 */}
                  <div className="picked-aroma-brief" style={{ borderColor: activeColor }}>
                    <Info size={14} style={{ color: activeColor }} />
                    <p>
                      <strong>{incenseCans[selectedCan].name}</strong>: {incenseCans[selectedCan].desc}
                    </p>
                  </div>
                </>
              ) : (
                <div className="single-select-prompt">
                  <ShieldAlert size={36} className="prompt-warning-icon" />
                  <h4>단품을 선택하셨습니다</h4>
                  <p>
                    단품 구매 시에는 캔의 아로마 커스터마이징 혜택 및 번들 특별 35% 할인(13,700원 즉시 절약) 혜택이 적용되지 않습니다.
                  </p>
                  <button 
                    className="back-to-bundle-btn"
                    onClick={() => setSelectedOption('bundle')}
                  >
                    35% 할인 번들 세트로 변경하기
                  </button>
                </div>
              )}

              {/* 하단 가격 정산 및 마이크로 결제 자극 장치 */}
              <div className="checkout-calculation-shelf">
                
                {/* 실시간 긴박감 칩 정보 */}
                <div className="realtime-nudge-wrap">
                  <span className="nudge-chip eyeball-pulse">
                    <span className="pulse-dot red-dot"></span>
                    🔥 실시간 {viewCount}명이 이 혜택을 구경하고 있습니다!
                  </span>
                  <span className="nudge-chip timer-jiggle">
                    <span className="pulse-dot orange-dot"></span>
                    ⏳ 특가 종료 임박! 오늘 남은 선착순 수량 <strong>{pulseCount}개</strong>
                  </span>
                </div>

                {/* 최종 정산 요약선 */}
                <div className="final-bill-summary">
                  <div className="bill-row">
                    <span>선택 사양</span>
                    <strong>
                      {selectedOption === 'stick' && '인센스 스틱 단품'}
                      {selectedOption === 'can' && '아날로그 틴 캔 단품'}
                      {selectedOption === 'bundle' && `인센스 번들 (+ 캔: ${incenseCans[selectedCan].name.split(' ')[0]})`}
                    </strong>
                  </div>
                  <div className="bill-row total-row">
                    <span>최종 결제 혜택가</span>
                    <span className="checkout-total-price">
                      {selectedOption === 'stick' && '15,000원'}
                      {selectedOption === 'can' && '24,000원'}
                      {selectedOption === 'bundle' && '25,300원'}
                    </span>
                  </div>
                </div>

                {/* 무지갯빛 네온 그라데이션 구매하기 버튼 */}
                <button 
                  className={`neon-checkout-trigger-btn ${selectedOption === 'bundle' ? 'bundle-active' : ''}`}
                  onClick={handleBuyClick}
                >
                  <ShoppingBag size={18} />
                  <span>
                    {selectedOption === 'bundle' 
                      ? '이 꿀조합으로 할인받고 데려가기' 
                      : `${selectedOption === 'stick' ? '시그니처 향 스틱' : '아날로그 틴 캔'} 단품 데려가기`
                    }
                  </span>
                </button>

                <p className="checkout-secure-notice">
                  * 캔틀 보관고 정품 인증서 동봉 | 전국 100% 안심 우체국 무료 배송
                </p>

              </div>

            </div>
          </div>

        </div>

      </div>

      {/* 장바구니 젤리 팝업 토스트 */}
      <div className={`cart-jelly-toast ${showCartToast ? 'toast-show' : ''}`}>
        <div className="toast-content-inner">
          <div className="toast-success-spark">
            <Sparkles size={20} className="spark-spin-icon" />
          </div>
          <div className="toast-texts">
            <h5>
              {selectedOption === 'bundle' 
                ? '🛒 번들 혜택 장바구니 추가 완료!' 
                : '🛒 장바구니 담기 완료!'
              }
            </h5>
            <p>
              {selectedOption === 'bundle' 
                ? `인센스 스틱 + [${incenseCans[selectedCan].name}] 틴 캔 번들 특별 할인가(25,300원)가 정상 적용되었습니다.`
                : `${selectedOption === 'stick' ? '인센스 스틱 단품(15,000원)' : '아날로그 틴 캔 단품(24,000원)'}이 장바구니에 담겼습니다.`
              }
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
