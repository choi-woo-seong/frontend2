"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import { Button } from "../../components/ui/Button"
import Skeleton from "../../components/ui/Skeleton"
import { FaSearch } from "react-icons/fa"
import { MessageSquare, Trash2 } from "lucide-react"
import "./AdminInquiriesPage.css"

const API_BASE_URL = process.env.REACT_APP_API_URL

const InquiriesPage = () => {
  const navigate = useNavigate()
  const [inquiries, setInquiries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
useEffect(() => {
  const fetchInquiries = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return navigate("/login");

    try {
      setIsLoading(true);
      
      // ✅ 탭에 따라 API 경로 결정
      let url = `${API_BASE_URL}/questions`;
      if (activeTab === "product" || activeTab === "facility") {
        url += `/type/${activeTab}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) return navigate("/login");
      if (!res.ok) throw new Error("문의 목록 로드 실패");

      const data = await res.json();
      const formatted = data.map((q) => ({
        id: q.id,
        title: q.title,
        content: q.content,
        userName: q.userId || "",
        userDbId: q.userDbId || 0,
        status: q.answer ? "answered" : "pending",
        createdAt: q.createdAt,
        answeredAt: q.answer?.createdAt || null,
        targetType: q.targetType || "unknown",
        targetName: q.targetName || "N/A",
      }));

      setInquiries(formatted);
      setTotalPages(Math.ceil(formatted.length / 10));
    } catch (err) {
      console.error("문의 목록 로드 중 오류 발생:", err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchInquiries();
}, [navigate, activeTab]); // ✅ activeTab이 바뀌면 다시 호출되도록


  const handleViewDetail = (id) => navigate(`/admin/questions/${id}`)

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("정말로 이 문의를 삭제하시겠습니까?")) return
    const token = localStorage.getItem("accessToken")
    if (!token) return navigate("/login")
    try {
      const res = await fetch(`${API_BASE_URL}/questions/${id}`, {
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
    const matchType =
      activeTab === "all" ||
      (activeTab === "product" && q.targetType === "product") ||
      (activeTab === "facility" && q.targetType === "facility")
    return matchSearch && matchStatus && matchType
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

  const formatDate = (date) =>
    new Date(date).toLocaleString("ko-KR", {
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

      {/* ✅ 상단 제목 */}
      <div className="admin-header mt-6 mb-4">
        <h1 className="text-xl font-semibold">질문/답변 관리</h1>
      </div>

      {/* ✅ 탭 영역 */}
      <div className="mt-4 mb-6">
        <div className="bg-gray-50 rounded-md flex overflow-hidden">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2 px-4 text-sm font-medium text-center ${
              activeTab === "all"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-800 hover:bg-gray-100"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setActiveTab("product")}
            className={`flex-1 py-2 px-4 text-sm font-medium text-center ${
              activeTab === "product"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-800 hover:bg-gray-100"
            }`}
          >
            상품 문의
          </button>
          <button
            onClick={() => setActiveTab("facility")}
            className={`flex-1 py-2 px-4 text-sm font-medium text-center ${
              activeTab === "facility"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-800 hover:bg-gray-100"
            }`}
          >
            시설 문의
          </button>
        </div>
      </div>

      {/* ✅ 필터 및 검색 영역 */}
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

      {/* ✅ 테이블 or Empty 결과 */}
      {filteredInquiries.length === 0 ? (
        <div className="admin-empty-state mt-6 text-center text-gray-500">
          <p>검색 조건에 맞는 문의가 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="admin-table-container mt-4">
            <table className="admin-table w-full">
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
                    <td className="inquiry-title">
                      {inquiry.title}
                      <div className="text-xs text-gray-400">
                        ({inquiry.targetType === "product"
                          ? "상품"
                          : inquiry.targetType === "facility"
                          ? "시설"
                          : "기타"}
                        : {inquiry.targetName})
                      </div>
                    </td>
                    <td>{inquiry.userName}</td>
                    <td>{getStatusBadge(inquiry.status)}</td>
                    <td>{formatDate(inquiry.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-start items-center gap-5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetail(inquiry.id)}
                        >
                          <MessageSquare className="w-5 h-5 text-green-600" />
                        </Button>
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

          {/* ✅ 페이지네이션 */}
          {totalFilteredPages > 1 && (
            <div className="admin-pagination mt-6 flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm rounded border transition ${
                  currentPage === 1
                    ? "bg-white text-gray-400 border-gray-300 cursor-not-allowed"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                }`}
              >
                이전
              </button>

              {[...Array(totalFilteredPages)].map((_, i) => {
                const page = i + 1;
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 text-sm rounded border transition ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalFilteredPages}
                className={`px-4 py-2 text-sm rounded border transition ${
                  currentPage === totalFilteredPages
                    ? "bg-white text-gray-400 border-gray-300 cursor-not-allowed"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                }`}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  </Layout>
);

}

export default InquiriesPage
