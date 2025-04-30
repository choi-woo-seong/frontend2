"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useFavorites } from "../hooks/use-favorites"
import BottomNavigation from "../components/BottomNavigation"
import { Button } from "../components/ui/Button"
import { ChevronLeft } from "lucide-react" // ✅ 추가
import '../styles/FavoritesPage.css'

function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleClearAll = () => {
    alert("전체 삭제 기능은 현재 개발 중입니다.")
  }

  return (
    <div className="favorites-page">
      {/* 헤더 */}
      <header className="page-header">
        <div className="container">
          {/* ✅ 여기만 수정 */}
          <Link to="/" className="mr-2">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <h1>찜한 목록</h1>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
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
                <Button variant="ghost" size="sm" className="clear-all-button" onClick={handleClearAll}>
                  전체 삭제
                </Button>
              </div>

              {favorites.map((facility) => (
                <div key={facility.id} className="facility-card">
                  <Link to={`/facility/${facility.id}`} className="facility-link">
                    <div className="facility-content">
                      <div className="facility-image">
                        <img src={facility.image || "/placeholder.svg"} alt={facility.name} />
                      </div>
                      <div className="facility-info">
                        <h3>{facility.name}</h3>
                        <p className="facility-address">{facility.address}</p>
                        <div className="facility-tags">
                          {facility.grade && <div className="facility-grade">{facility.grade}</div>}
                          {facility.tags && facility.tags.length > 0 && (
                            <span className="facility-tag">{facility.tags[0]}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="facility-actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="delete-button"
                      onClick={() => removeFavorite(facility.id)}
                    >
                      <i className="icon-trash"></i>
                      삭제
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="empty-heart-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>

              <h2 className="empty-title">찜한 시설이 없습니다</h2>
              <p className="empty-description">마음에 드는 시설을 찾아 하트 버튼을 눌러보세요.</p>
              <Link to="/search">
                <button className="empty-search-button">
                  시설 찾아보기
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  )
}

export default FavoritesPage
