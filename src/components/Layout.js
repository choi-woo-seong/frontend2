// src/components/Layout.jsx
"use client"

import {useState, useEffect, useRef} from "react"
import {Link, useLocation, useNavigate} from "react-router-dom"
import {
    Search,
    Menu,
    X,
    User,
    ShoppingCart,
    Heart,
    ChevronLeft,
    LogOut
} from "lucide-react"
import BottomNavigation from "./BottomNavigation"
import NoticeBar from "./NoticeBar"
import Chatbot from "./chatbot"
import {useAuth} from "../hooks/use-auth"

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
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // 메뉴 토글
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    // 로그아웃 처리
    const handleLogout = () => {
        logout()
        setShowLogoutConfirm(false)
        navigate("/login")      // ← 여기서 로그인 페이지로 이동합니다
    }

    // 관리자 페이지 여부
    const isAdminPage = location.pathname.startsWith("/admin")

    if (isAdmin || isAdminPage) {
        return (
            <div className="flex flex-col min-h-screen">
                <header className="bg-white border-b sticky top-0 z-20">
                    <div className="flex items-center justify-between container mx-auto px-4 py-3">
                        <div className="flex items-center space-x-2">
                            <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black">
                                <ChevronLeft className="w-5 h-5"/>
                            </button>
                            <h1 className="text-lg font-bold text-gray-900">관리자 대시보드</h1>
                        </div>
                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                        >
                            <LogOut className="w-4 h-4 mr-1"/>
                            로그아웃
                        </button>
                    </div>
                    {/* …관리자 탭 메뉴… */}
                </header>

                <main className="flex-grow bg-gray-100">{children}</main>

                {showLogoutConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                            <h3 className="text-lg font-medium mb-4">로그아웃</h3>
                            <p className="mb-6">정말 로그아웃 하시겠습니까?</p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    로그아웃
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="layout">
            {!isAdminPage && <NoticeBar />}

            <header className="bg-white shadow-sm sticky top-0 z-10">
                {/* …일반 헤더, 네비게이션, 사용자 메뉴… */}
            </header>

            <main className="main-content">{children}</main>

            <footer className="bg-gray-800 text-white py-8">
                {/* …푸터 내용… */}
            </footer>

            {!isAdminPage && <BottomNavigation />}
            <Chatbot />

            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-medium mb-4">로그아웃</h3>
                        <p className="mb-6">정말 로그아웃 하시겠습니까?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                로그아웃
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Layout
