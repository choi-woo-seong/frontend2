"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../styles/GovernmentProgramsPage.css"

/**
 * 정부 프로그램 페이지 컴포넌트
 *
 * 노인 복지 관련 정부 지원 프로그램을 표시하는 페이지
 *
 * @returns {JSX.Element}
 */
const GovernmentProgramsPage = () => {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState("all")

  // 백엔드에서 정부 프로그램 데이터 가져오기
  // API 엔드포인트: GET /api/government-programs?category={category}
  // 응답 형식: { id, title, category, eligibility, benefits, applicationPeriod, imageUrl }[]
  useEffect(() => {
    // 실제 구현 시 axios 사용
    const fetchPrograms = async () => {
      try {
        setLoading(true)
        // const response = await axios.get(`/api/government-programs?category=${currentTab !== 'all' ? currentTab : ''}`);
        // setPrograms(response.data);

        // 임시 데이터
        setTimeout(() => {
          const mockPrograms = [
            {
              id: 1,
              title: "노인장기요양보험",
              category: "요양지원",
              eligibility: "65세 이상 노인 또는 65세 미만으로 노인성 질병을 가진 자",
              benefits: "방문요양, 방문목욕, 방문간호, 주야간보호, 단기보호, 복지용구 등",
              applicationPeriod: "연중 상시",
              imageUrl: "/images/elderly-woman-using-rollator.png",
            },
            {
              id: 2,
              title: "기초연금",
              category: "소득지원",
              eligibility: "만 65세 이상, 소득인정액이 선정기준액 이하인 노인",
              benefits: "월 최대 30만원의 연금 지급",
              applicationPeriod: "연중 상시",
              imageUrl: "/images/hands-together-growth.png",
            },
            {
              id: 3,
              title: "노인 일자리 및 사회활동 지원",
              category: "일자리",
              eligibility: "만 65세 이상 기초연금 수급자",
              benefits: "월 27만원 내외의 활동비 지급",
              applicationPeriod: "매년 1~2월",
              imageUrl: "/images/vibrant-senior-community.png",
            },
            {
              id: 4,
              title: "노인 맞춤 돌봄 서비스",
              category: "돌봄지원",
              eligibility:
                "만 65세 이상 국민기초생활수급자, 차상위계층 또는 기초연금 수급자 중 독거·조손·고령부부 가구 등 돌봄이 필요한 노인",
              benefits: "안전·안부 확인, 생활안전 점검, 정서 지원, 사회참여 프로그램 등",
              applicationPeriod: "연중 상시",
              imageUrl: "/images/supportive-stroll.png",
            },
            {
              id: 5,
              title: "치매 검진 지원",
              category: "의료지원",
              eligibility: "만 60세 이상 노인",
              benefits: "치매 조기 검진 및 예방 관리 서비스 제공",
              applicationPeriod: "연중 상시",
              imageUrl: "/images/compassionate-doctor-consultation.png",
            },
          ]

          if (currentTab !== "all") {
            setPrograms(mockPrograms.filter((program) => program.category === currentTab))
          } else {
            setPrograms(mockPrograms)
          }

          setLoading(false)
        }, 500)
      } catch (error) {
        console.error("정부 프로그램을 불러오는 중 오류가 발생했습니다:", error)
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [currentTab])

  // 카테고리 탭 목록
  const tabs = [
    { id: "all", label: "전체" },
    { id: "요양지원", label: "요양지원" },
    { id: "소득지원", label: "소득지원" },
    { id: "일자리", label: "일자리" },
    { id: "돌봄지원", label: "돌봄지원" },
    { id: "의료지원", label: "의료지원" },
  ]

  return (
    <div className="government-programs-page">
      <div className="page-header">
        <div className="container">
          <Link to="/" className="back-button">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <h1>정부 지원 프로그램</h1>
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
            <div className="programs-list">
              {programs.length > 0 ? (
                programs.map((program) => (
                  <div key={program.id} className="program-card">
                    <div className="program-image">
                      <img src={program.imageUrl || "/placeholder.svg"} alt={program.title} />
                    </div>
                    <div className="program-content">
                      <div className="program-header">
                        <span className="program-category">{program.category}</span>
                        <h3 className="program-title">{program.title}</h3>
                      </div>
                      <div className="program-details">
                        <div className="detail-item">
                          <span className="detail-label">지원 대상</span>
                          <p className="detail-value">{program.eligibility}</p>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">지원 내용</span>
                          <p className="detail-value">{program.benefits}</p>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">신청 기간</span>
                          <p className="detail-value">{program.applicationPeriod}</p>
                        </div>
                      </div>
                      <Link to={`/government-programs/${program.id}`} className="apply-button">
                        자세히 보기
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <h2>프로그램이 없습니다</h2>
                  <p>현재 카테고리에 등록된 프로그램이 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GovernmentProgramsPage
