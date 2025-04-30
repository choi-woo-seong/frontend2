"use client"

import { useState, useCallback } from "react"

/**
 * 토스트 알림을 관리하는 커스텀 훅
 *
 * @returns {Object} 토스트 관련 함수와 상태
 */
const useToast = () => {
  const [toasts, setToasts] = useState([])

  /**
   * 토스트 추가 함수
   *
   * @param {Object} toast - 토스트 객체
   * @param {string} toast.title - 토스트 제목
   * @param {string} toast.description - 토스트 설명
   * @param {string} toast.type - 토스트 타입 (default, success, error, warning, info)
   * @param {number} toast.duration - 토스트 표시 시간 (ms)
   * @param {React.ReactNode} toast.action - 토스트 액션 버튼
   * @returns {string} 생성된 토스트 ID
   */
  const toast = useCallback(({ title, description, type = "default", duration = 5000, action }) => {
    const id = Math.random().toString(36).substring(2, 9)

    setToasts((prevToasts) => [
      ...prevToasts,
      {
        id,
        title,
        description,
        type,
        duration,
        action,
      },
    ])

    return id
  }, [])

  /**
   * 토스트 제거 함수
   *
   * @param {string} id - 제거할 토스트 ID
   */
  const dismiss = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  /**
   * 모든 토스트 제거 함수
   */
  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  // 토스트 타입별 헬퍼 함수
  const success = useCallback((props) => toast({ ...props, type: "success" }), [toast])
  const error = useCallback((props) => toast({ ...props, type: "error" }), [toast])
  const warning = useCallback((props) => toast({ ...props, type: "warning" }), [toast])
  const info = useCallback((props) => toast({ ...props, type: "info" }), [toast])

  return {
    toast,
    dismiss,
    dismissAll,
    toasts,
    success,
    error,
    warning,
    info,
  }
}

export default useToast
