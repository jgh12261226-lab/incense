import React, { useEffect, useState, useRef } from 'react';
import { Flame, Star, Heart, Cpu, Gift, Eye, Smile, ChevronLeft, ChevronRight } from 'lucide-react';
import CustomCTA from './UI/CustomCTA';
import ConsultingModal from './UI/ConsultingModal';
import './EpilogueSection.css';
import incenseChamberImg from '../assets/incense_chamber.png';
import matchboxImg from '../assets/matchbox.png';
import incenseBookImg from '../assets/incense_book.png';

// 리뷰 테마에 맞춰 매칭되는 엠블럼 벡터 아이콘 렌더러
const ReviewIcon = ({ name }) => {
  const iconProps = { size: 24, className: "review-badge-vector" };
  switch (name) {
    case 'Heart': return <Heart {...iconProps} />;
    case 'Cpu': return <Cpu {...iconProps} />;
    case 'Flame': return <Flame {...iconProps} />;
    case 'Gift': return <Gift {...iconProps} />;
    case 'Eye': return <Eye {...iconProps} />;
    case 'Smile': return <Smile {...iconProps} />;
    default: return <Flame {...iconProps} />;
  }
};

export default function EpilogueSection({ isIgnited, onIgnite }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [btnReveal, setBtnReveal] = useState(false);
  const [hasScrolledIn, setHasScrolledIn] = useState(false);
  const [isConsultingOpen, setIsConsultingOpen] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBtnReveal(true);
          setHasScrolledIn(true);
        } else {
          setBtnReveal(false);
        }
        if (onIgnite) {
          onIgnite(entry.isIntersecting);
        }
      },
      {
        rootMargin: '-18% 0px -18% 0px', // 자연스러운 팽창 리빌 감도를 위해 마진 미세 조율
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

  const handleCtaClick = () => {
    setIsConsultingOpen(true);
  };

  const reviews = [
    {
      name: '김민지',
      age: 28,
      job: '브랜드 마케터',
      rating: 5,
      date: '2026.05.10',
      icon: 'Heart',
      title: '기념일 치트키 등극.. 불 타면서 메시지 뜰 때 온몸에 소름 돋았습니다',
      content: '남자친구와 1000일 기념일 홈파티를 준비하면서 평범한 편지 대신 특별한 걸 찾다가 인스타 힙한 감성에 이끌려 들어왔어요. 랜딩 페이지에서부터 불을 붙이는 연출을 보며 이건 진짜 도파민 터지겠다 싶어 바로 질렀습니다. 와인 한 잔 마시면서 인센스 스틱에 불을 붙였는데, 시간이 지나면서 빨갛게 타들어 가더니 연기 사이로 우리가 처음 만난 날짜와 메시지가 스르르 떠오르는 순간.. 진짜 둘 다 소리를 질렀어요! 남자친구는 눈물까지 글썽이더라고요. 일회성 이벤트가 아니라 평생 기억에 남을 역대급 시각적 반전이었어요. 이 가격에 이런 감동과 강력한 한 방이라니, 이벤트 준비하시는 분들은 고민하지 말고 그냥 결제하세요. 후회 절대 안 합니다!'
    },
    {
      name: '이준우',
      age: 26,
      job: 'UX/UI 디자이너',
      rating: 5,
      date: '2026.05.12',
      icon: 'Cpu',
      title: '쇼핑몰이 아니라 장난감인 줄? 웹사이트 조작하다 홀린 듯 결제까지 한 건 처음이에요',
      content: '맨날 보는 지루한 대기업 오픈마켓 스타일의 페이지에 질려있었는데, 여긴 랜딩 페이지 첫인상부터 충격적이었습니다. 볼드하고 볼륨감 넘치는 고블린 풍 서체에, 마우스 커서가 불꽃으로 따라다니는 디테일부터 미쳤다 생각했어요. 스크롤을 내릴 때마다 3D 인센스 북이 입체적으로 착착 넘어가고, 마지막에 직접 성냥을 켜서 인센스 스틱을 켜는 듯한 인터랙티브 모션을 손으로 조작하는데 마치 세련된 인디 게임을 하는 기분이었습니다. 웹사이트를 만지는 행위 자체가 하나의 신선한 놀이로 다가와서, 브랜딩 퀄리티에 압도되어 바로 카드를 꺼냈습니다. 사이트 디자인만 봐도 이 브랜드가 제품 만듦새에 얼마나 미쳐있는지 확신이 드네요.'
    },
    {
      name: '하은',
      age: 31,
      job: '프리랜서 디자이너 & 인플루언서',
      rating: 5,
      date: '2026.05.15',
      icon: 'Flame',
      title: '다음 날 아침 방 문 열자마자 느껴지는 묵직한 잔향과 압도적인 인테리어 무드',
      content: '방 안의 공기와 가구의 밸런스를 중요하게 생각해서 정말 많은 인센스 홀더와 스틱을 써봤습니다. 보통 인센스는 태울 때만 강하고 환기하면 바로 냄새가 날아가거나, 반대로 절간 같은 인공 향이 나서 아쉬웠는데요. 이 제품은 천연 나무 가루로 만들어서 그런지 화학적인 찌르는 맛이 전혀 없고, 가을 새벽녘 숲속의 젖은 나무 향 같은 묵직하고 깊은 잔향이 납니다. 신기하게도 연기가 다 사라진 다음 날 아침에 방 문을 열었는데 은은하고 세련된 잔향이 방 안에 고급스럽게 차 있더라고요. 게다가 수제 세라믹 챔버 홀더는 그냥 테이블 위에 올려두는 것만으로도 공간의 분위기를 확 잡아주는 하이엔드 무드의 훌륭한 오브제가 됩니다. 안방과 작업실에 하나씩 두고 매일 밤 힐링하고 있습니다.'
    },
    {
      name: '한소희',
      age: 29,
      job: '일러스트레이터',
      rating: 5,
      date: '2026.05.16',
      icon: 'Gift',
      title: '친구 집들이 선물로 줬는데 센스 터진다는 소리 백 번 들었습니다!',
      content: '매번 집들이 선물로 흔한 디퓨저나 캔들만 선물하다가, 이번에 좀 색다른 감각의 인센스 패키지를 발견하고 바로 선택했어요. 고급스러운 친환경 포장 상자부터 묵직한 세라믹 홀더, 아날로그 감성이 뿜어져 나오는 빈티지 성냥세트까지 패키징 디테일이 장난 아니에요. 친구 부부가 성냥을 켜서 불을 지필 때의 손맛과 타오르는 소리가 너무 분위기 있다고 극찬을 아끼지 않았습니다. 게다가 연기가 올라가면서 서서히 숨겨진 이니셜이 드러나는데 완벽한 주인공이 된 느낌을 줬대요. 선물을 준 제가 다 어깨가 으쓱해지는 아이템입니다. 흔치 않은 센스 있는 선물로 이만한 게 없어요!'
    },
    {
      name: '박성현',
      age: 33,
      job: '개발자',
      rating: 5,
      date: '2026.05.17',
      icon: 'Eye',
      title: '퇴근 후 컴컴한 방에서 연기 멍때리기.. 진짜 최고의 힐링 치유제입니다',
      content: '매일 모니터와 텍스트만 보며 바쁘게 머리를 쓰다 보니 퇴근하고 나면 뇌가 타버릴 것 같았어요. 우연히 이 번투칠 인센스를 알게 되어 구매했는데, 저녁에 불을 끄고 아주 조용한 상태에서 진짜 성냥을 켜서 불을 붙입니다. 홀더 속에 갇혀서 구멍으로 나직하게 피어오르는 연기를 멍하니 보고만 있어도 복잡했던 머릿속 잡념이 다 사라지고 정화되는 느낌이에요. 100% 천연 성분 블렌딩이라 그런지 오랫동안 켜두어도 머리가 안 아프고 눈 피로도 줄어드네요. 저 같은 직장인들에게 나만의 진심을 들여다보는 리추얼 아이템으로 완전 추천합니다.'
    },
    {
      name: '최다은',
      age: 30,
      job: '플로리스트',
      rating: 5,
      date: '2026.05.18',
      icon: 'Smile',
      title: '부모님 결혼기념일에 감사 글귀를 담아 드렸는데, 온 가족이 다 함께 뭉클해졌어요',
      content: '일반적인 인센스는 그냥 향만 피우고 끝인데, 이건 연기가 피어오른 뒤 스틱의 열감이 닿으면서 서서히 감사 메시지가 검은 그을음 속에서 반전처럼 태어납니다. 결혼 30주년 기념으로 부모님께 사랑과 감사의 메시지를 숨겨서 선물해드렸어요. 처음에 그냥 평범한 예쁜 홀더인 줄 아시다가 글자가 완성되어 나타날 때 엄마 눈가가 엄청 촉촉해지셨어요. 단순한 방향 소품을 넘어 사람의 깊은 감정과 따뜻한 온도를 전달하는 스토리가 담겨 있어서 더욱 특별합니다. 감동적인 순간을 선물해 준 번투칠 랩에 정말 감사드립니다.'
    }
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className={`epilogue-section ${hasScrolledIn ? 'scrolled-in' : ''}`} ref={sectionRef}>
      <div className="epilogue-container">
        
        {/* 최종 가치 제안 헤더 */}
        <div className="epilogue-header">
          <span className="epilogue-badge">THE LAST SCENE</span>
          <h2 className="goblin-text epilogue-title">
            이제 당신이 숨겨둔<br />
            <span className="accent-text">진심</span>을 피울 차례입니다.
          </h2>
          <p className="epilogue-subtitle">
            단 하나의 특별한 연기로 전하는 메시지 홀더 오브제
          </p>
        </div>

        {/* 6개 리뷰 3D 슬라이더 캐러셀 영역 */}
        <div className="review-slider-outer">
          <button className="slider-arrow-btn prev-btn" onClick={handlePrev} aria-label="이전 리뷰">
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          
          <div className="review-slider-viewport">
            <div 
              className="review-slider-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div key={index} className="review-slide-card">
                  <div className="review-card-top">
                    <div className="review-stars-wrap">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={15} className="review-star-vector" />
                      ))}
                    </div>
                    <span className="review-date">{review.date}</span>
                  </div>
                  
                  <div className="review-card-content-wrap">
                    <div className="review-card-title-header">
                      <ReviewIcon name={review.icon} />
                      <h3 className="review-card-title">“{review.title}”</h3>
                    </div>
                    <p className="review-card-content">{review.content}</p>
                  </div>
                  
                  <div className="review-card-footer">
                    <span className="review-user-name">{review.name}</span>
                    <span className="review-user-info">{review.age}세 · {review.job}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="slider-arrow-btn next-btn" onClick={handleNext} aria-label="다음 리뷰">
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>

        {/* 슬라이드 도트 인디케이터 */}
        <div className="slider-dots">
          {reviews.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`${index + 1}번째 리뷰로 이동`}
            />
          ))}
        </div>

        {/* 종점 도달 시 화면 중앙에 거대하고 탱글한 젤리 스타일 CTA 버튼 등장 */}
        <div className={`cta-trigger-wrap ${btnReveal ? 'btn-rise' : ''}`}>
          <CustomCTA text="1:1 맞춤 리추얼 향 컨설팅 신청" onClick={handleCtaClick} />
        </div>

        {/* 하단 풋터 */}
        <footer className="epilogue-footer">
          <p>© 2026 BURN TO CHILL LAB. ALL RIGHTS RESERVED.</p>
        </footer>

        {/* 1:1 맞춤 리추얼 향 컨설팅 신청서 팝업 모달 */}
        <ConsultingModal isOpen={isConsultingOpen} onClose={() => setIsConsultingOpen(false)} />

      </div>
    </section>
  );
}
