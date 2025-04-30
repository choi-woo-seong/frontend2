"use client"

import { createContext, useState, useContext, useEffect } from "react"

// 테마 컨텍스트 생성
const ThemeContext = createContext()

// 테마 제공자 컴포넌트
export function ThemeProvider({ children }) {
  // 로컬 스토리지에서 테마 설정 가져오기 또는 기본값 설정
  const [theme, setTheme] = useState(() => {
    // 브라우저 환경에서만 로컬 스토리지 접근
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme")
      // 저장된 테마가 있으면 사용, 없으면 시스템 설정 확인
      return savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    }
    return "light" // 기본값
  })

  // 테마 변경 함수
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light"
      // 로컬 스토리지에 저장
      localStorage.setItem("theme", newTheme)
      return newTheme
    })
  }

  // 테마 변경 시 문서에 클래스 적용
  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark-theme")
    } else {
      root.classList.remove("dark-theme")
    }
  }, [theme])

  // 시스템 테마 변경 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = (e) => {
      // 사용자가 직접 테마를 설정하지 않은 경우에만 시스템 설정 따름
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light")
      }
    }

    // 이벤트 리스너 등록
    mediaQuery.addEventListener("change", handleChange)

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

// 테마 사용을 위한 커스텀 훅
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
