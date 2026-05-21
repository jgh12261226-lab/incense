import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Flame, Droplet, Layers } from 'lucide-react';
import './ScentSection.css';

export default function ScentSection({ isIgnited, onIgnite }) {
  const [activePage, setActivePage] = useState(1);
  const [leaf1Flipped, setLeaf1Flipped] = useState(false);
  const [leaf2Flipped, setLeaf2Flipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animateChips, setAnimateChips] = useState(false);
  const [hasScrolledIn, setHasScrolledIn] = useState(false);
  const autoFlipTriggered = useRef(false);
  const sectionRef = useRef(null);

  // activePage 및 isAnimating의 최신 상태를 IntersectionObserver 내 타이머가 올바르게 참조하게 하기 위한 Ref
  const activePageRef = useRef(activePage);
  const isAnimatingRef = useRef(isAnimating);

  useEffect(() => {
    activePageRef.current = activePage;
  }, [activePage]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateChips(true);
          
          // 최초 화면 스크롤 진입 시: 책이 자동으로 1페이지 -> 2페이지로 펼쳐지는 웰컴 플립 시뮬레이션
          if (!autoFlipTriggered.current) {
            autoFlipTriggered.current = true;
            setHasScrolledIn(true);
            setTimeout(() => {
              if (activePageRef.current === 1 && !isAnimatingRef.current) {
                handlePageChange(2);
              }
            }, 800); // 뷰포트에 도달하고 800ms 뒤 정면 3D 셋업이 완료될 때 자연스럽게 펼쳐짐
          }
        } else {
          setAnimateChips(false);
        }
        if (onIgnite) {
          onIgnite(entry.isIntersecting);
        }
      },
      {
        rootMargin: '-30% 0px -30% 0px',
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

  // 2단 프리미엄 북플립 심플 알고리즘
  const handlePageChange = (targetPage) => {
    if (activePage === targetPage || isAnimating) return;

    setIsAnimating(true);
    setActivePage(targetPage);

    // 1쪽 ➔ 2쪽 이동 (Leaf 1만 엎어짐)
    if (activePage === 1 && targetPage === 2) {
      setLeaf1Flipped(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
    // 2쪽 ➔ 1쪽 역행 (Leaf 1 복귀)
    else if (activePage === 2 && targetPage === 1) {
      setLeaf1Flipped(false);
      setTimeout(() => setIsAnimating(false), 1000);
    }
    // 2쪽 ➔ 3쪽 이동 (Leaf 2 엎어짐)
    else if (activePage === 2 && targetPage === 3) {
      setLeaf2Flipped(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
    // 3쪽 ➔ 2쪽 역행 (Leaf 2 복귀)
    else if (activePage === 3 && targetPage === 2) {
      setLeaf2Flipped(false);
      setTimeout(() => setIsAnimating(false), 1000);
    }
    // 1쪽 ➔ 3쪽 다중 플립 점프 (1 엎어지고 시간차 두고 2 엎어짐)
    else if (activePage === 1 && targetPage === 3) {
      setLeaf1Flipped(true);
      setTimeout(() => setLeaf2Flipped(true), 150);
      setTimeout(() => setIsAnimating(false), 1150);
    }
    // 3쪽 ➔ 1쪽 다중 플립 점프 (2 복귀하고 시간차 두고 1 복귀)
    else if (activePage === 3 && targetPage === 1) {
      setLeaf2Flipped(false);
      setTimeout(() => setLeaf1Flipped(false), 150);
      setTimeout(() => setIsAnimating(false), 1150);
    }
  };


  const scentNotes = [
    { name: 'TOP NOTE', scent: 'Wild Cardamom & Juniper', desc: '코끝을 톡 쏘는 알싸한 에스닉 진저와 침엽수의 맑은 아지랑이 연기', color: '#ff8a5b' },
    { name: 'HEART NOTE', scent: 'Smoked Sandalwood & Cedar', desc: '연기 속에서 부드럽게 타오르는 묵직하고 포근한 깊은 백단향', color: '#e5a93b' },
    { name: 'BASE NOTE', scent: 'Aged Patchouli & Myrrh', desc: '향이 다 꺼진 뒤 재 아래 아스라이 내려앉는 달콤하고 신비로운 잔향', color: '#c85a32' },
  ];

  return (
    <section className="scent-section" ref={sectionRef}>
      <div className="scent-container">

        {/* 공통 가로 분할 헤더 (03번 향기 섹션) */}
        <div className="section-header-row">
          <div className="header-left">
            <span className="section-badge">
              <span className="badge-num">03</span>
              <span className="badge-divider">/</span>
              <span className="badge-text">DEEP SCENT AFTERGLOW</span>
            </span>
          </div>
          <div className="header-right">
            <h2 className="goblin-text section-title-unified">
              연기가 사라진 다음날 아침까지,<br />
              그날의 <span className="accent-text">잔향</span>은 방에 남습니다.
            </h2>
            <p className="section-desc-main">
              천연 원료의 섬세한 블렌딩이 공기 중에 오랫동안 포근하게 내려앉는 놀라운 시간적 경험.
            </p>
            <p className="section-desc-sub">
              태울 때만 찌르는 인공 향이 아닙니다. 탑, 하트, 베이스 노트로 서서히 피어올라 다음 날 아침 문을 열었을 때 문득 느껴지는 묵직하고 따스한 여운을 만끽해 보세요.
            </p>
          </div>
        </div>

        {/* 1. 좌측 영역: 4단 흩날림 3D 원근 북플립 뷰포트 */}
        <div className="scent-body-grid">
        <div className={`book-flip-viewport ${animateChips ? 'scrolled-in' : ''}`}>
          <div className="open-book-3d">
            
            {/* 책등 중앙 힌지 레이어 (가죽/황동 질감) */}
            <div className="book-spine-hinge"></div>
            
            {/* 고정 왼쪽 바닥 페이지 (책의 왼쪽 커버 판) */}
            <div className="page left-base">
              <div className="page-inner">
                <div className="page-header-wrap">
                  <span className="page-tag-label font-mono">CANTLE ESSENCE</span>
                  <h3 className="page-brand">THE SCENTS</h3>
                </div>
                <div className="vintage-spine-emblem">
                  <div className="emblem-circle">
                    <Sparkles size={32} className="emblem-spark animate-pulse" />
                  </div>
                </div>
                <p className="page-hint font-mono">“영원처럼 묵직하게 남기를.”</p>
              </div>
            </div>

            {/* 고정 오른쪽 바닥 페이지 (책의 오른쪽 커버 판) */}
            <div className="page right-base">
              <div className="page-inner">
                <span className="page-number font-mono">FIN</span>
                <div className="scent-stamp font-mono">AFTERGLOW</div>
                <div className="burning-time font-mono">
                  그날의 잔향은 온전히 공간에 스며들어 다음날 아침까지 은은히 머무릅니다.
                </div>
              </div>
            </div>

            {/* 물리 책장 Leaf 1 (앞면: 01. TOP NOTE, 뒷면: 02. HEART NOTE) */}
            <div className={`page leaf-layer leaf-1 ${leaf1Flipped ? 'flipped-active' : ''}`}>
              {/* 앞면: 01. TOP NOTE */}
              <div className="page-face page-front">
                <div className="page-inner">
                  <div className="page-header-wrap">
                    <span className="page-tag-label font-mono">TOP NOTE</span>
                    <h3 className="page-brand">WILD CARDAMOM</h3>
                  </div>
                  
                  {/* TOP NOTE 가변 선화 일러스트 */}
                  <div className="illust-frame top-note-illust">
                    <div className="cardamom-seed"></div>
                    <div className="pine-needle-line1"></div>
                    <div className="pine-needle-line2"></div>
                    <div className="ether-smoke-ripple animate-ping"></div>
                  </div>

                  <div className="page-footer-line">
                    <span className="page-number font-mono">01</span>
                    <span className="page-hint font-mono">WILD FOREST INCEPTION</span>
                  </div>
                </div>
              </div>
              
              {/* 뒷면: 02. HEART NOTE */}
              <div className="page-face page-back">
                <div className="page-inner">
                  <div className="page-header-wrap">
                    <span className="page-tag-label font-mono">HEART NOTE</span>
                    <h3 className="page-brand">SMOKED SANDALWOOD</h3>
                  </div>
                  
                  {/* HEART NOTE 가변 선화 일러스트 */}
                  <div className="illust-frame heart-note-illust">
                    <div className="bonfire-ember-wrap">
                      <Flame size={44} className="bonfire-glow-icon" />
                    </div>
                    <div className="wood-log-base"></div>
                    <div className="heat-wave-line"></div>
                  </div>

                  <div className="page-footer-line">
                    <span className="page-number font-mono">02</span>
                    <span className="page-hint font-mono">DEEP WOODEN CORE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 물리 책장 Leaf 2 (앞면: 03. BASE NOTE, 뒷면: 04. EPILOGUE) */}
            <div className={`page leaf-layer leaf-2 ${leaf2Flipped ? 'flipped-active' : ''}`}>
              {/* 앞면: 03. BASE NOTE */}
              <div className="page-face page-front">
                <div className="page-inner">
                  <div className="page-header-wrap">
                    <span className="page-tag-label font-mono">BASE NOTE</span>
                    <h3 className="page-brand">AGED PATCHOULI</h3>
                  </div>
                  
                  {/* BASE NOTE 가변 선화 일러스트 */}
                  <div className="illust-frame base-note-illust">
                    <div className="ash-pile-base"></div>
                    <div className="magical-myrrh-drop-wrap">
                      <Droplet size={24} className="myrrh-drop-icon animate-bounce" />
                    </div>
                    <div className="ground-line"></div>
                  </div>

                  <div className="page-footer-line">
                    <span className="page-number font-mono">03</span>
                    <span className="page-hint font-mono">FOREVER RESIDUE SOUL</span>
                  </div>
                </div>
              </div>
              
              {/* 뒷면: 04. EPILOGUE */}
              <div className="page-face page-back">
                <div className="page-inner">
                  <div className="page-header-wrap">
                    <span className="page-tag-label font-mono">EPILOGUE</span>
                    <h3 className="page-brand">THE ENDING SMOKE</h3>
                  </div>
                  
                  {/* EPILOGUE 가변 선화 일러스트 */}
                  <div className="illust-frame epilogue-illust">
                    <div className="mystic-smoke-swirl"></div>
                    <div className="sparkle-particles">
                      <Sparkles size={16} className="particle-1 animate-pulse" />
                      <Sparkles size={20} className="particle-2 animate-bounce" />
                    </div>
                  </div>

                  <div className="page-footer-line">
                    <span className="page-number font-mono">04</span>
                    <span className="page-hint font-mono">SILENT SILHOUETTE</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 2. 우측 영역: 그리드 & 향기 칩 (클릭 가능한 인터랙티브 버튼) */}
        <div className={`scent-info-panel ${animateChips ? 'panel-in' : ''}`}>
          <div className="scent-notes-grid">
            {scentNotes.map((note, index) => {
              const pageIdx = index + 1;
              const isActive = activePage === pageIdx;
              return (
                <button 
                  key={index} 
                  className={`scent-chip-card-btn ${isActive ? 'active-chip' : ''}`}
                  style={{ '--accent-color': note.color, '--delay': `${index * 0.15}s` }}
                  onClick={() => handlePageChange(pageIdx)}
                  data-scent-color={note.color}
                  aria-label={`${note.name} ${note.scent} 3D 페이지로 책장 넘기기`}
                >
                  <div className="scent-chip-balloon">
                    <div className="chip-header-line">
                      <span className="chip-note-tag font-mono">{note.name}</span>
                      {isActive && <span className="active-glow-dot font-mono">ACTIVE PAGE</span>}
                    </div>
                    <h3 className="chip-scent-name">{note.scent}</h3>
                    <p className="chip-scent-desc">{note.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        </div>{/* /.scent-body-grid */}
      </div>
    </section>
  );
}

