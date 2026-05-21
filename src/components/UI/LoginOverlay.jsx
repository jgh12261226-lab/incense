import React, { useState, useEffect } from 'react';
import { Flame, X, Lock, Mail, ArrowLeft, Sparkles } from 'lucide-react';
import './LoginOverlay.css';

export default function LoginOverlay({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isJiggling, setIsJiggling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 모달이 열릴 때 몸체 카드가 귀엽게 튀어 오르는 효과를 극대화
  useEffect(() => {
    if (isOpen) {
      setIsJiggling(true);
      setIsLoading(false);
      setIsSuccess(false);
      const timer = setTimeout(() => setIsJiggling(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);

    // 1.5초 동안 힙하고 웅장한 가상 계정 검증 및 동기화 기동
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        onLoginSuccess?.({
          email: email,
          name: email.split('@')[0].toUpperCase(),
          grade: 'RITUAL VIP'
        });
        setIsSuccess(false);
        onClose();
      }, 1000);
    }, 1500);
  };

  return (
    <div className="login-overlay-portal">
      {/* 백그라운드 블러 차단막 (클릭 시 닫힘) */}
      <div className="login-backdrop-veil" onClick={onClose} />

      {/* 3D 튀는 로그인 메인 카드 */}
      <div className={`login-modal-card ${isJiggling ? 'card-jiggle-pop' : ''}`}>
        
        {/* 닫기 버튼 */}
        <button className="login-modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* 데코용 좌측 상단 불똥 뱃지 */}
        <div className="login-flame-badge">
          <Flame size={14} className="login-badge-icon" />
          <span>MEMBER VAULT</span>
        </div>

        {isLoading ? (
          /* 1. 로그인 연동 대형 로딩 HUD */
          <div className="login-loading-view">
            <div className="login-loader-spinner">
              <Flame size={32} className="login-loader-ember" />
            </div>
            <h3 className="font-mono">DECRYPTING VAULT...</h3>
            <p>캔틀 보관고의 암호화 키를 복호화하는 중입니다.</p>
            <span className="login-hud-step font-mono">STEP 02/03 - SYNCING PROFILE</span>
          </div>
        ) : isSuccess ? (
          /* 2. 로그인 성공 뷰 */
          <div className="login-success-view">
            <div className="login-success-icon-wrap">
              <Sparkles size={36} className="login-success-spark animate-pulse" />
            </div>
            <h3 className="font-mono">VAULT DECRYPTED</h3>
            <p className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', opacity: 0.9 }}>
              <strong>{email.split('@')[0].toUpperCase()} 님</strong>의 전용 보관고가 성공적으로 연동되었습니다.
            </p>
            <span className="login-hud-step font-mono" style={{ color: '#d4af37' }}>RITUAL VIP MEMBER GRANTED</span>
          </div>
        ) : (
          /* 3. 일반 로그인 입력 양식 */
          <>
            <div className="login-card-header">
              <h2 className="goblin-text login-modal-title">
                불씨를 깨워<br />
                <span className="accent-text">로그인</span>하기
              </h2>
              <p className="login-modal-subtitle">
                캔틀 보관고의 전용 멤버십 혜택과 주문 내역을 동기화하세요.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-brutal-form">
              
              {/* 이메일 입력란 */}
              <div className="brutal-input-group">
                <label className="brutal-input-label">
                  <Mail size={12} /> EMAIL ADDRESS
                </label>
                <div className="input-with-icon">
                  <input 
                    type="email" 
                    placeholder="candle@ember.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="brutal-text-input"
                  />
                </div>
              </div>

              {/* 비밀번호 입력란 */}
              <div className="brutal-input-group">
                <label className="brutal-input-label">
                  <Lock size={12} /> PASSWORD
                </label>
                <div className="input-with-icon">
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="brutal-text-input"
                  />
                </div>
              </div>

              {/* 로그인 실행 버튼 (레인보우 네온 글로우) */}
              <button type="submit" className="login-action-brutal-btn">
                <Sparkles size={16} />
                <span>보관고 열고 로그인</span>
              </button>

            </form>

            {/* 하단 돌아가기 버튼 및 도우미 텍스트 */}
            <div className="login-modal-footer">
              <button className="login-back-link-btn" onClick={onClose}>
                <ArrowLeft size={14} />
                <span>메인 페이지로 돌아가기 (CLOSE)</span>
              </button>
              
              <p className="login-signup-prompt">
                아직 계정이 없으신가요? <strong>3초 회원가입</strong>
              </p>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
