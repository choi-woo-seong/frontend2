"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import "../styles/NoticesPage.css"

const NoticesPage = () => {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true)
        setTimeout(() => {
          const mockNotices = [
            { id: 1, title: "[공지] 직방 동행봉사 정보 및 이벤트 수신 안내", date: "2025.04.15", views: 245 },
            { id: 2, title: "[공지] 직방 개인정보 처리방침 (2024/12/31) 개정 안내", date: "2025.04.10", views: 187 },
            { id: 3, title: "[공지] 직방 개인정보 처리방침 (2024/11/01) 개정 안내", date: "2025.04.05", views: 203 },
            { id: 4, title: "[공지][일부] 단지 설계해 정보 리뉴얼 및 업데이트 자료 안내", date: "2025.03.28", views: 156 },
            { id: 5, title: "[공지] 직방 개인정보 처리방침 (2024/09/19) 개정 안내", date: "2025.03.15", views: 178 },
            { id: 6, title: "[공지] 모셔요 서비스 이용약관 개정 안내", date: "2025.03.10", views: 165 },
            { id: 7, title: "[공지] 모셔요 앱 업데이트 안내 (v2.3.0)", date: "2025.03.05", views: 192 },
            { id: 8, title: "[공지] 2025설 연휴 고객센터 운영 안내", date: "2025.02.20", views: 210 },
            { id: 9, title: "[공지] 모셔요 서비스 점검 안내 (2025.02.15)", date: "2025.02.10", views: 175 },
            { id: 10, title: "[공지] 요양원 검색 서비스 개선 안내", date: "2025.02.05", views: 220 },
          ]

          setNotices(mockNotices)
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error("공지사항을 불러오는 중 오류가 발생했습니다:", error)
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])

  return (
    <div className="notices-page">
      <div className="page-header">
        <div className="container header-flex">
          <div className="flex items-center">
            <Link to="/" className="mr-2">
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1>공지사항</h1>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="notice-table">
              <table>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>등록일</th>
                    <th>조회수</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map((notice, index) => (
                    <tr key={notice.id}>
                      <td>{index + 1}</td>
                      <td className="title-cell">
                        <Link to={`/notices/${notice.id}`} className="notice-link">
                          {notice.title}
                        </Link>
                      </td>
                      <td>{notice.date}</td>
                      <td>{notice.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 페이지네이션 */}
              <div className="pagination">
                <button disabled>이전</button>
                <button className="active">1</button>
                <button>2</button>
                <button>3</button>
                <button>다음</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NoticesPage
