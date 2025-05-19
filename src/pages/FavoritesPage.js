"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNavigation from "../components/BottomNavigation";
import { Button } from "../components/ui/Button";
import { ChevronLeft } from "lucide-react";
import "../styles/FavoritesPage.css";

function FavoritesPage() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const alertedRef = useRef(false);

  const typeKorMap = {
    nursing_hospital: "요양병원",
    nursing_home: "요양원",
    silver_town: "실버타운",
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      if (!alertedRef.current) {
        alert("로그인 후 이용 가능합니다.");
        alertedRef.current = true;
        navigate("/");
      }
      return;
    }

    fetchFavorites(token);
  }, [navigate]);



  const fetchFavorites = async (token) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/bookmarks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(res.data);
    } catch (err) {
      console.error("찜한 시설 목록 불러오기 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (facilityId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${API_BASE_URL}/bookmarks/${facilityId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites((prev) => prev.filter((f) => f.facilityId !== facilityId));
    } catch (err) {
      console.error("찜 삭제 실패:", err);
    }
  };

  const groupedFavorites = ["요양병원", "요양원", "실버타운"].map((category) => ({
    category,
    items: favorites.filter((f) => typeKorMap[f.type] === category),
  }));
const handleClearAll = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    await axios.delete(`${API_BASE_URL}/bookmarks/deleteAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setFavorites([]); // ✅ 상태 비워서 UI도 즉시 갱신
  } catch (error) {
    console.error("찜 전체 삭제 실패:", error);
  }
};

<<<<<<< HEAD

  const handleClearAll = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/bookmarks/deleteAll`);
      window.location.reload();
    } catch (error) {
      console.error("찜 전체 삭제 실패:", error);
    }
  };
=======
>>>>>>> d074b31c504aa5dbccc242aaafac01615388e09c

  return (
    <div className="favorites-page">
      <header className="page-header">
        <div className="container">
          <Link to="/" className="mr-2">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <h1>찜한 목록</h1>
        </div>
      </header>

      <main className="page-content">
        <div className="container">
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : favorites.length > 0 ? (
            <div className="favorites-list">
              <div className="list-header">
                <h2>찜한 시설 ({favorites.length})</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="clear-all-button"
                  onClick={handleClearAll}
                >
                  전체 삭제
                </Button>
              </div>

         {groupedFavorites.map(
  (group) =>
    group.items.length > 0 && (
      <div key={group.category}>
        <h3 className="text-lg font-semibold my-4">{group.category}</h3>
        <ul className="facility-list">
          {group.items.map((fac) => (
        <li
  key={fac.facilityId}
  className="facility-item flex justify-between items-start gap-6 py-6 border-b"
  onClick={() => (window.location.href = `/facility/${fac.facilityId}`)}
  style={{ cursor: "pointer" }}
>
  <div className="facility-info flex-1">
    {/* 병원 이름 */}
    <h3 className="text-lg font-semibold">{fac.name}</h3>

    {/* 병원이름 밑에 태그 정렬 */}
    <div className="flex items-center flex-wrap gap-2 mt-1 mb-2">
      {fac.grade && (
        <span className="facility-tag grade-tag text-blue-600">등급: {fac.grade}</span>
      )}
      {fac.facilitySize && (
        <span className="facility-tag">규모: {fac.facilitySize}</span>
      )}
      {fac.establishedYear && (
        <span className="facility-tag">
          설립 {new Date().getFullYear() - fac.establishedYear}년
        </span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeFavorite(fac.facilityId);
        }}
        className="text-red-500 text-sm hover:underline ml-4"
      >
        삭제
      </button>
    </div>

    {/* 주소 */}
    <p className="facility-address">{fac.address}</p>
  </div>

<div className="w-32 h-32 flex-shrink-0">  {/* ✅ 기존 24 → 32 (8rem) */}
  <img
    src={fac.imageUrls || "/placeholder.svg"}
    onError={(e) => {
      e.target.src = "/placeholder.svg";
    }}
    alt={fac.name}
    className="w-full h-full object-cover rounded"
  />
</div>

</li>


          ))}
        </ul>
      </div>
    )
)}

            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="empty-heart-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h2 className="empty-title">찜한 시설이 없습니다</h2>
              <p className="empty-description">
                마음에 드는 시설을 찾아 하트 버튼을 눌러보세요.
              </p>
              <Link to="/search">
                <button className="empty-search-button">시설 찾아보기</button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}

export default FavoritesPage;
