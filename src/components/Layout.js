"use client"

import {useState, useEffect, useRef} from "react"
import {Link, useLocation, useNavigate} from "react-router-dom"
import {
    Search,
    Menu,
    X,
    User,
    ShoppingCart,
    Heart
} from "lucide-react"
import BottomNavigation from "./BottomNavigation"
import NoticeBar from "./NoticeBar"
import Chatbot from "./chatbot"
import {useAuth} from "../hooks/use-auth"
import {ChevronLeft, LogOut} from "lucide-react"

const Layout = ({children}) => {
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navigate = useNavigate()

    // 로그인 상태 확인
    const {isLoggedIn, isAdmin, logout} = useAuth()
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

    const [showUserMenu, setShowUserMenu] = useState(false)
    const userMenuRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return() => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [userMenuRef])

    // 메뉴 토글 함수
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    // 로그아웃 처리
    const handleLogout = () => {
        logout()
        setShowLogoutConfirm(false)
    }

    // 관리자 페이지인지 확인
    const isAdminPage = location
        .pathname
        .startsWith("/admin")

    // 관리자 페이지일 경우 다른 레이아웃 사용
    if (isAdmin && isAdminPage) {
        return (
            <div className="flex flex-col min-h-screen">
                {/* 관리자 헤더 */}
                <header className="bg-white border-b sticky top-0 z-20 border-b">
                    <div className="flex items-center justify-between container mx-auto px-4 py-3">
                        {/* 왼쪽: 뒤로가기 + 관리자 대시보드 */}
                        <div className="flex items-center space-x-2">
                            <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black">
                                <ChevronLeft className="w-5 h-5"/>
                            </button>
                            <h1 className="text-lg font-bold text-gray-900 py-4">관리자 대시보드</h1>
                        </div>

                        {/* 오른쪽: 로그아웃 */}
                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                            <LogOut className="w-4 h-4 mr-1"/>
                            로그아웃
                        </button>
                    </div>

                    {/* 탭 메뉴 블록 전체 */}
                    <div className="bg-gray-50 py-3">
  <div className="container mx-auto px-4">
    <div className="flex justify-between bg-gray-100 rounded-lg px-2 py-0.3">
      {[
        { label: "대시보드", path: "/admin/dashboard" },
        { label: "시설 관리", path: "/admin/facilities" },
        { label: "상품 관리", path: "/admin/products" },
        { label: "회원 관리", path: "/admin/users" },
        { label: "질문/답변 관리", path: "/admin/questions" },
      ].map(({ label, path }) => {
        const isActive =
          location.pathname === path ||
          location.pathname.startsWith(path) ||
          (path === "/admin/products" && location.pathname.startsWith("/admin/sales"))

        return (
          <Link
            key={path}
            to={path}
            className={`flex-1 text-center py-3 rounded-md text-sm font-medium transition-all duration-200
              ${isActive ? "bg-white text-gray-900 shadow font-semibold" : "text-gray-500 hover:text-gray-900"}`}
          >
            {label}
          </Link>
        )
      })}
    </div>
  </div>
</div>


                </header>

                {/* 메인 콘텐츠 */}
                <main className="flex-grow bg-gray-100">{children}</main>

                {/* 로그아웃 확인 모달 */}
                {
                    showLogoutConfirm && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                                <h3 className="text-lg font-medium mb-4">로그아웃</h3>
                                <p className="mb-6">정말 로그아웃 하시겠습니까?</p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setShowLogoutConfirm(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                        취소
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                        로그아웃
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }

    return (
        <div className="layout">
          {/* 관리자 페이지가 아닐 때만 NoticeBar 표시 */}
          {!isAdminPage && <NoticeBar />}
      
          {/* 헤더 */}
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              {/* 로고 */}
              <Link to="/" className="flex items-center">
                <img src="/logo.svg" alt="실버타운 로고" className="h-8" />
              </Link>
      
              {/* 검색 버튼 */}
              <Link to="/search" className="p-2 rounded-full hover:bg-gray-100">
                <Search className="h-5 w-5" />
                <span className="sr-only">검색</span>
              </Link>
      
              {/* 모바일 메뉴 버튼 */}
              <button
                className="p-2 rounded-full hover:bg-gray-100 md:hidden"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">메뉴</span>
              </button>
      
              {/* 데스크탑 네비게이션 */}
              <nav className="hidden md:flex items-center space-x-4">
                <Link to="/search" className="text-sm hover:text-blue-500">
                  시설찾기
                </Link>
                <Link to="/products" className="text-sm hover:text-blue-500">
                  제품
                </Link>
                <Link to="/videos" className="text-sm hover:text-blue-500">
                  영상
                </Link>
                <Link to="/notices" className="text-sm hover:text-blue-500">
                  공지사항
                </Link>
      
                {/* 로그인 상태에 따른 메뉴 */}
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/favorites"
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <Heart className="h-5 w-5" />
                      <span className="sr-only">찜 목록</span>
                    </Link>
                    <Link
                      to="/cart"
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span className="sr-only">장바구니</span>
                    </Link>
                    <div className="relative" ref={userMenuRef}>
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 flex items-center"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                      >
                        <User className="h-5 w-5" />
                        <span className="sr-only">프로필</span>
                      </button>
      
                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            프로필
                          </Link>
                          <Link
                            to="/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            주문 내역
                          </Link>
                          {isAdmin && (
                            <Link
                              to="/admin/dashboard"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowUserMenu(false)}
                            >
                              관리자 페이지
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              setShowLogoutConfirm(true);
                              setShowUserMenu(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            로그아웃
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="text-sm font-medium text-blue-500 hover:text-blue-600"
                  >
                    로그인
                  </Link>
                )}
              </nav>
            </div>
      
            {/* 모바일 메뉴 */}
            {isMenuOpen && (
              <div className="md:hidden bg-white border-t">
                <div className="container mx-auto px-4 py-2">
                  <nav className="flex flex-col space-y-2">
                    <Link
                      to="/search"
                      className="py-2 hover:text-blue-500"
                      onClick={toggleMenu}
                    >
                      시설찾기
                    </Link>
                    <Link
                      to="/products"
                      className="py-2 hover:text-blue-500"
                      onClick={toggleMenu}
                    >
                      제품
                    </Link>
                    <Link
                      to="/videos"
                      className="py-2 hover:text-blue-500"
                      onClick={toggleMenu}
                    >
                      영상
                    </Link>
                    <Link
                      to="/notices"
                      className="py-2 hover:text-blue-500"
                      onClick={toggleMenu}
                    >
                      공지사항
                    </Link>
      
                    {/* 로그인 상태에 따른 메뉴 */}
                    {isLoggedIn ? (
                      <>
                        <Link
                          to="/favorites"
                          className="py-2 hover:text-blue-500"
                          onClick={toggleMenu}
                        >
                          찜 목록
                        </Link>
                        <Link
                          to="/cart"
                          className="py-2 hover:text-blue-500"
                          onClick={toggleMenu}
                        >
                          장바구니
                        </Link>
                        <Link
                          to="/profile"
                          className="py-2 hover:text-blue-500"
                          onClick={toggleMenu}
                        >
                          프로필
                        </Link>
                        <button
                          className="py-2 text-left text-red-500 hover:text-red-600 font-medium"
                          onClick={() => {
                            setShowLogoutConfirm(true);
                            toggleMenu();
                          }}
                        >
                          로그아웃
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="py-2 font-medium text-blue-500 hover:text-blue-600"
                        onClick={toggleMenu}
                      >
                        로그인
                      </Link>
                    )}
                  </nav>
                </div>
              </div>
            )}
          </header>
      
            {/* 메인 콘텐츠 */}
            <main className="main-content">{children}</main>

            {/* 푸터 */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
                        <div className="space-y-2">
                            <h3 className="font-semibold mb-2">회사 정보</h3>
                            <p>실버타운 주식회사</p>
                            <p>사업자등록번호: 123-45-67890</p>
                            <p>대표: 홍길동</p>
                            <p>주소: 서울시 강남구 테헤란로 123</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold mb-2">고객센터</h3>
                            <p>전화: 1588-1234</p>
                            <p>이메일: help@silvertown.com</p>
                            <p>운영시간: 평일 9:00 - 18:00</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold mb-2">서비스</h3>
                            <Link to="/search" className="block hover:underline">
                                시설찾기
                            </Link>
                            <Link to="/products" className="block hover:underline">
                                제품
                            </Link>
                            <Link to="/videos" className="block hover:underline">
                                영상
                            </Link>
                            <Link to="/care-grade-test" className="block hover:underline">
                                등급판정 테스트
                            </Link>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold mb-2">정보</h3>
                            <Link to="/notices" className="block hover:underline">
                                공지사항
                            </Link>
                            <Link to="/welfare-news" className="block hover:underline">
                                복지뉴스
                            </Link>
                            <Link to="/government-programs" className="block hover:underline">
                                정부지원사업
                            </Link>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold mb-2">약관</h3>
                            <Link to="/terms" className="block hover:underline">
                                이용약관
                            </Link>
                            <Link to="/privacy" className="block hover:underline">
                                개인정보처리방침
                            </Link>
                            <Link to="/location-terms" className="block hover:underline">
                                위치정보 이용약관
                            </Link>
                        </div>
                    </div>
                    <div className="mt-8 pt-4 border-t border-gray-700 text-sm text-gray-400">
                        <p>© {new Date().getFullYear()}
                            실버타운 주식회사. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* 모바일 하단 네비게이션 */}
            {!isAdminPage && <BottomNavigation/>}

            {/* 챗봇 */}
            <Chatbot/> {/* 로그아웃 확인 모달 */}
            {
                showLogoutConfirm && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                            <h3 className="text-lg font-medium mb-4">로그아웃</h3>
                            <p className="mb-6">정말 로그아웃 하시겠습니까?</p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                    취소
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                    로그아웃
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Layout
