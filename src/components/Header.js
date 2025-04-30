"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/use-auth"

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { isLoggedIn, user, logout } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout()
    }
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          케어파인더
        </Link>

        {/* 데스크톱 메뉴 */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/search" className="text-gray-700 hover:text-blue-600">
            시설찾기
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-blue-600">
            복지용품
          </Link>
          <Link to="/notices" className="text-gray-700 hover:text-blue-600">
            공지사항
          </Link>
          <Link to="/care-grade-test" className="text-gray-700 hover:text-blue-600">
            요양등급 테스트
          </Link>
        </nav>

        {/* 데스크톱 사용자 메뉴 */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <span className="mr-2">{user?.name || "사용자"}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/favorites"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    즐겨찾기
                  </Link>
                  <Link
                    to="/cart"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    장바구니
                  </Link>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      handleLogout()
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                로그인
              </Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                회원가입
              </Link>
            </>
          )}
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 shadow-lg">
          <nav className="flex flex-col space-y-3">
            <Link to="/search" className="text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMenuOpen(false)}>
              시설찾기
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-blue-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              복지용품
            </Link>
            <Link to="/notices" className="text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMenuOpen(false)}>
              공지사항
            </Link>
            <Link
              to="/care-grade-test"
              className="text-gray-700 hover:text-blue-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              요양등급 테스트
            </Link>

            {isLoggedIn ? (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="text-sm text-gray-500">{user?.name || "사용자"} 님</div>
                <Link
                  to="/favorites"
                  className="text-gray-700 hover:text-blue-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  즐겨찾기
                </Link>
                <Link
                  to="/cart"
                  className="text-gray-700 hover:text-blue-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  장바구니
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    handleLogout()
                  }}
                  className="text-left text-red-600 hover:text-red-700 py-2"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
