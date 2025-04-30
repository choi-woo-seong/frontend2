"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { useNavigate } from "react-router-dom"

// 인증 컨텍스트 생성
const AuthContext = createContext(null)

// 인증 제공자 컴포넌트
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")
      const userRole = localStorage.getItem("userRole")

      if (token && userData) {
        setUser(JSON.parse(userData))
        setIsLoggedIn(true)
        setIsAdmin(userRole === "ADMIN")
      }

      setLoading(false)
    }

    checkAuth()
  }, [])

  // 로그인 함수
  const login = async (credentials) => {
    try {
      // 실제 구현에서는 API 호출로 대체
      // 예시를 위한 더미 로그인 처리
      const { userId, password } = credentials

      // 관리자 계정 확인
      if (userId === "admin" && password === "admin123") {
        const adminUser = { id: 1, name: "관리자", email: "admin@example.com", role: "ADMIN" }
        localStorage.setItem("token", "dummy-admin-token")
        localStorage.setItem("user", JSON.stringify(adminUser))
        localStorage.setItem("userRole", "ADMIN")

        setUser(adminUser)
        setIsLoggedIn(true)
        setIsAdmin(true)
        return { success: true, isAdmin: true }
      }

      // 일반 사용자 로그인 (더미 데이터)
      if (userId && password) {
        const normalUser = { id: 2, name: "일반사용자", email: `${userId}@example.com`, role: "USER" }
        localStorage.setItem("token", "dummy-user-token")
        localStorage.setItem("user", JSON.stringify(normalUser))
        localStorage.setItem("userRole", "USER")

        setUser(normalUser)
        setIsLoggedIn(true)
        setIsAdmin(false)
        return { success: true, isAdmin: false }
      }

      return { success: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error)
      return { success: false, message: "로그인 처리 중 오류가 발생했습니다." }
    }
  }

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("userRole")

    setUser(null)
    setIsLoggedIn(false)
    setIsAdmin(false)

    navigate("/")
  }

  // 회원가입 함수
  const signup = async (userData) => {
    try {
      // 실제 구현에서는 API 호출로 대체
      // 예시를 위한 더미 회원가입 처리
      console.log("회원가입 데이터:", userData)
      return { success: true }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error)
      return { success: false, message: "회원가입 처리 중 오류가 발생했습니다." }
    }
  }

  const value = {
    user,
    isLoggedIn,
    isAdmin,
    loading,
    login,
    logout,
    signup,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 인증 훅
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내에서 사용해야 합니다.")
  }
  return context
}
