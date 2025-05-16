"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BottomNavigation from "../components/BottomNavigation";
import { Button } from "../components/ui/Button";
import { ChevronLeft } from "lucide-react";
import "../styles/FavoritesPage.css";

function FavoritesPage() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 영어 type → 한글 매핑
  const typeKorMap = {
    nursing_hospital: "요양병원",
    nursing_home: "요양원",
    silver_town: "실버타운",
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${API_BASE_URL}/bookmarks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("찜 목록:", res.data);
      setFavorites(res.data);
    } catch (err) {
      console.error("찜한 시설 목록 불러오기 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (facilityId) => {
    try {
      await axios.delete(`${API_BASE_URL}/bookmarks/${facilityId}`);
      setFavorites((prev) => prev.filter((f) => f.facilityId !== facilityId));
    } catch (err) {
      console.error("찜 삭제 실패:", err);
    }
  };

  // 한글 기준 그룹핑
  const groupedFavorites = ["요양병원", "요양원", "실버타운"].map(
    (category) => ({
      category,
      items: favorites.filter((f) => typeKorMap[f.type] === category),
    })
  );

  const handleClearAll = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/bookmarks/deleteAll`);
    } catch (error) {
      console.error("찜 전체 삭제 실패:", error);
    }
  };

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
                      <h3 className="text-lg font-semibold my-4">
                        {group.category}
                      </h3>
                      <ul className="facility-list">
                        {group.items.map((fac) => (
                          <li
                            key={fac.facilityId}
                            className="facility-item"
                            onClick={() =>
                              (window.location.href = `/facility/${fac.facilityId}`)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <div className="facility-info">
                              {/* 🧱 삭제 버튼을 위쪽에 노출 */}
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-base font-semibold">
                                  {fac.name}
                                </h3>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFavorite(fac.facilityId);
                                  }}
                                  className="text-red-500 text-sm px-2 py-1 hover:underline"
                                >
                                  삭제
                                </button>
                              </div>

                              {/* ✅ 정보 태그 */}
                              <div className="facility-text justify-between items-start mb-2">
                                {fac.grade && (
                                  <span className="facility-tag grade-tag">
                                    등급: {fac.grade}
                                  </span>
                                )}
                                {fac.facilitySize && (
                                  <span className="facility-tag size-tag">
                                    규모: {fac.facilitySize}
                                  </span>
                                )}
                                {fac.establishedYear && (
                                  <span className="facility-tag">
                                    설립{" "}
                                    {new Date().getFullYear() -
                                      fac.establishedYear}
                                    년
                                  </span>
                                )}
                              </div>

                              {/* 🖼 이미지 */}
                              <div className="facility-image-container mt-2">
                                <img
                                  src={fac.imageUrls || "/placeholder.svg"}
                                  onError={(e) => {
                                    e.target.src = "/placeholder.svg";
                                  }}
                                  alt={fac.name}
                                />
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <hr className="my-6 border-t" />
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
