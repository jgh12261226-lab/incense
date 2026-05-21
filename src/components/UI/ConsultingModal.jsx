import React, { useState } from 'react';
import { X, Sparkles, Send, Check, Volume2, Package, Sparkle, Download } from 'lucide-react';
import './ConsultingModal.css';

export default function ConsultingModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    mood: 'burnout', // burnout, stress, focus, sleep
    scent: [], // woody, herbal, musk, smoky
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  if (!isOpen) return null;

  const handleMoodSelect = (moodVal) => {
    setFormData(prev => ({ ...prev, mood: moodVal }));
  };

  const handleScentToggle = (scentVal) => {
    setFormData(prev => {
      const exists = prev.scent.includes(scentVal);
      if (exists) {
        return { ...prev, scent: prev.scent.filter(s => s !== scentVal) };
      } else {
        return { ...prev, scent: [...prev.scent, scentVal] };
      }
    });
  };

  // 마우스 무브에 의한 3D 틸트 처리
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - (box.width / 2);
    const y = e.clientY - box.top - (box.height / 2);
    // 최대 12도 회전
    const tiltX = (x / (box.width / 2)) * 12;
    const tiltY = -(y / (box.height / 2)) * 12;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("이름과 연락처를 입력해 주세요.");
      return;
    }

    // 전광석화 같은 3D 처방 카드 발행 모드로 전환
    setIsSubmitted(true);
  };

  // 처방전 수집 및 닫기
  const handlePrescriptionClose = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      mood: 'burnout',
      scent: [],
      message: ''
    });
    onClose();
  };

  // 고민 상태에 따른 동적 처방 매핑 알고리즘
  const getPrescriptionInfo = () => {
    const mood = formData.mood;
    
    const templates = {
      burnout: {
        scentName: 'PALO SANTO',
        emoji: '🪵',
        color: '#E5A93B',
        shadowColor: 'rgba(229, 169, 59, 0.45)',
        quote: '무기력해진 마음에 신성한 정화의 황금빛 안식을.',
        desc: '남미 에콰도르의 황야에서 온 정화의 나무 향이, 공간에 켜켜이 쌓인 무거운 무기력을 태우며 포근한 야생 나무의 온기를 촘촘하게 채워 줍니다.',
        music: 'Ambient Rain Forest & Nature Wave (432Hz)',
        object: '세라믹 솔리드 오벨리스크 인센스 홀더',
        badge: ' 정화와 안식 (PURIFY)'
      },
      stress: {
        scentName: 'SMOKED SANDALWOOD',
        emoji: '🔥',
        color: '#FF6B35',
        shadowColor: 'rgba(255, 107, 53, 0.45)',
        quote: '들끓는 피로와 분노를 차분히 잠재우다.',
        desc: '자욱한 숲속 깊은 모닥불에서 피어오르는 백단향의 아날로그 오라가, 마찰되어 바짝 긴장된 현대인의 뇌파를 묵직하고 차분하게 소진해 드립니다.',
        music: 'Muted Hearth Fireplace & Jazz Lo-Fi',
        object: '네오 브루탈 러프 메탈 틴 캐니스터',
        badge: ' 이완과 숙성 (RELAX)'
      },
      focus: {
        scentName: 'WHITE SAGE',
        emoji: '🌿',
        color: '#65A30D',
        shadowColor: 'rgba(101, 163, 13, 0.45)',
        quote: '번잡하게 흩어진 생각을 맑게 비우다.',
        desc: '하얀 살비아 잎의 싱그러운 약초향이 코끝을 통해 퍼지며, 부유물처럼 둥둥 떠돌아다니는 잡념의 안개를 선명하게 지우고 영감을 일깨워 줍니다.',
        music: 'Deep Alpha Wave Binaural Focus Sound (528Hz)',
        object: '콘크리트 모던 미니멀리즘 슬레이트 플레이트',
        badge: ' 각성과 영감 (CLARITY)'
      },
      sleep: {
        scentName: 'BLACK PATCHOULI',
        emoji: '🔮',
        color: '#8B5CF6',
        shadowColor: 'rgba(139, 92, 246, 0.45)',
        quote: '이국적이고 포근한 깊은 수면의 바다로.',
        desc: '동양의 깊은 다크 머스크와 축축한 흙의 패출리가 얽혀드는 신비로운 보랏빛 밤의 기류가, 뒤척이는 당신의 눈가에 평온의 베일을 씌웁니다.',
        music: 'Cosmic Dream Indigo Healing Soundscape',
        object: '옵시디언 글래스 리플렉터 코스터 링',
        badge: ' 평안과 회복 (DEEP DREAM)'
      }
    };

    return templates[mood] || templates.burnout;
  };

  const presc = getPrescriptionInfo();

  const moodChips = [
    { value: 'burnout', label: '🪵 무기력 & 번아웃', desc: '칠레 야생의 깊은 안식이 필요할 때' },
    { value: 'stress', label: '🔥 스트레스 & 분노', desc: '뜨거운 열기를 차분히 식히고 싶을 때' },
    { value: 'focus', label: '🌿 잡념 & 집중력 저하', desc: '복잡한 마음을 맑고 싱그럽게 정화할 때' },
    { value: 'sleep', label: '🔮 불면증 & 우울감', desc: '밤새 머무는 깊고 이국적인 숙면이 필요할 때' }
  ];

  const scentChips = [
    { value: 'woody', label: '🪵 우디 (깊고 묵직함)' },
    { value: 'herbal', label: '🌿 그린 (싱그럽고 시원함)' },
    { value: 'musk', label: '🔮 머스크 (매혹적이고 차분함)' },
    { value: 'smoky', label: '🔥 스모키 (모닥불처럼 포근함)' }
  ];

  return (
    <div className="consulting-overlay" onClick={isSubmitted ? null : onClose}>
      <div 
        className={`consulting-modal jiggle-in ${isSubmitted ? 'prescription-mode-active' : ''}`} 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          background: isSubmitted ? '#0d0d0c' : 'rgba(247, 244, 237, 0.98)',
          borderColor: isSubmitted ? presc.color : '#1a1a1a',
          boxShadow: isSubmitted ? `0px 10px 40px ${presc.shadowColor}, 8px 8px 0px ${presc.color}` : '8px 8px 0px #1a1a1a'
        }}
      >
        {/* 모달 닫기 */}
        <button 
          className="consulting-close-btn" 
          onClick={isSubmitted ? handlePrescriptionClose : onClose} 
          aria-label="닫기"
          style={{ 
            background: isSubmitted ? '#1a1a19' : '#eae4d9',
            color: isSubmitted ? '#fff' : '#444',
            borderColor: isSubmitted ? presc.color : '#1a1a1a'
          }}
        >
          <X size={20} />
        </button>

        {isSubmitted ? (
          /* 신청 제출 성공 - 즉석 3D 네온 처방 카드 발급 뷰포트 */
          <div className="prescription-card-wrap">
            <span className="prescription-sec-badge font-mono animate-pulse" style={{ color: presc.color }}>
              <Sparkles size={12} className="spin-slow" /> PERSONALIZED RITUAL PRESCURED
            </span>
            
            <h3 className="presc-user-headline">
              <span>{formData.name || 'VIP'}</span> 님을 위한 맞춤 향 처방전
            </h3>
            
            {/* 3D 모션 네온 카드 보드 */}
            <div 
              className="prescription-3d-neon-card"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                borderColor: presc.color,
                boxShadow: `0 0 25px ${presc.shadowColor}, inset 0 0 15px ${presc.shadowColor}`
              }}
            >
              {/* 글래스모피즘 반사광 오라 */}
              <div className="card-glass-specular" />
              
              <div className="card-header-presc font-mono">
                <span>BURN TO CHILL // RITUAL rx</span>
                <span className="presc-theme-badge" style={{ backgroundColor: presc.color }}>
                  {presc.badge}
                </span>
              </div>
              
              <div className="presc-main-avatar">
                <span className="presc-emoji">{presc.emoji}</span>
                <h4 className="presc-scent-name" style={{ color: presc.color }}>{presc.scentName}</h4>
              </div>
              
              <p className="presc-quote font-serif">" {presc.quote} "</p>
              
              <div className="presc-dashed-divider" />
              
              <p className="presc-detail-description">
                {presc.desc}
              </p>
              
              <div className="presc-dashed-divider" />
              
              {/* 세부 처방 요소 */}
              <div className="presc-factors-grid font-mono">
                <div className="factor-row">
                  <div className="factor-lbl">
                    <Volume2 size={12} style={{ color: presc.color }} />
                    <span>ACOUSTIC rx (추천 주파수)</span>
                  </div>
                  <span className="factor-val">{presc.music}</span>
                </div>
                
                <div className="factor-row">
                  <div className="factor-lbl">
                    <Package size={12} style={{ color: presc.color }} />
                    <span>OBJECT rx (추천 오브제)</span>
                  </div>
                  <span className="factor-val">{presc.object}</span>
                </div>
              </div>
              
              {/* 스탬프 장식 */}
              <div className="presc-stamp-seal font-mono" style={{ color: presc.color, borderColor: presc.color }}>
                <span>APPROVED</span>
                <strong>BTC MASTER</strong>
              </div>
            </div>

            <p className="presc-card-hint font-mono">💡 마우스를 올려 카드를 이리저리 기울여 보세요.</p>

            {/* 카드 하단 액션 버튼 */}
            <div className="prescription-actions">
              <button 
                className="presc-action-btn presc-btn-save"
                onClick={handlePrescriptionClose}
                style={{ borderColor: presc.color, color: '#fff' }}
              >
                <Download size={14} />
                <span>처방전 보관고에 저장하고 닫기</span>
              </button>
            </div>
          </div>
        ) : (
          /* 실제 입력 신청 양식 */
          <form className="consulting-form" onSubmit={handleSubmit}>
            
            {/* 헤더 */}
            <div className="consulting-header">
              <span className="consulting-badge font-mono">
                <Sparkles size={11} className="spin-slow" /> 1:1 RE-TREAT CONCIERGE
              </span>
              <h3 className="consulting-title">1:1 맞춤 리추얼 향 컨설팅</h3>
              <p className="consulting-subtitle">
                번아웃된 나의 하루에 완벽한 위로가 되어 줄 나만의 특별한 리추얼 향 조합과 아날로그 세라믹 오브제를 처방해 드립니다.
              </p>
            </div>

            {/* 입력 폼 바디 */}
            <div className="consulting-body-scroll">
              
              {/* 섹션 1: 기본 정보 */}
              <div className="form-group-row">
                <div className="form-item">
                  <label className="form-label font-mono">01. YOUR NAME</label>
                  <input 
                    type="text" 
                    className="consulting-input" 
                    placeholder="성함을 입력해 주세요" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-item">
                  <label className="form-label font-mono">02. CONTACT PHONE</label>
                  <input 
                    type="tel" 
                    className="consulting-input" 
                    placeholder="연락처를 입력해 주세요 (ex. 010-0000-0000)" 
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* 섹션 2: 마음 고민 상태 */}
              <div className="form-item margin-t-20">
                <label className="form-label font-mono">03. YOUR CURRENT MOOD (현재 가장 위로가 필요한 고민 상태)</label>
                <div className="mood-chips-grid">
                  {moodChips.map((chip) => {
                    const isSelected = formData.mood === chip.value;
                    return (
                      <button
                        key={chip.value}
                        type="button"
                        className={`mood-chip-btn ${isSelected ? 'active-mood' : ''}`}
                        onClick={() => handleMoodSelect(chip.value)}
                      >
                        <span className="mood-chip-title">{chip.label}</span>
                        <span className="mood-chip-desc">{chip.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 섹션 3: 선호하는 향 */}
              <div className="form-item margin-t-25">
                <label className="form-label font-mono">04. PREFERRED SCENTS (선호하는 향 계열 / 다중 선택 가능)</label>
                <div className="scent-chips-grid">
                  {scentChips.map((chip) => {
                    const isSelected = formData.scent.includes(chip.value);
                    return (
                      <button
                        key={chip.value}
                        type="button"
                        className={`scent-chip-btn ${isSelected ? 'active-scent' : ''}`}
                        onClick={() => handleScentToggle(chip.value)}
                      >
                        <span className="scent-checkbox">
                          {isSelected && <Check size={10} strokeWidth={4} />}
                        </span>
                        <span className="scent-chip-label">{chip.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 섹션 4: 고민 사연 */}
              <div className="form-item margin-t-25">
                <label className="form-label font-mono">05. RITUAL MESSAGE (향과 어우러질 나의 이야기 또는 추가 고민 사항)</label>
                <textarea 
                  className="consulting-textarea" 
                  placeholder="예: 퇴근 후 온전히 쉴 때 피울 나만의 묵직한 밤 숲속 향이 필요해요. 힐링이 되는 문구를 홀더 속에 담고 싶습니다."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  maxLength={300}
                />
                <span className="char-counter font-mono">{formData.message.length} / 300자</span>
              </div>

            </div>

            {/* 모달 푸터 액션 */}
            <div className="consulting-footer">
              <button type="button" className="consulting-btn btn-close" onClick={onClose}>
                취소하기
              </button>
              <button type="submit" className="consulting-btn btn-submit">
                <Send size={15} />
                <span>무료 컨설팅 신청서 제출하기</span>
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
