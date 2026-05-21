import React, { useState } from 'react';
import { X, Sparkles, Send, Check } from 'lucide-react';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("이름과 연락처를 입력해 주세요.");
      return;
    }

    // 전광석화 같은 성공 연출 기동
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      // 폼 리셋
      setFormData({
        name: '',
        phone: '',
        mood: 'burnout',
        scent: [],
        message: ''
      });
      onClose();
    }, 2800);
  };

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
    <div className="consulting-overlay" onClick={onClose}>
      <div 
        className="consulting-modal jiggle-in" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 닫기 */}
        <button className="consulting-close-btn" onClick={onClose} aria-label="닫기">
          <X size={20} />
        </button>

        {isSubmitted ? (
          /* 신청 제출 성공 뷰포트 */
          <div className="submit-success-view">
            <div className="success-lottie-ring">
              <Check size={44} className="check-draw-icon" />
              <div className="success-lottie-sparks">
                <Sparkles size={16} className="succ-spark-1" />
                <Sparkles size={20} className="succ-spark-2" />
              </div>
            </div>
            <h3 className="success-title font-mono">CONSULTING SUBMITTED</h3>
            <h4>리추얼 향 컨설팅 신청이 완료되었습니다!</h4>
            <p>
              입력하신 고민과 선호에 맞춰,<br />
              번투칠 전문 마스터가 <strong>24시간 이내</strong>에 나만의 향 조합 처방전을 안내해 드릴 예정입니다.
            </p>
            <span className="success-sub font-mono">잠시 후 창이 닫힙니다.</span>
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
