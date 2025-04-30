"use client"

import { useEffect, useState } from "react"
import "./Toast.css"

/**
 * 토스트 알림 컴포넌트
 *
 * @param {Object} props
 * @param {string} props.id - 토스트 고유 ID
 * @param {string} props.title - 토스트 제목
 * @param {string} props.description - 토스트 설명
 * @param {string} props.type - 토스트 타입 (default, success, error, warning, info)
 * @param {number} props.duration - 토스트 표시 시간 (ms)
 * @param {Function} props.onClose - 토스트 닫기 콜백
 * @param {React.ReactNode} props.action - 토스트 액션 버튼
 */
const Toast = ({ id, title, description, type = "default", duration = 5000, onClose, action }) => {
  const [visible, setVisible] = useState(true)
  const [removing, setRemoving] = useState(false)

  useEffect(() => {
    if (duration !== Number.POSITIVE_INFINITY) {
      const timer = setTimeout(() => {
        closeToast()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration])

  const closeToast = () => {
    setRemoving(true)
    setTimeout(() => {
      setVisible(false)
      if (onClose) onClose(id)
    }, 300) // 애니메이션 시간
  }

  if (!visible) return null

  return (
    <div className={`toast toast-${type} ${removing ? "toast-removing" : ""}`}>
      <div className="toast-content">
        {title && <div className="toast-title">{title}</div>}
        {description && <div className="toast-description">{description}</div>}
      </div>

      {action && <div className="toast-action">{action}</div>}

      <button className="toast-close" onClick={closeToast} aria-label="닫기">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  )
}

/**
 * 토스트 컨테이너 컴포넌트
 *
 * @param {Object} props
 * @param {Array} props.toasts - 토스트 목록
 * @param {Function} props.onRemove - 토스트 제거 콜백
 */
const ToastContainer = ({ toasts = [], onRemove }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          type={toast.type}
          duration={toast.duration}
          onClose={onRemove}
          action={toast.action}
        />
      ))}
    </div>
  )
}

export { Toast, ToastContainer }
