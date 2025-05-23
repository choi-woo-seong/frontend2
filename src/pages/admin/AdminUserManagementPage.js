import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Button } from "../../components/ui/Button";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const AdminUserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers(res.data);
      } catch (err) {
        console.error("회원 목록 불러오기 실패:", err);
        alert("회원 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [token]);

  const filteredMembers = searchTerm
    ? members.filter((member) =>
        (member.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : members;

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말로 이 회원을 탈퇴 처리하시겠습니까?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers((prev) => prev.filter((m) => m.id !== id));
      if (selectedMember?.id === id) setShowModal(false);
    } catch (err) {
      console.error("회원 삭제 실패:", err);
      alert("회원 탈퇴 처리에 실패했습니다.");
    }
  };

  return (
    <Layout>
      <div className="admin-facilities-list max-w-6xl mx-auto px-4">
        <div className="admin-header">
          <h1>회원 관리</h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4 mb-6">
          <div className="relative w-full">
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="회원 이름 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 bg-white outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">회원 정보를 불러오는 중...</div>
        ) : paginatedMembers.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-sm">
            검색 조건에 맞는 회원이 없습니다.
          </div>
        ) : (
          <>
            <div className="admin-table-container">
              <table className="admin-table w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">이름</th>
                    <th className="px-6 py-4">이메일</th>
                    <th className="px-6 py-4">연락처</th>
                    <th className="px-6 py-4">가입일</th>
                    <th className="px-6 py-4">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedMembers.map((member) => (
                    <tr key={member.id} className="h-14">
                      <td className="px-6 py-2">{member.userId || member.oauthId}</td>
                      <td className="px-6 py-2 font-medium text-gray-900">{member.name ?? '-'}</td>
                      <td className="px-6 py-2 text-gray-700">{member.email ?? '-'}</td>
                      <td className="px-6 py-2 text-gray-700">{member.phone ?? '-'}</td>
                      <td className="px-6 py-2 text-gray-700">
                        {member.createdAt?.substring(0, 10) ?? '-'}
                      </td>
                      <td className="px-6 py-2">
                        <div className="flex gap-3">
                          <Button size="sm" variant="outline" onClick={() => handleView(member)}>
                            정보 보기
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500"
                            onClick={() => handleDelete(member.id)}
                          >
                            탈퇴 처리
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ 페이지네이션 UI */}
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                className="px-3 py-1 rounded-md text-sm bg-white border text-gray-500 disabled:text-gray-300"
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
              >
                이전
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md text-sm border ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded-md text-sm bg-white border text-gray-500 disabled:text-gray-300"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          </>
        )}

        {showModal && selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg w-full max-w-md p-6 relative">
              <h2 className="text-lg font-semibold mb-4">회원 상세 정보</h2>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                ×
              </button>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>회원 ID:</strong> {selectedMember.userId}</p>
                <p><strong>이름:</strong> {selectedMember.name}</p>
                <p><strong>이메일:</strong> {selectedMember.email}</p>
                <p><strong>연락처:</strong> {selectedMember.phone}</p>
                <p><strong>가입일:</strong> {selectedMember.createdAt?.substring(0, 10) ?? '-'}</p>
              </div>
              <div className="mt-6 text-right">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  닫기
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminUserManagementPage;
