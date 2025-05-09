"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import { Button } from "../../components/ui/Button"
import Skeleton from "../../components/ui/Skeleton"
import Badge from "../../components/ui/Badge"
import "./AdminInquiriesPage.css"
import { FaSearch } from "react-icons/fa"
import { MessageSquare, Trash2 } from "lucide-react"

const InquiriesPage = () => {
  const navigate = useNavigate()
  const [inquiries, setInquiries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchInquiries = async () => {
      const token = localStorage.getItem("accessToken")
      if (!token) return navigate("/login")
      try {
        const res = await fetch("http://localhost:8080/api/questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.status === 401) return navigate("/login")
        if (!res.ok) throw new Error("문의 목록 로드 실패")
        const data = await res.json()
        const formatted = data.map((q) => ({
          id: q.id,
          title: q.title,
          content: q.content,
          userName: q.userName || "",
          userEmail: q.userEmail || "",
          status: q.answer != null ? 'answered' : 'pending',
          createdAt: q.createdAt,
          answeredAt: q.answer?.createdAt || null,
        }))
        setInquiries(formatted)
        setTotalPages(Math.ceil(formatted.length / 10))
      } catch (err) {
        console.error("문의 목록 로드 중 오류 발생:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchInquiries()
  }, [navigate])

  const handleViewDetail = (id) => navigate(`/admin/questions/${id}`)

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("정말로 이 문의를 삭제하시겠습니까?")) return
    const token = localStorage.getItem("accessToken")
    if (!token) return navigate("/login")
    try {
      const res = await fetch(`http://localhost:8080/api/questions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.status === 401) return navigate("/login")
      if (!res.ok) throw new Error("삭제 실패")
      setInquiries((prev) => prev.filter((q) => q.id !== id))
    } catch (err) {
      console.error("삭제 중 오류 발생:", err)
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value)
    setCurrentPage(1)
  }

  const filteredInquiries = inquiries.filter((q) => {
    const matchSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.userName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === "all" || q.status === filterStatus
    return matchSearch && matchStatus
  })

  const itemsPerPage = 10
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentInquiries = filteredInquiries.slice(indexOfFirstItem, indexOfLastItem)
  const totalFilteredPages = Math.ceil(filteredInquiries.length / itemsPerPage)

  const handlePageChange = (page) => setCurrentPage(page)

  const getStatusBadge = (status) => {
    switch (status) {
      case "answered":
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">답변완료</span>
      case "pending":
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">미답변</span>
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">알 수 없음</span>
    }
  }

  const formatDate = (date) => new Date(date).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })

  if (isLoading) {
    return (
      <Layout>
        <div className="admin-inquiries max-w-6xl mx-auto px-4">
          <div className="admin-header"><h1>질문/답변 관리</h1></div>
          <div className="admin-filters">
            <Skeleton className="admin-search-skeleton" />
            <Skeleton className="admin-filter-skeleton" />
          </div>
          <div className="admin-table-container">
            <Skeleton className="admin-table-skeleton" height="400px" />
          </div>
          <div className="admin-pagination">
            <Skeleton className="admin-pagination-skeleton" />
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="admin-inquiries max-w-6xl mx-auto px-4">
        <div className="admin-header"><h1>질문/답변 관리</h1></div>
        <div className="admin-filters flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <div className="admin-search flex items-center border border-gray-300 rounded-md px-4 py-2 bg-white">
            <FaSearch className="text-gray-400 mr-2 w-4 h-4" />
            <input
              type="text"
              placeholder="질문 검색"
              value={searchTerm}
              onChange={handleSearchChange}
              className="outline-none text-sm placeholder-gray-400 bg-transparent"
            />
          </div>
          <div className="admin-filter-group flex gap-4 mt-2 sm:mt-0">
            <select
              value={filterStatus}
              onChange={handleStatusFilterChange}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white text-gray-800 focus:outline-none"
            >
              <option value="all">모든 상태</option>
              <option value="pending">대기중</option>
              <option value="answered">답변완료</option>
            </select>
          </div>
        </div>

        {filteredInquiries.length === 0 ? (
          <div className="admin-empty-state">
            <p>검색 조건에 맞는 문의가 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>상태</th>
                    <th>작성일</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="h-16">
                      <td className="inquiry-title">{inquiry.title}</td>
                      <td>{inquiry.userName}</td>
                      <td>{getStatusBadge(inquiry.status)}</td>
                      <td>{formatDate(inquiry.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-start items-center gap-5">
                          {inquiry.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetail(inquiry.id)}
                            >
                              <MessageSquare className="w-5 h-5 text-green-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteInquiry(inquiry.id)}
                          >
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalFilteredPages > 1 && (
              <div className="admin-pagination">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  이전
                </Button>
                {[...Array(totalFilteredPages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalFilteredPages}
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export default InquiriesPage;
