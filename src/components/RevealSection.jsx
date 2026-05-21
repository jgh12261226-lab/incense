import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Cpu, Flame, Thermometer } from 'lucide-react';
import './RevealSection.css';

export default function RevealSection({ isIgnited, onIgnite }) {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const [burnProgress, setBurnProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !stickyRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;

      const scrolled = -rect.top;
      const maxScroll = containerHeight - windowHeight;

      if (scrolled >= 0 && scrolled <= maxScroll) {
        // 기존 대비 온도가 4.5배 빠르게 치솟도록 초가속 적용 (약 20%만 스크롤해도 100% 도달)
        const progress = Math.min((scrolled / maxScroll) * 4.5, 1);
        setBurnProgress(progress);
      } else if (scrolled < 0) {
        setBurnProgress(0);
      } else {
        setBurnProgress(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 화면 스크롤 시 섹션이 뷰포트 중앙에 도달하면 자동으로 점화식(onIgnite) 트리거
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (onIgnite) {
          onIgnite(entry.isIntersecting);
        }
      },
      {
        rootMargin: '-30% 0px -30% 0px', // 스크롤 시 감지가 잘 되도록 넉넉하게 완화
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [onIgnite]);

  // 실시간 챔버 온도 연산 (24.0°C ~ 480.0°C)
  const currentTemp = (24 + burnProgress * 456).toFixed(1);

  // 시스템 동작 상태 산출
  let systemStatus = 'SYSTEM COLD';
  let statusColor = '#a8a29e';
  if (burnProgress >= 0.1 && burnProgress < 0.4) {
    systemStatus = 'PRE-HEATING';
    statusColor = '#e5a93b';
  } else if (burnProgress >= 0.4 && burnProgress < 0.85) {
    systemStatus = 'THERMAL ACTIVE';
    statusColor = '#ff6b35';
  } else if (burnProgress >= 0.85) {
    systemStatus = 'REVEAL COMPLETED';
    statusColor = '#ef4444';
  }

  // 글씨 선명도 번개 속도 소멸 튜닝 (스크롤 10%에 이미 불투명도 100% 도달, 16%만에 블러 100% 완전 소멸)
  const messageBlur = Math.max(20 - burnProgress * 120, 0);
  const messageOpacity = Math.min(burnProgress * 10, 1);

  // 잉크 깨짐 왜곡 척도 (스크롤 25% 도달 시 정갈하고 고정된 명조체 형태로 완전 고정)
  const distortionScale = Math.max((1 - burnProgress * 4.0) * 75, 0);

  return (
    <div className="reveal-container-scroll" ref={containerRef}>
      <div className="reveal-sticky-viewport" ref={stickyRef}>
        
        {/* 전체 다크 시네마틱 노이즈 오버레이 */}
        <div className="darkness-overlay" style={{ opacity: Math.min(0.85 + burnProgress * 0.1, 0.95) }}></div>

        {/* 인센스 열원 글로우 백라이트 */}
        <div 
          className="incense-burn-glow"
          style={{
            transform: `translate(-50%, -50%) scale(${1 + burnProgress * 0.7})`,
            opacity: 0.2 + burnProgress * 0.8
          }}
        ></div>

        <div className="reveal-content-wrap">
          
          {/* 리뉴얼된 프리미엄 테크 헤더 */}
          <div className="reveal-text-header">
            <span className="reveal-badge">
              <span className="badge-num">04</span>
              <span className="badge-divider">/</span>
              <span className="badge-text">THERMAL SENSING & REVEAL</span>
            </span>
            <h2 className="goblin-text reveal-title">
              열감 반응 그을음 속에,<br />
              <span className="accent-text">숨겨진 진심</span>이 피어납니다.
            </h2>
            <p className="reveal-description">
              스펙트럼 센서와 만났을 때, 가려져 있던 비밀의 메시지가 물결치는 잉크처럼 서서히 모양을 잡으며 드러납니다.
            </p>
          </div>

          <div className="thermal-simulation-grid">
            
            {/* 좌측 사이버네틱 아날로그 HUD 모듈 */}
            <div className="thermal-scanner-hud">
              <div className="hud-header">
                <Cpu size={16} className="hud-icon animate-pulse" />
                <span className="hud-title font-mono">THERMAL SCAN SYSTEM v1.07</span>
              </div>

              <div className="hud-temp-display">
                <div className="temp-label-wrap">
                  <span className="temp-label">CHAMBER TEMPERATURE</span>
                  <Thermometer size={14} className="temp-icon" />
                </div>
                <div className="temp-number font-mono">
                  {currentTemp}<span className="temp-unit">°C</span>
                </div>
              </div>

              {/* 스캔 진행도 게이지바 */}
              <div className="hud-progress-section">
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill"
                    style={{ width: `${burnProgress * 100}%` }}
                  ></div>
                </div>
                <div className="progress-value-wrap font-mono">
                  <span>SCANNING PROGRESS</span>
                  <span>{(burnProgress * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* 실시간 상태 시그널 */}
              <div className="hud-status-box">
                <span className="status-label">MODULE STATUS</span>
                <div className="status-indicator-wrap">
                  <span 
                    className="status-dot animate-ping"
                    style={{ backgroundColor: statusColor }}
                  ></span>
                  <span 
                    className="status-text font-mono"
                    style={{ color: statusColor }}
                  >
                    {systemStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* 우측 수제 세라믹 열감 반응 챔버 플레이트 */}
            <div className="chamber-thermal-plate">
              <div className="chamber-plate-rim">
                
                {/* 열감 스펙트럼 백그라운드 (스크롤에 따라 푸른색에서 강렬한 마젠타/오렌지로 물듦) */}
                <div 
                  className="thermal-camera-overlay"
                  style={{
                    opacity: 0.15 + burnProgress * 0.85,
                    background: `radial-gradient(circle, rgba(239, 68, 68, ${0.4 * burnProgress}) 0%, rgba(139, 92, 246, ${0.2 * burnProgress}) 50%, rgba(9, 8, 7, 0.9) 100%)`
                  }}
                ></div>

                {/* 중앙 센서 열 코어 발광체 */}
                <div className="chamber-plate-center">
                  <div 
                    className="thermal-active-core"
                    style={{
                      transform: `translate(-50%, -50%) scale(${0.8 + burnProgress * 0.8})`,
                      boxShadow: `0 0 ${40 + burnProgress * 60}px rgba(255, 107, 53, ${0.2 + burnProgress * 0.6})`
                    }}
                  >
                    <Flame size={20} className="thermal-flame-icon" />
                  </div>
                </div>

                {/* [메시지 레이어] SVG 필터를 활용한 고성능 잉크 번짐 결합 이펙트 */}
                <div 
                  className="ink-bleeding-message-layer"
                  style={{
                    filter: `url(#ink-bleed-filter) blur(${messageBlur}px)`,
                    opacity: messageOpacity,
                    pointerEvents: burnProgress >= 0.8 ? 'auto' : 'none'
                  }}
                >
                  <div className="ink-message-content">
                    <span className="message-badge font-mono">
                      <span className="badge-num">04</span>
                      <span className="badge-divider">/</span>
                      <span className="badge-text">SENTIMENT VISUALIZATION</span>
                    </span>
                    <h3 className="message-main font-mono">
                      “우리의 시간은 향처럼 은은하게,<br />
                      영원처럼 묵직하게 남기를.”
                    </h3>
                    <p className="message-author font-mono">- 너를 생각하며 지핀 잔향 -</p>
                  </div>
                </div>

                {/* 스크롤 가이드 */}
                {burnProgress < 0.2 && (
                  <div className="scroll-indicator-guide font-mono">
                    <span className="arrow-down">↓</span> SCROLL DOWN TO HEAT CHAMBER
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 잉크의 부드러운 일렁임과 번짐 왜곡을 조율하는 고정밀 인라인 SVG 필터 */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="ink-bleed-filter">
            {/* 노이즈 성분의 주파수를 스크롤에 동적으로 연결하여, 스크롤될 때 잉크가 파도치며 정돈되는 효과 부여 */}
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.02" 
              numOctaves="3" 
              result="noise" 
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale={distortionScale} 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
