import { Link } from "react-router-dom"
import "./NewsSection.css"

/**
 * 뉴스 섹션 컴포넌트
 *
 * 메인 페이지에 표시되는 최신 뉴스 및 공지사항 섹션
 *
 * @returns {JSX.Element}
 */
const NewsSection = () => {
  // 백엔드에서 가져올 뉴스 데이터
  // API 엔드포인트: GET /api/news?limit=5
  // 응답 형식: { id, title, category, date, imageUrl }[]
  const news = [
    {
      id: 1,
      title: "노인장기요양보험 신청 방법 안내",
      category: "공지사항",
      date: "2023-05-15",
      imageUrl: "/images/notice-icon.png",
    },
    {
      id: 2,
      title: "2023년 노인복지시설 안전점검 결과 발표",
      category: "복지뉴스",
      date: "2023-05-10",
      imageUrl: "/images/notice-icon.png",
    },
    {
      id: 3,
      title: "치매 예방을 위한 생활 수칙 10가지",
      category: "건강정보",
      date: "2023-05-05",
      imageUrl: "/images/notice-icon.png",
    },
    {
      id: 4,
      title: "노인 일자리 지원 사업 참여자 모집",
      category: "정부지원",
      date: "2023-05-01",
      imageUrl: "/images/notice-icon.png",
    },
    {
      id: 5,
      title: "요양보호사 자격증 취득 과정 안내",
      category: "교육정보",
      date: "2023-04-28",
      imageUrl: "/images/notice-icon.png",
    },
  ]

  return (
    <section className="news-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">최신 소식</h2>
          <Link to="/notices" className="view-all-link">
            전체보기 <i className="fas fa-chevron-right"></i>
          </Link>
        </div>

        <div className="news-list">
          {news.map((item) => (
            <div key={item.id} className="news-item">
              <div className="news-icon">
                <img src={item.imageUrl || "/placeholder.svg"} alt="" />
              </div>
              <div className="news-content">
                <div className="news-meta">
                  <span className="news-category">{item.category}</span>
                  <span className="news-date">{item.date}</span>
                </div>
                <h3 className="news-title">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewsSection
