"use client";
import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import "../../styles/AdminFacilitiesListPage.css";

// 날짜 포맷 함수
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR");
};

const FacilitiesListPage = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      const dummyFacilities = [
        {
          id: 1,
          name: "행복요양원",
          type: "요양원",
          address: "서울시 강남구 테헤란로 123",
          status: "approved",
          phone: "02-123-4567",
          rating: 4.2,
          reviewCount: 10,
          createdAt: "2023-05-01",
        },
        {
          id: 2,
          name: "미소요양병원",
          type: "요양병원",
          address: "서울시 서초구 서초대로 456",
          status: "approved",
          phone: "02-234-5678",
          rating: 4.0,
          reviewCount: 8,
          createdAt: "2023-06-10",
        },
        {
          id: 3,
          name: "푸른실버타운",
          type: "실버타운",
          address: "경기도 고양시 일산동구 중앙로 789",
          status: "approved",
          phone: "031-345-6789",
          rating: 3.8,
          reviewCount: 12,
          createdAt: "2023-07-15",
        },
      ];
      setFacilities(dummyFacilities);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleViewDetail = (id) => {
    navigate(`/admin/facilities/${id}`);
  }  

  const handleEdit = (id) => navigate(`/admin/facilities/${id}/edit`);
  const handleDelete = (id) => {
    if (window.confirm("정말로 이 시설을 삭제하시겠습니까?")) {
      setFacilities(facilities.filter((facility) => facility.id !== id));
    }
  };
  const handleAddNewFacility = () => navigate("/admin/facilities/new");
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStatusFilterChange = (e) => setFilterStatus(e.target.value);
  const handleTypeFilterChange = (e) => setFilterType(e.target.value);
  const handleStatusChange = (id, newStatus) => {
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
  };
  const handlePageChange = (page) => setCurrentPage(page);

  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch =
      facility.name.includes(searchTerm) ||
      facility.address.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" || facility.status === filterStatus;
    const matchesType = filterType === "all" || facility.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalFilteredPages = Math.ceil(filteredFacilities.length / 10);
  const currentFacilities = filteredFacilities.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            승인
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
            대기중
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            거부됨
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            알 수 없음
          </span>
        );
    }
  };
  

  if (isLoading) {
    return (
      <Layout>
        <div className="admin-facilities-list max-w-6xl mx-auto px-4">
          <div className="admin-header">
            <h1>시설 관리</h1>
            <Skeleton className="admin-button-skeleton" />
          </div>
          <Skeleton className="admin-search-skeleton" />
          <Skeleton className="admin-table-skeleton" height="400px" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="admin-facilities-list max-w-6xl mx-auto px-4">
        <div className="admin-header">
          <h1>시설 관리</h1>
          <Button variant="primary" onClick={handleAddNewFacility}>
            새 시설 등록
          </Button>
        </div>



        {/* 필터 영역 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 mb-6">
  {/* 검색창 */}
  <div className="relative w-full">
  <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
  <input
    type="text"
    placeholder="시설명 검색"
    value={searchTerm}
    onChange={handleSearchChange}
    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 bg-white outline-none"
  />
</div>





  {/* 필터 셀렉트 */}
  <div className="w-full sm:w-1/3">
    <select
      value={filterType}
      onChange={handleTypeFilterChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-800 focus:outline-none"
    >
      <option value="all">전체</option>
      <option value="요양원">요양원</option>
      <option value="요양병원">요양병원</option>
      <option value="실버타운">실버타운</option>
      <option value="방문요양">방문요양</option>
      <option value="방문간호">방문간호</option>
      <option value="주야간보호">주야간보호</option>
    </select>
  </div>
</div>



        {/* 테이블 영역 */}
        {currentFacilities.length === 0 ? (
          <div className="admin-empty-state py-10 text-center text-gray-500 text-sm">
            검색 조건에 맞는 시설이 없습니다.
          </div>
        ) : (
          <>
            <div className="admin-table-container">
  <table className="admin-table ">
    <thead>
      <tr>
        <th className="px-6 py-4">시설명</th>
        <th className="px-6 py-4">유형</th>
        <th className="px-6 py-4">주소</th>
        <th className="px-6 py-4">상태</th>
        <th className="px-6 py-4">관리</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {currentFacilities.map((facility) => (
        <tr key={facility.id} className="h-16">
          <td>{facility.name}</td>
          <td>{facility.type}</td>
          <td>{facility.address}</td>
          <td>{getStatusBadge(facility.status)}</td>
          <td className="px-6 py-4">
  <div className="flex justify-start items-center gap-5">
    <Button
      variant="ghost"
      size="icon"
      onClick={() => handleViewDetail(facility.id)}
    >
      <Eye className="w-5 h-5 text-blue-500" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => handleEdit(facility.id)}
    >
      <Pencil className="w-5 h-5 text-orange-500" />
    </Button>
    {facility.status === "pending" && (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleStatusChange(facility.id, "approved")}
        >
          <span className="text-green-600 text-xs">승인</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleStatusChange(facility.id, "rejected")}
        >
          <span className="text-red-500 text-xs">거부</span>
        </Button>
      </>
    )}
    <Button
      variant="ghost"
      size="icon"
      onClick={() => handleDelete(facility.id)}
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
              <div className="admin-pagination flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  이전
                </Button>
                {Array.from({ length: totalFilteredPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    size="sm"
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === totalFilteredPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default FacilitiesListPage;
