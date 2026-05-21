import React, { useState, useEffect, useRef } from 'react';
import { Flame, Zap, ShoppingBag, Menu, X, Layers, Package, Feather, Eye, BookOpen, MessageCircle } from 'lucide-react';
import './Header.css';

export default function Header({ cartCount = 0, onCartOpen, onLoginOpen, isLoggedIn, userProfile, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isBadgeBouncing, setIsBadgeBouncing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = ['hero', 'purchase', 'scent', 'reveal', 'epilogue'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cartCount > 0) {
      setIsBadgeBouncing(true);
      const timer = setTimeout(() => {
        setIsBadgeBouncing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'hero', label: 'THE TRIGGER' },
    { id: 'purchase', label: 'BUNDLE PROMO' },
    { id: 'scent', label: 'THE SCENT' },
    { id: 'reveal', label: 'THE HIDDEN' },
    { id: 'epilogue', label: 'LAST SCENE' }
  ];

  // 드롭다운 메뉴 아이템 정의
  const menuItems = [
    { id: 'hero',     label: 'THE TRIGGER',  desc: '히어로 섹션', icon: <Flame size={14} /> },
    { id: 'purchase', label: 'BUNDLE PROMO', desc: '묶음 구매 혜택', icon: <Package size={14} /> },
    { id: 'scent',    label: 'THE SCENT',    desc: '향의 지속성', icon: <Feather size={14} /> },
    { id: 'reveal',   label: 'THE HIDDEN',   desc: '시각적 반전', icon: <Eye size={14} /> },
    { id: 'epilogue', label: 'LAST SCENE',   desc: '브랜드 스토리', icon: <BookOpen size={14} /> },
  ];

  return (
    <header className={`main-header ${isScrolled ? 'sticky-scrolled' : ''}`}>
      <div className="header-container">
        {/* 브랜드 로고 */}
        <a
          href="#hero"
          className="header-logo"
          onClick={(e) => scrollToSection(e, 'hero')}
        >
          <span className="logo-ember">
            <Flame size={20} className="header-logo-icon" />
          </span>
          <span className="logo-text">BURN TO CHILL</span>
        </a>

        {/* 네비게이션 메뉴 */}
        <nav className="header-nav">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-item-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, item.id)}
            >
              {item.label}
              <span className="nav-under-line" />
            </a>
          ))}
        </nav>

        {/* 컨설팅 신청 버튼 */}
        <div className="header-actions">
          <button
            className="custom-order-btn"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('epilogue');
              if (element) {
                const headerOffset = 70;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                
                // 스크롤이 완료되는 시점에 컨설팅 모달 자동 실행 전역 이벤트 발행
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('open-consulting'));
                }, 850);
              }
            }}
          >
            컨설팅 신청 <Zap size={14} className="header-btn-icon" />
          </button>
        </div>
      </div>

      {/* 우측 퀵 액션 영역 (로그인 + 장바구니 + 메뉴) */}
      <div className="header-right-quick-actions">
        {/* 로그인 탭 및 로그아웃 유기적 분기 */}
        {isLoggedIn ? (
          <div className="header-user-status">
            <span className="user-vip-badge font-mono animate-pulse">RITUAL VIP</span>
            <span className="user-welcome-text font-mono" onClick={onLogout} title="클릭하여 로그아웃">
              {userProfile?.name || 'GUEST'}
            </span>
          </div>
        ) : (
          <button
            className="header-login-btn"
            onClick={onLoginOpen}
            aria-label="Open Login"
          >
            LOGIN
            <span className="login-btn-underline" />
          </button>
        )}

        {/* 장바구니 버튼 */}
        <button
          className="header-cart-btn"
          onClick={onCartOpen}
          aria-label="Open Cart"
        >
          <div className="cart-icon-wrapper">
            <ShoppingBag size={18} className="header-cart-icon" />
            {cartCount > 0 && (
              <span className={`cart-badge ${isBadgeBouncing ? 'bounce-pop' : ''}`}>
                {cartCount}
              </span>
            )}
          </div>
        </button>

        {/* 햄버거 메뉴 버튼 */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            className="header-menu-btn"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Open Menu"
          >
            {isMenuOpen ? <X size={17} strokeWidth={2.5} /> : <Menu size={17} strokeWidth={2.5} />}
          </button>

          {/* 드롭다운 메뉴 */}
          {isMenuOpen && (
            <>
              {/* 바깥 클릭 시 닫힘 */}
              <div className="menu-backdrop" onClick={() => setIsMenuOpen(false)} />

              <div className="header-menu-dropdown">
                <span className="menu-section-label">NAVIGATE</span>

                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    className={`menu-dropdown-item ${activeSection === item.id ? 'menu-item-active' : ''}`}
                    onClick={(e) => scrollToSection(e, item.id)}
                  >
                    <span className="menu-item-icon">{item.icon}</span>
                    <span>
                      <span style={{ display: 'block', fontSize: '0.88rem' }}>{item.label}</span>
                      <span style={{ display: 'block', fontSize: '0.68rem', opacity: 0.5, marginTop: '1px' }}>{item.desc}</span>
                    </span>
                  </button>
                ))}

                {isLoggedIn ? (
                  <button
                    className="menu-dropdown-item menu-item-divider"
                    onClick={() => {
                      onLogout?.();
                      setIsMenuOpen(false);
                    }}
                  >
                    <span className="menu-item-icon"><X size={14} /></span>
                    <span>
                      <span style={{ display: 'block', fontSize: '0.88rem' }}>LOGOUT</span>
                      <span style={{ display: 'block', fontSize: '0.68rem', opacity: 0.5, marginTop: '1px' }}>세션 로그아웃</span>
                    </span>
                  </button>
                ) : (
                  <button
                    className="menu-dropdown-item menu-item-divider"
                    onClick={() => {
                      onLoginOpen?.();
                      setIsMenuOpen(false);
                    }}
                  >
                    <span className="menu-item-icon"><MessageCircle size={14} /></span>
                    <span>
                      <span style={{ display: 'block', fontSize: '0.88rem' }}>LOGIN</span>
                      <span style={{ display: 'block', fontSize: '0.68rem', opacity: 0.5, marginTop: '1px' }}>계정 로그인</span>
                    </span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
