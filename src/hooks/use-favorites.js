"use client"

import { useState, useEffect, createContext, useContext } from "react"

// 찜한 시설 타입 정의
// 백엔드 API 응답 구조에 맞게 수정 필요
/**
 * @typedef {Object} Facility
 * @property {string|number} id - 시설 고유 ID
 * @property {string} name - 시설 이름
 * @property {string} address - 시설 주소
 * @property {string} [grade] - 시설 등급
 * @property {string} [image] - 시설 이미지 URL
 * @property {string[]} [tags] - 시설 태그 목록
 */

// 컨텍스트 생성
const FavoritesContext = createContext(undefined)

/**
 * 찜 목록 관리 프로바이더 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])

  // 로컬 스토리지에서 찜 목록 불러오기
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites")
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error)
      }
    }
  }, [])

  // 찜 목록 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  /**
   * 찜 추가
   *
   * @param {Facility} facility - 찜할 시설 정보
   */
  const addFavorite = (facility) => {
    setFavorites((prev) => {
      if (prev.some((item) => item.id === facility.id)) {
        return prev
      }
      return [...prev, facility]
    })

    // TODO: 백엔드 API 연동 - 사용자가 로그인한 경우 서버에 찜 목록 동기화
    // axios.post('/api/favorites', { facilityId: facility.id })
    //   .then(response => console.log('Favorite added to server'))
    //   .catch(error => console.error('Failed to add favorite to server', error));
  }

  /**
   * 찜 제거
   *
   * @param {string|number} id - 제거할 시설 ID
   */
  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((facility) => facility.id !== id))

    // TODO: 백엔드 API 연동 - 사용자가 로그인한 경우 서버에 찜 목록 동기화
    // axios.delete(`/api/favorites/${id}`)
    //   .then(response => console.log('Favorite removed from server'))
    //   .catch(error => console.error('Failed to remove favorite from server', error));
  }

  /**
   * 찜 여부 확인
   *
   * @param {string|number} id - 확인할 시설 ID
   * @returns {boolean} 찜 여부
   */
  const isFavorite = (id) => {
    return favorites.some((facility) => facility.id === id)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

/**
 * 찜 목록 관리 훅
 *
 * @returns {Object} 찜 목록 관리 객체
 * @returns {Facility[]} returns.favorites - 찜 목록
 * @returns {Function} returns.addFavorite - 찜 추가 함수
 * @returns {Function} returns.removeFavorite - 찜 제거 함수
 * @returns {Function} returns.isFavorite - 찜 여부 확인 함수
 */
export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
