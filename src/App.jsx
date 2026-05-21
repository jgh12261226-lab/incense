import React, { useState, useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ScentSection from './components/ScentSection';
import PurchaseSection from './components/PurchaseSection';
import RevealSection from './components/RevealSection';
import EpilogueSection from './components/EpilogueSection';
import LoginOverlay from './components/UI/LoginOverlay';
import CartDrawer from './components/UI/CartDrawer';
import CartConfirmModal from './components/UI/CartConfirmModal';
import './styles/global.css';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // 각 섹션별 점화 상태 관리 (불이 붙어야 검은 다크베일이 걷히며 밝아짐)
  const [ignitedHero, setIgnitedHero] = useState(false);
  const [ignitedPurchase, setIgnitedPurchase] = useState(false);
  const [ignitedScent, setIgnitedScent] = useState(false);
  const [ignitedReveal, setIgnitedReveal] = useState(false);
  const [ignitedEpilogue, setIgnitedEpilogue] = useState(false);

  // 장바구니 및 로그인/장바구니 모달 상태 전역 연동
  const [cartItems, setCartItems] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 로그인 상태 및 유저 프로필 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // 히어로 섹션과 구매유도 섹션 간의 인센스 캔 동기화 상태
  const [selectedPurchaseCan, setSelectedPurchaseCan] = useState(0);
  
  // 커스텀 장바구니 확인 팝업 상태
  const [showCartConfirm, setShowCartConfirm] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState(null);

  const incenseCans = [
    { name: 'PALO SANTO', icon: '🪵', color: '#E5A93B', desc: '신성한 정화의 황금빛 야생 나무 향' },
    { name: 'SMOKED SANDALWOOD', icon: '🔥', color: '#FF6B35', desc: '포근하고 무거운 숲속 모닥불 잔향' },
    { name: 'WHITE SAGE', icon: '🌿', color: '#65A30D', desc: '잡내를 씻어내는 싱그러운 풀빛 새벽 향' },
    { name: 'BLACK PATCHOULI', icon: '🔮', color: '#8B5CF6', desc: '밤새 이국적으로 번지는 다크 머스크 향' }
  ];

  // 장바구니 아이템 추가 (중복 상품 수량 통합 적용)
  const addToCart = (item) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(prevItem => 
        prevItem.option === item.option && prevItem.canName === item.canName
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += (item.quantity || 1);
        return updated;
      } else {
        return [...prev, { ...item, cartId: Date.now(), quantity: item.quantity || 1 }];
      }
    });
  };

  // 장바구니 아이템 수량 조절 핸들러 (1 미만으로 내려가지 않도록 잠금)
  const updateCartQuantity = (cartId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  const removeFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // 로그인 및 로그아웃 완료 핸들러
  const handleLoginSuccess = (profile) => {
    setIsLoggedIn(true);
    setUserProfile(profile);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
  };

  // 히어로 섹션에서 바로구매를 눌렀을 때의 연동 핸들러
  const handleHeroPurchase = (canIndex) => {
    // 1. 구매유도 섹션의 선택 캔 동기화
    setSelectedPurchaseCan(canIndex);
    
    // 2. 구매유도 섹션으로 부드러운 스크롤 스무스 이동
    const purchaseSection = document.getElementById('purchase');
    if (purchaseSection) {
      purchaseSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // 3. 850ms의 자연스러운 스크롤 완료 대기 시간 후 팝업 기동
    setTimeout(() => {
      setPendingCartItem({
        canIndex: canIndex
      });
      setShowCartConfirm(true);
    }, 850);
  };

  // 장바구니 담기 승인 핸들러
  const handleConfirmAddToCart = () => {
    if (!pendingCartItem) return;

    const targetCan = incenseCans[pendingCartItem.canIndex];
    
    // 실제 장바구니에 아이템 주입
    addToCart({
      option: 'bundle',
      canIcon: targetCan.icon,
      canName: targetCan.name.split(' ')[0]
    });

    // 상태 리셋 및 팝업 폐쇄
    setShowCartConfirm(false);
    setPendingCartItem(null);

    // 슬라이더 드로어 열어주어 입체적인 성취감 제공!
    setIsCartOpen(true);
  };

  // 무한 피어오르는 전역 연기 입자 (25개) 생성용 데이터
  const [smokeParticles, setSmokeParticles] = useState([]);

  useEffect(() => {
    // 25개의 연기 파티클에 무작위 좌표, 크기, 딜레이 부여
    const particles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 95}%`,
      size: `${50 + Math.random() * 120}px`,
      delay: `${Math.random() * -15}s`, // 음수 딜레이로 첫 로딩 시 바로 여러 고도에 퍼지게 연출
      duration: `${10 + Math.random() * 8}s`
    }));
    setSmokeParticles(particles);
  }, []);

  useEffect(() => {
    const handleGlobalScroll = () => {
      // 문서 전체 높이 대비 현재 스크롤 위치 비율 산출 (0 ~ 1)
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight > 0) {
        const progress = scrollTop / docHeight;
        setScrollProgress(progress);

        // 바닥에서 20px 이하로 남았을 때 끝에 도달한 것으로 정확히 감지
        if (docHeight - scrollTop <= 20) {
          setIsAtBottom(true);
        } else {
          setIsAtBottom(false);
        }
      }
    };

    window.addEventListener('scroll', handleGlobalScroll, { passive: true });
    handleGlobalScroll(); // 초기 실행
    return () => window.removeEventListener('scroll', handleGlobalScroll);
  }, []);

  return (
    <>
      {/* 1. 아날로그 미세 감성 그레인 노이즈 오버레이 */}
      <div className="grain-overlay" />

      {/* 전역 고정 스크롤 인디케이터 (우하단 항상 표시, 바닥 도달 시 페이드아웃) */}
      <div className={`scroll-indicator ${isAtBottom ? 'is-bottom' : ''}`}>
        <span className="scroll-text">DOWN TO BURN</span>
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
      </div>

      {/* 2. 전역 무한 상승 연기 레이어 (랜딩페이지 끝까지 연기가 흐르는 연출) */}
      <div className="global-smoke-container">
        {smokeParticles.map((particle) => (
          <div
            key={particle.id}
            className="rising-smoke-particle"
            style={{
              left: particle.left,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay,
              animationDuration: particle.duration
            }}
          />
        ))}
      </div>

      {/* 3. 활활 타오르는 화염 마우스 커서 */}
      <CustomCursor />

      {/* 4. 상단 고정 네비게이션 헤더 */}
      <Header 
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
        onCartOpen={() => setIsCartOpen(true)} 
        onLoginOpen={() => setIsLoginOpen(true)} 
        isLoggedIn={isLoggedIn}
        userProfile={userProfile}
        onLogout={handleLogout}
      />

      {/* 5. 섹션들 순차 레이아웃 */}
      <div className="landing-page-wrap">
        
        {/* SECTION 1: 히어로 섹션 (점화식) */}
        <div id="hero">
          <HeroSection 
            scrollProgress={scrollProgress} 
            isIgnited={ignitedHero} 
            onIgnite={() => setIgnitedHero(true)} 
            cartCount={cartItems.length}
            onCartOpen={() => setIsCartOpen(true)}
            onLoginOpen={() => setIsLoginOpen(true)}
            onHeroPurchase={handleHeroPurchase}
          />
        </div>

        {/* SECTION 1.5: 묶음 할인 결제 유도 섹션 (점화식) */}
        <div id="purchase">
          <PurchaseSection 
            isIgnited={ignitedPurchase} 
            onIgnite={(val) => setIgnitedPurchase(val)} 
            addToCart={addToCart}
            selectedCan={selectedPurchaseCan}
            setSelectedCan={setSelectedPurchaseCan}
          />
        </div>

        {/* SECTION 2: 향의 지속성 (점화식) */}
        <div id="scent">
          <ScentSection 
            isIgnited={ignitedScent} 
            onIgnite={(val) => setIgnitedScent(val)} 
          />
        </div>

        {/* SECTION 3: 시각적 반전 (점화식) */}
        <div id="reveal">
          <RevealSection 
            isIgnited={ignitedReveal} 
            onIgnite={(val) => setIgnitedReveal(val)} 
          />
        </div>

        {/* SECTION 4: 오브제 가치 및 종장 (점화식) */}
        <div id="epilogue">
          <EpilogueSection 
            isIgnited={ignitedEpilogue} 
            onIgnite={(val) => setIgnitedEpilogue(val)} 
          />
        </div>
        
      </div>

      {/* 6. 로그인 오버레이 3D 모달 */}
      <LoginOverlay 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 7. 우측 슬라이드인 장바구니 드로어 */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
        onRemoveItem={removeFromCart} 
        onUpdateQuantity={updateCartQuantity}
        onClearCart={clearCart}
      />

      {/* 8. 몽환적 커스텀 장바구니 담기 확인 모달 */}
      <CartConfirmModal 
        isOpen={showCartConfirm}
        onClose={() => {
          setShowCartConfirm(false);
          setPendingCartItem(null);
        }}
        onConfirm={handleConfirmAddToCart}
        itemName={pendingCartItem ? incenseCans[pendingCartItem.canIndex].name : ''}
        itemColor={pendingCartItem ? incenseCans[pendingCartItem.canIndex].color : '#fff'}
        itemIcon={pendingCartItem ? incenseCans[pendingCartItem.canIndex].icon : ''}
        itemDesc={pendingCartItem ? incenseCans[pendingCartItem.canIndex].desc : ''}
      />
    </>
  );
}
