"use client";

import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Button } from "../../components/ui/Button";
import { FaSearch } from "react-icons/fa";

const AdminUserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null); // 모달에 보여줄 회원
  const [showModal, setShowModal] = useState(false); // 모달 열림 여부

  useEffect(() => {
    setTimeout(() => {
      const dummyMembers = [
        {
          id: 1,
          userId: "kimcs",
          name: "김철수",
          email: "kim@example.com",
          phone: "010-1234-5678",
          joinDate: "2023-01-15",
          birth: "1965-05-20",
          gender: "남성",
          address: "서울시 강남구 역삼동 123-45",
        },
        {
          id: 2,
          userId: "leeyh",
          name: "이영희",
          email: "lee@example.com",
          phone: "010-2345-6789",
          joinDate: "2023-02-20",
          birth: "1970-08-10",
          gender: "여성",
          address: "서울시 서초구 방배동 123-11",
        },
        // ... 추가 회원 생략 ...
      ];
      setMembers(dummyMembers);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("정말로 이 회원을 탈퇴 처리하시겠습니까?")) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      if (selectedMember?.id === id) setShowModal(false);
    }
  };

  return (
    <Layout>
      <div className="admin-facilities-list max-w-6xl mx-auto px-4">
        <div className="admin-header">
          <h1>회원 관리</h1>
        </div>

        {/* 검색창 */}
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

        {/* 테이블 */}
        {filteredMembers.length === 0 ? (
          <div className="admin-empty-state py-10 text-center text-gray-500 text-sm">
            검색 조건에 맞는 회원이 없습니다.
          </div>
        ) : (
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
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="h-14">
                    <td className="px-6 py-2">{member.id}</td>
                    <td className="px-6 py-2 font-medium text-gray-900">{member.name}</td>
                    <td className="px-6 py-2 text-gray-700">{member.email}</td>
                    <td className="px-6 py-2 text-gray-700">{member.phone}</td>
                    <td className="px-6 py-2 text-gray-700">{member.joinDate}</td>
                    <td className="px-6 py-2 flex gap-3">
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

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 모달 */}
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
                <p><strong>주소:</strong> {selectedMember.address}</p>
                <p><strong>생년월일:</strong> {selectedMember.birth}</p>
                <p><strong>성별:</strong> {selectedMember.gender}</p>
                <p><strong>가입일:</strong> {selectedMember.joinDate}</p>
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