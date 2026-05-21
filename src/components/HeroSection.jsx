import React, { useEffect, useState, useRef } from 'react';
import { Flame, Bed, Sparkles } from 'lucide-react';
import './HeroSection.css';
import heroWitchImg from '../assets/witch.jpeg';

export default function HeroSection({ scrollProgress, isIgnited, onIgnite, onHeroPurchase }) {
  const [jiggleActive, setJiggleActive] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isStickInserted, setIsStickInserted] = useState(false);
  const [isStickBurning, setIsStickBurning] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // 연속 클릭 시 타이머가 중첩되어 모션이 뒤틀리는 비동기 레이스 컨디션을 방지하기 위한 레퍼런스
  const insertTimerRef = useRef(null);
  const burnTimerRef = useRef(null);
  const sectionRef = useRef(null);
  const cabinetRef = useRef(null);

  const clearTimers = () => {
    if (insertTimerRef.current) clearTimeout(insertTimerRef.current);
    if (burnTimerRef.current) clearTimeout(burnTimerRef.current);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setJiggleActive(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // 화면 스크롤 시 섹션이 뷰포트 중앙에 도달하거나 첫 진입 시 자동으로 점화식(onIgnite) 트리거
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isIgnited) {
          if (onIgnite) {
            onIgnite();
          }
        }
      },
      {
        rootMargin: '-25% 0px -25% 0px', // 화면 위아래 25% 영역을 제외한 중앙 부근 도달 시 발동
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
  }, [isIgnited, onIgnite]);

  // 보관함 문이 닫힐 때(isVaultOpen === false) 내부 선택 및 점화 상태를 반응형으로 확실히 리셋
  useEffect(() => {
    if (!isVaultOpen) {
      clearTimers();
      setSelectedItem(null);
      setIsStickInserted(false);
      setIsStickBurning(false);
    }
    return () => clearTimers(); // 언마운트 시 타이머 클린업
  }, [isVaultOpen]);

  const handleMouseMove = (e) => {
    if (!cabinetRef.current) return;
    const rect = cabinetRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // -0.5 ~ 0.5 범위로 마우스 비율 계산
    const xPercent = (x / rect.width) - 0.5;
    const yPercent = (y / rect.height) - 0.5;
    
    setTilt({ x: xPercent, y: yPercent });
  };

  const handleCabinetMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsVaultOpen(false);
  };

  const handleTinClick = (idx) => {
    // 새로 캔을 클릭하면 기존 가동 중인 비동기 타이머를 즉시 취소하여 충돌 방지
    clearTimers();

    if (selectedItem === idx) {
      setSelectedItem(null);
      setIsStickInserted(false);
      setIsStickBurning(false);
    } else {
      setSelectedItem(idx);
      setIsStickInserted(false);
      setIsStickBurning(false);
      
      // 스텝 바이 스텝 꽂히고 타오르는 모션 개시
      insertTimerRef.current = setTimeout(() => {
        setIsStickInserted(true);
        burnTimerRef.current = setTimeout(() => {
          setIsStickBurning(true);
        }, 700);
      }, 80);
    }
  };

  const incenseItems = [
    {
      name: 'PALO SANTO',
      shortName: 'PALO',
      icon: '✨', /* 🪵 대신 모든 OS에서 절대 깨지지 않는 정화의 반짝임(✨) 이모지로 수정 */
      color: '#E5A93B',
      desc: '칠레 야생의 신성한 나무 향. 깊은 긴장을 풀어주며, 마음속 부정적인 기운을 맑게 태워 정화해 줍니다.',
      mood: '명상, 불안 해소, 정신 맑음'
    },
    {
      name: 'SMOKED SANDALWOOD',
      shortName: 'SANDAL',
      icon: '🔥',
      color: '#FF6B35',
      desc: '깊은 숲속 무겁고 포근한 백단향. 부드러운 우디 향이 방 전체에 클래식하고 고급스러운 잔향으로 오래 맴돕니다.',
      mood: '집중력 강화, 심신 안정, 차분한 밤'
    },
    {
      name: 'WHITE SAGE',
      shortName: 'SAGE',
      icon: '🌿',
      color: '#65A30D',
      desc: '천연 화이트 세이지 잎의 파스텔톤 풀 향. 공간의 잡냄새와 나쁜 에너지를 깨끗하게 없애주어 상쾌한 아침을 엽니다.',
      mood: '공간 탈취, 리프레시, 정화'
    },
    {
      name: 'BLACK PATCHOULI',
      shortName: 'PATCHO',
      icon: '🔮',
      color: '#8B5CF6',
      desc: '달콤 쌉싸름한 흙내음과 다크한 머스크 조합. 밤새 아스라이 깔리는 신비롭고 이국적인 동양의 향취를 자아냅니다.',
      mood: '이국적인 무드, 로맨틱, 깊은 수면'
    }
  ];

  return (
    <section className="hero-section" ref={sectionRef}>
      {/* 가려져 있던 검은 안개막 (불이 붙어야 걷힘) */}
      <div className={`section-dark-veil ${isIgnited ? 'ignited' : ''}`} />

      {/* 신규: 캔 선택 시 룸 전체를 물들이는 동적 앰비언트 글로우 백라이트 (쿼드 앰비언트) */}
      <div 
        className="hero-theme-glow glow-bottom-right" 
        style={{ 
          color: selectedItem !== null ? incenseItems[selectedItem].color : 'rgba(255, 107, 53, 0.5)',
          opacity: selectedItem !== null ? 0.35 : 0.08
        }}
      />
      <div 
        className="hero-theme-glow glow-top-right" 
        style={{ 
          color: selectedItem !== null ? incenseItems[selectedItem].color : 'rgba(255, 107, 53, 0.5)',
          opacity: selectedItem !== null ? 0.25 : 0.05
        }}
      />
      <div 
        className="hero-theme-glow glow-middle-left" 
        style={{ 
          color: selectedItem !== null ? incenseItems[selectedItem].color : 'rgba(255, 107, 53, 0.5)',
          opacity: selectedItem !== null ? 0.3 : 0.06
        }}
      />

      <div className="hero-grid-bg"></div>

      <div className="hero-content">
        {/* 고블린풍 볼드 헤드라인 */}
        {/* 고블린풍 볼드 헤드라인 (h1 단어 개별 stagger 찌글 모션 적용 및 p 태그 분리) */}
        {/* 공통 가로 분할 헤더 (01번 히어로 섹션) */}
        <div className="section-header-row" style={{ marginBottom: '45px' }}>
          <div className="header-left">
            <span className="section-badge">
              <span className="badge-num">01</span>
              <span className="badge-divider">/</span>
              <span className="badge-text">BURN TO CHILL ORIGIN</span>
            </span>
          </div>
          <div className="header-right">
            <h1 className={`hero-title goblin-text section-title-unified ${jiggleActive ? 'goblin-item-active' : ''}`}>
              번아웃(BURN)된 하루를<br />
              차분하게 <span className="accent-text">식힐(CHILL)</span> 시간.
            </h1>
            <p className="section-desc-main">
              마음의 불을 지피고, 일상의 무거운 피로를 은은히 가라앉히는 감각의 서막.
            </p>
            <p className="section-desc-sub">
              당신의 공간에 아날로그적인 온기를 더해, 바쁜 머릿속 잡념을 밀어내고 고요한 성찰을 선사하는 BURN TO CHILL의 리추얼 컬렉션입니다.
            </p>
          </div>
        </div>

        {/* 3D 양문형 펼침 게이트와 보관고 조립체 (호버 기반 개폐) */}
        <div 
          ref={cabinetRef}
          className={`vault-cabinet-container ${isVaultOpen ? 'vault-open' : ''} flat-frame`}
          style={{ 
            '--hero-img': `url(${heroWitchImg})`,
            '--selected-glow-color': selectedItem !== null ? incenseItems[selectedItem].color : '',
            '--tilt-x': `${tilt.y * -14}deg`,
            '--tilt-y': `${tilt.x * 14}deg`,
            '--tilt-px-x': `${tilt.x * -16}px`,
            '--tilt-px-y': `${tilt.y * -16}px`
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => {
            setIsVaultOpen(true);
            if (!isIgnited && onIgnite) {
              onIgnite();
            }
          }}
          onMouseLeave={handleCabinetMouseLeave}
        >
          
          {/* 1. 내부 인센스 보관함 Grid (문이 펼쳐져야 드러남) */}
          <div className="vault-inside-grid">
            <div className="vault-inside-header">
              <span className="vault-stamp">PREMIUM TINS</span>
              <h3 className="vault-title">SECRET ARY CHIEF VAULT</h3>
              <p className="vault-desc">보관함 속 갖가지 인센스 캔을 눌러서 깨워보세요.</p>
            </div>
            
            <div className="vault-items-row">
              {incenseItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`vault-item-tin ${selectedItem === idx ? 'tin-selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTinClick(idx);
                  }}
                  data-scent-color={item.color}
                  style={{ 
                    '--tin-color': item.color, 
                    '--item-idx': idx 
                  }}
                >
                  {/* 통통 튀는 캔 몸체 */}
                  <div className="tin-can-body">
                    {/* 뚜껑 오브제 */}
                    <div className="tin-can-cap"></div>
                    
                    {/* 신규: 캔이 열리고 꽂히는 인센스 스틱 */}
                    {selectedItem === idx && (
                      <div className={`tin-incense-stick-wrap ${isStickInserted ? 'stick-inserted' : ''} ${isStickBurning ? 'stick-burning' : ''}`}>
                        <div className="tin-incense-stick">
                          {/* 타들어 가는 빨갛고 노란 불꽃 끝 */}
                          <div className="incense-burning-ember"></div>
                          <div className="incense-burning-glow"></div>
                        </div>
                      </div>
                    )}

                    <div className="tin-can-label">
                      <span className="tin-icon">{item.icon}</span>
                      <span className="tin-label-text">{item.shortName}</span>
                    </div>

                    {/* 연기 아지랑이 효과 (불이 붙은 뒤 활성화) */}
                    <div className={`tin-smoke-sparks ${selectedItem === idx && isStickBurning ? 'smoke-active' : ''}`}>
                      <span className="smoke-puff p1"></span>
                      <span className="smoke-puff p2"></span>
                      <span className="smoke-puff p3"></span>
                    </div>
                  </div>
                  <span className="tin-can-name">{item.name}</span>

                  {/* 캔 선택 시 캔 이름 아래에 나타나는 프리미엄 바로구매 버튼 */}
                  {selectedItem === idx && (
                    <button 
                      className="tin-buy-button fade-in-up"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onHeroPurchase) {
                          onHeroPurchase(idx);
                        }
                      }}
                      style={{ '--accent-btn': item.color }}
                    >
                      {/* 첫번째 아이템(PALO SANTO)에는 🪵 이모지 대신 깨지지 않는 정밀 렌더링용 불꽃(Flame) SVG 아이콘 삽입 */}
                      {idx === 0 ? <Flame size={12} className="buy-btn-icon" /> : <span className="buy-btn-icon">{item.icon}</span>} 바로구매
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* 선택된 향의 상세 가이드 카드 (지글링 인 트랜지션) */}
            {selectedItem !== null && (
              <div className="vault-details-board jiggle-in" style={{ borderColor: incenseItems[selectedItem].color }}>
                <div className="board-header">
                  <span className="board-badge" style={{ backgroundColor: incenseItems[selectedItem].color }}>
                    <Sparkles size={11} /> VAULT RECORD
                  </span>
                  <h4>{incenseItems[selectedItem].name}</h4>
                </div>
                <p className="board-desc">{incenseItems[selectedItem].desc}</p>
                <div className="board-mood">
                  <span>효능 및 무드 ─ </span>
                  <strong style={{ color: incenseItems[selectedItem].color }}>{incenseItems[selectedItem].mood}</strong>
                </div>
              </div>
            )}
          </div>

          {/* 2. 전면에 얹어져 3D 스윙 오픈될 이미지 게이트 */}
          <div className="vault-doors-wrapper">
            {/* 좌측 게이트 도어 */}
            <div className="vault-door left-door"></div>

            {/* 우측 게이트 도어 */}
            <div className="vault-door right-door"></div>
          </div>
        </div>


      </div>
    </section>
  );
}

