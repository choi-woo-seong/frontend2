"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import { Button } from "../../components/ui/Button"
import Skeleton from "../../components/ui/Skeleton"
import Badge from "../../components/ui/Badge" // 수정: 기본 내보내기로 가져오기
import "./AdminInquiriesPage.css" // 수정: 경로 변경
import {FaSearch} from "react-icons/fa"
import { Eye, MessageSquare, Trash2 } from "lucide-react"


/**
 * 문의 답변 페이지
 * 사용자로부터 받은 문의를 관리하고 답변할 수 있는 관리자 페이지입니다.
 */
const InquiriesPage = () => {
  const navigate = useNavigate()
  const [inquiries, setInquiries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // 문의 데이터 로드
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        // TODO: 백엔드 API 연동 - 문의 목록 요청
        // 현재는 더미 데이터로 대체
        setTimeout(() => {
          const dummyInquiries = [
            {
              id: 1,
              title: "방문요양 서비스 비용 문의",
              content: "방문요양 서비스의 비용 체계가 어떻게 되나요? 장기요양보험 적용 여부도 알고 싶습니다.",
              userName: "최동욱",
              userEmail: "choi@example.com",
              status: "pending",
              createdAt: new Date("2023-10-05T09:30:00"),
            },
            {
              id: 2,
              title: "요양원 입소 절차",
              content: "어머니를 요양원에 모시려고 합니다. 입소 절차와 필요한 서류에 대해 알려주세요.",
              userName: "김미영",
              userEmail: "kim@example.com",
              status: "answered",
              createdAt: new Date("2023-10-03T14:15:00"),
              answeredAt: new Date("2023-10-04T11:20:00"),
            },
            {
              id: 3,
              title: "전동 침대 배송 문의",
              content: "주문한 전동 침대의 배송 일정이 궁금합니다. 주문번호는 ORD-20231001-123456입니다.",
              userName: "박준호",
              userEmail: "park@example.com",
              status: "pending",
              createdAt: new Date("2023-10-01T16:45:00"),
            },
            {
              id: 4,
              title: "휠체어 부품 교체 가능 여부",
              content: "구매한 휠체어의 팔걸이가 파손되었는데, 부품만 교체 가능한가요?",
              userName: "이지원",
              userEmail: "lee@example.com",
              status: "answered",
              createdAt: new Date("2023-09-28T10:20:00"),
              answeredAt: new Date("2023-09-29T09:15:00"),
            },
            {
              id: 5,
              title: "장기요양등급 신청 방법",
              content: "부모님의 장기요양등급을 신청하려고 합니다. 절차와 필요한 서류에 대해 알려주세요.",
              userName: "정수민",
              userEmail: "jung@example.com",
              status: "pending",
              createdAt: new Date("2023-09-25T13:10:00"),
            },
          ]

          setInquiries(dummyInquiries)
          setTotalPages(Math.ceil(dummyInquiries.length / 10)) // 페이지당 10개 항목
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("문의 목록 로드 중 오류 발생:", error)
        setIsLoading(false)
      }
    }

    fetchInquiries()
  }, [])

  // 문의 상세 페이지로 이동
  const handleViewDetail = (inquiryId) => {
    navigate(`/admin/questions/${inquiryId}`)
  }

  const handleDeleteInquiry = (id) => {
    if (window.confirm("정말로 이 문의를 삭제하시겠습니까?")) {
      setInquiries((prev) => prev.filter((inquiry) => inquiry.id !== id))
    }
  }
  

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // 검색 시 첫 페이지로 이동
  }

  // 상태 필터 변경 핸들러
  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value)
    setCurrentPage(1) // 필터 변경 시 첫 페이지로 이동
  }

  // 필터링된 문의 목록
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.userName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || inquiry.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // 페이지네이션 처리
  const itemsPerPage = 10
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentInquiries = filteredInquiries.slice(indexOfFirstItem, indexOfLastItem)
  const totalFilteredPages = Math.ceil(filteredInquiries.length / itemsPerPage)

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // 상태에 따른 배지 색상 및 텍스트
  const getStatusBadge = (status) => {
    switch (status) {
      case "answered":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            답변완료
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            미답변
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            알 수 없음
          </span>
        )
    }
  }  

  // 날짜 포맷팅
  const formatDate = (date) => {
    return new Date(date).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 로딩 중 스켈레톤 UI 표시
  if (isLoading) {
    return (
      <Layout>
        <div className="admin-inquiries max-w-6xl mx-auto px-4">
          <div className="admin-header">
            <h1>질문/답변 관리</h1>
          </div>

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
        <div className="admin-header">
          <h1>질문/답변 관리</h1>
        </div>

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
          <select value={filterStatus} onChange={handleStatusFilterChange} 
          className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white text-gray-800 focus:outline-none">
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
    {/* 상세 보기 (항상 표시) */}
    <Button
      variant="ghost"
      size="icon"
      onClick={() => handleViewDetail(inquiry.id)}
    >
      <Eye className="w-5 h-5 text-blue-500" />
    </Button>

    {/* 답변하기 (답변 전일 때만 표시) */}
    {inquiry.status === "pending" && (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleViewDetail(inquiry.id)}
      >
        <MessageSquare className="w-5 h-5 text-green-600" />
      </Button>
    )}

    {/* 삭제 */}
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

export default InquiriesPage
