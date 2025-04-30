"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import "./Dialog.css"

/**
 * 다이얼로그 컴포넌트
 *
 * @param {Object} props
 * @param {boolean} props.open - 다이얼로그 열림 상태
 * @param {Function} props.onClose - 닫기 핸들러
 * @param {React.ReactNode} props.children - 다이얼로그 내용
 * @param {string} [props.className] - 추가 클래스명
 * @returns {React.ReactPortal|null}
 */
const Dialog = ({ open, onClose, children, className = "" }) => {
  const dialogRef = useRef(null)

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden" // 스크롤 방지
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "" // 스크롤 복원
    }
  }, [open, onClose])

  // 외부 클릭 감지
  const handleBackdropClick = (e) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
      onClose()
    }
  }

  if (!open) return null

  return createPortal(
    <div className="dialog-backdrop" onClick={handleBackdropClick}>
      <div className={`dialog ${className}`} ref={dialogRef} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>,
    document.body,
  )
}

/**
 * 다이얼로그 헤더 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 헤더 내용
 * @param {string} [props.className] - 추가 클래스명
 * @returns {JSX.Element}
 */
Dialog.Header = ({ children, className = "" }) => {
  return <div className={`dialog-header ${className}`}>{children}</div>
}

/**
 * 다이얼로그 제목 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 제목 내용
 * @param {string} [props.className] - 추가 클래스명
 * @returns {JSX.Element}
 */
Dialog.Title = ({ children, className = "" }) => {
  return <h2 className={`dialog-title ${className}`}>{children}</h2>
}

/**
 * 다이얼로그 닫기 버튼 컴포넌트
 *
 * @param {Object} props
 * @param {Function} props.onClose - 닫기 핸들러
 * @param {string} [props.className] - 추가 클래스명
 * @returns {JSX.Element}
 */
Dialog.CloseButton = ({ onClose, className = "" }) => {
  return (
    <button className={`dialog-close ${className}`} onClick={onClose} aria-label="닫기">
      <i className="icon-x"></i>
    </button>
  )
}

/**
 * 다이얼로그 내용 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 내용
 * @param {string} [props.className] - 추가 클래스명
 * @returns {JSX.Element}
 */
Dialog.Content = ({ children, className = "" }) => {
  return <div className={`dialog-content ${className}`}>{children}</div>
}

/**
 * 다이얼로그 푸터 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 푸터 내용
 * @param {string} [props.className] - 추가 클래스명
 * @returns {JSX.Element}
 */
Dialog.Footer = ({ children, className = "" }) => {
  return <div className={`dialog-footer ${className}`}>{children}</div>
}

export default Dialog
