// src/pages/NoticesPage.jsx
"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import "../styles/NoticesPage.css"

const NoticesPage = () => {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const size = 10

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/notices?page=${currentPage - 1}&size=${size}&sort=createdAt,desc`
        )

        const contentType = response.headers.get("content-type")
        if (!response.ok || !contentType?.includes("application/json")) {
          const text = await response.text()
          throw new Error(`응답 오류: ${text}`)
        }

        const data = await response.json()
        setNotices(data.content)
        setTotalPages(data.totalPages)
      } catch (error) {
        console.error("공지사항 불러오기 실패:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [currentPage])

  return (
    <div className="notices-page">
      {/* 상단 헤더 */}
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

      {/* 내용 */}
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
                      <td>{(currentPage - 1) * size + index + 1}</td>
                      <td className="title-cell">
                        <Link to={`/notices/${notice.id}`} className="notice-link">
                          {notice.title}
                        </Link>
                      </td>
                      <td>{new Date(notice.createdAt).toLocaleDateString("ko-KR")}</td>
                      <td>{notice.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 페이지네이션 */}
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  이전
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={currentPage === i + 1 ? "active" : ""}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NoticesPage
