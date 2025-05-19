"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // 초기 마운트 시 localStorage에서 복원
    const token = localStorage.getItem("accessToken")
    const userData = localStorage.getItem("user")
    const userRole = localStorage.getItem("userRole")
    let parsed = null
    try { parsed = JSON.parse(userData) } catch {}
    if (token && parsed) {
      setUser(parsed)
      setIsLoggedIn(true)
      setIsAdmin(userRole === "ADMIN")
    }
    setLoading(false)
  }, [])

  // **로그인 함수**: token, user 객체, role 만 받아서 저장하도록 통합
  const login = ({ token, user, role }) => {
    // 1) localStorage에 저장
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userRole", role);

    // 2) Axios 기본 헤더 갱신!
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // 3) 상태 업데이트
    setUser(user);
    setIsLoggedIn(true);
    setIsAdmin(role === "ADMIN");
  };

  // **로그아웃 함수**: 로컬스토리지 키 전부 삭제
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");

    // Axios 헤더도 깨끗이 지워 주기
    delete axios.defaults.headers.common["Authorization"];

    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/");
  };
  if (loading) return null

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
