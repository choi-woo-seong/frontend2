"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../styles/WelfareNewsPage.css"

/**
 * 복지 뉴스 페이지 컴포넌트
 *
 * 노인 복지 관련 뉴스를 표시하는 페이지
 *
 * @returns {JSX.Element}
 */
const WelfareNewsPage = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState("all")

  // 백엔드에서 복지 뉴스 데이터 가져오기
  // API 엔드포인트: GET /api/welfare-news?category={category}
  // 응답 형식: { id, title, category, date, summary, imageUrl }[]
  useEffect(() => {
    // 실제 구현 시 axios 사용
    const fetchNews = async () => {
      try {
        setLoading(true)
        // const response = await axios.get(`/api/welfare-news?category=${currentTab !== 'all' ? currentTab : ''}`);
        // setNews(response.data);

        // 임시 데이터
        setTimeout(() => {
          const mockNews = [
            {
              id: 1,
              title: "2023년 노인복지시설 안전점검 결과 발표",
              category: "정책소식",
              date: "2023-05-10",
              summary:
                "보건복지부는 전국 노인복지시설에 대한 안전점검을 실시하고 그 결과를 발표했습니다. 이번 점검에서는 전체 시설의 95%가 안전 기준을 충족한 것으로 나타났습니다.",
              imageUrl: "/images/vibrant-market-scene.png",
            },
            {
              id: 2,
              title: "노인 일자리 지원 사업 참여자 모집",
              category: "지원사업",
              date: "2023-05-01",
              summary:
                "정부는 노인 일자리 지원 사업의 일환으로 다양한 분야에서 활동할 참여자를 모집합니다. 이번 사업은 노인들의 경제적 자립과 사회 참여를 돕기 위해 마련되었습니다.",
              imageUrl: "/images/hands-together-growth.png",
            },
            {
              id: 3,
              title: "치매 예방을 위한 생활 수칙 10가지",
              category: "건강정보",
              date: "2023-05-05",
              summary:
                "국립중앙의료원은 치매 예방을 위한 생활 수칙 10가지를 발표했습니다. 규칙적인 운동과 건강한 식습관, 충분한 수면 등이 치매 예방에 도움이 된다고 합니다.",
              imageUrl: "/images/thoughtful-communication.png",
            },
            {
              id: 4,
              title: "노인 돌봄 서비스 확대 계획 발표",
              category: "정책소식",
              date: "2023-04-20",
              summary:
                "정부는 노인 돌봄 서비스를 확대하는 계획을 발표했습니다. 이번 계획에는 방문 요양 서비스 확대와 주간보호센터 증설 등이 포함되어 있습니다.",
              imageUrl: "/images/supportive-stroll.png",
            },
            {
              id: 5,
              title: "노인 건강 증진을 위한 무료 체력 측정 행사",
              category: "행사안내",
              date: "2023-04-15",
              summary:
                "서울시는 노인 건강 증진을 위한 무료 체력 측정 행사를 개최합니다. 이번 행사에서는 체력 측정뿐만 아니라 맞춤형 운동 처방도 제공됩니다.",
              imageUrl: "/images/elderly-woman-using-walker.png",
            },
          ]

          if (currentTab !== "all") {
            setNews(mockNews.filter((item) => item.category === currentTab))
          } else {
            setNews(mockNews)
          }

          setLoading(false)
        }, 500)
      } catch (error) {
        console.error("복지 뉴스를 불러오는 중 오류가 발생했습니다:", error)
        setLoading(false)
      }
    }

    fetchNews()
  }, [currentTab])

  // 카테고리 탭 목록
  const tabs = [
    { id: "all", label: "전체" },
    { id: "정책소식", label: "정책소식" },
    { id: "지원사업", label: "지원사업" },
    { id: "건강정보", label: "건강정보" },
    { id: "행사안내", label: "행사안내" },
  ]

  return (
    <div className="welfare-news-page">
      <div className="page-header">
        <div className="container">
          <Link to="/" className="back-button">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <h1>복지 뉴스</h1>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${currentTab === tab.id ? "active" : ""}`}
                onClick={() => setCurrentTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="news-grid">
              {news.length > 0 ? (
                news.map((item) => (
                  <div key={item.id} className="news-card">
                    <div className="news-image">
                      <img src={item.imageUrl || "/placeholder.svg"} alt={item.title} />
                    </div>
                    <div className="news-card-content">
                      <div className="news-meta">
                        <span className="news-category">{item.category}</span>
                        <span className="news-date">{item.date}</span>
                      </div>
                      <h3 className="news-title">{item.title}</h3>
                      <p className="news-summary">{item.summary}</p>
                      <Link to={`/welfare-news/${item.id}`} className="read-more">
                        자세히 보기 <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <i className="fas fa-newspaper"></i>
                  </div>
                  <h2>뉴스가 없습니다</h2>
                  <p>현재 카테고리에 등록된 뉴스가 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WelfareNewsPage
