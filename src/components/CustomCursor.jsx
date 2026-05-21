import React, { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail1, setTrail1] = useState({ x: 0, y: 0 });
  const [trail2, setTrail2] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [flameWobble, setFlameWobble] = useState(0);
  const [particles, setParticles] = useState([]); // 실시간 연기 입자들

  const requestRef = useRef();
  const particleIdRef = useRef(0);
  
  // 마우스 위치 및 이벤트 헨들러
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };

    const handleMouseLeave = () => {
      setHidden(true);
    };

    const handleMouseDown = () => {
      setClicked(true);
    };

    const handleMouseUp = () => {
      setClicked(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 불꽃 일렁임(wobble) 모션 제어
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame = (frame + 1) % 4;
      setFlameWobble(frame);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // [핵심] 가만히 있든 움직이든 일정 주기로 연기 파티클 생성
  useEffect(() => {
    if (hidden) return;

    const interval = setInterval(() => {
      setParticles((prev) => {
        if (prev.length > 20) return prev; // 슬로우 모션 연기를 차분히 보기 위해 20개 제한 유지

        // [불규칙성 극대화 알고리즘]
        // 50% 확률로 아주 작은 미세 입자(4px~8px), 나머지 50% 확률로 일반 입자(10px~20px) 분출
        const isTiny = Math.random() > 0.5;
        const irregularSize = isTiny 
          ? (Math.random() * 4 + 4) 
          : (Math.random() * 10 + 10);

        const newParticle = {
          id: particleIdRef.current++,
          // 불꽃 끝부분(살짝 위쪽)에서 스폰되도록 조정
          x: position.x + (Math.random() * 4 - 2),
          y: position.y - 18 + (Math.random() * 2 - 1),
          // 느긋하고 차분하게 상승하기 위한 속도 세팅
          vx: Math.random() * 0.4 - 0.2,
          vy: -(Math.random() * 0.35 + 0.35), // 상승 속도 느긋하게 유지
          life: 1.0, // 1.0에서 0으로 수명 감소
          decay: Math.random() * 0.009 + 0.007, // 입자가 작아진 만큼 너무 길지 않게 수명 밸런스 조정
          size: irregularSize, // 불규칙한 사이즈 이식
        };
        return [...prev, newParticle];
      });
    }, 200); // 드문드문 피어오르게 주기를 200ms로 소폭 조정

    return () => clearInterval(interval);
  }, [position, hidden]);

  // 커서 트레일 물리 지연효과 & 연기 파티클 상승 애니메이션 통합 루프
  useEffect(() => {
    const updateMotion = () => {
      // 1. 기존의 화염 꼬리물기(elastic) 딜레이 연출
      setTrail1((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.25,
          y: prev.y + dy * 0.25
        };
      });

      setTrail2((prev) => {
        const dx = trail1.x - prev.x;
        const dy = trail1.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15
        };
      });

      // 2. 솟아오르는 연기 입자들의 수명/크기/위치 변량 처리
      setParticles((prevParticles) =>
        prevParticles
          .map((p) => ({
            ...p,
            // 나른한 기류를 타는 매우 완만한 지그재그 흔들림
            x: p.x + p.vx + Math.sin(p.y * 0.03) * 0.2,
            y: p.y + p.vy,
            life: p.life - p.decay,
            size: p.size + 0.35, // 입자가 작아졌으므로 팽창 스케일도 컴팩트하게 조절
          }))
          .filter((p) => p.life > 0)
      );

      requestRef.current = requestAnimationFrame(updateMotion);
    };

    requestRef.current = requestAnimationFrame(updateMotion);
    return () => cancelAnimationFrame(requestRef.current);
  }, [position, trail1]);

  return (
    <div
      className={`custom-cursor-container ${hidden ? 'cursor-hidden' : ''} ${
        clicked ? 'cursor-clicked' : ''
      }`}
    >
      {/* 몽글몽글 솟아오르는 다이내믹 연기 파티클들 */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="cursor-smoke-particle"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.life * 0.42, // 투명도를 약간 선명하게 0.42로 고정하여 가독성 유지
          }}
        />
      ))}

      {/* 화염 뒤편의 그윽한 주황색 열기 광원 (Flame Glow Back) */}
      <div
        className="cursor-flame-glow"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />

      {/* 뒤따라오는 스모키 연기 (Smoke Tail) */}
      <div
        className="cursor-smoke-trail"
        style={{ left: `${trail2.x}px`, top: `${trail2.y}px` }}
      />

      {/* 타오르는 화염 아지랑이 잔상 (Flame Trail) */}
      <div
        className="cursor-flame-trail"
        style={{ left: `${trail1.x}px`, top: `${trail1.y}px` }}
      />

      {/* 메인 화염 포인터 코어 (Fire Core) */}
      <div
        className={`cursor-fire-core wobble-${flameWobble}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      >
        <div className="flame-inner-yellow"></div>
        <div className="flame-core-blue"></div>
      </div>
    </div>
  );
}
