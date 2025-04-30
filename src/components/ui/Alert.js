"use client"

import React from "react"
import "./Alert.css"

/**
 * 알림 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 알림 내용
 * @param {string} [props.variant="info"] - 알림 종류 (info, success, warning, error)
 * @param {string} [props.title] - 알림 제목
 * @param {boolean} [props.dismissible=false] - 닫기 버튼 표시 여부
 * @param {Function} [props.onDismiss] - 닫기 버튼 클릭 핸들러
 * @param {string} [props.className] - 추가 클래스명
 * @returns {JSX.Element|null}
 */
const Alert = ({ children, variant = "info", title, dismissible = false, onDismiss, className = "", ...props }) => {
  const [visible, setVisible] = React.useState(true)

  // 알림 닫기
  const handleDismiss = () => {
    setVisible(false)
    if (onDismiss) onDismiss()
  }

  // 아이콘 선택
  const getIcon = () => {
    switch (variant) {
      case "success":
        return <i className="icon-check-circle"></i>
      case "warning":
        return <i className="icon-alert-triangle"></i>
      case "error":
        return <i className="icon-alert-circle"></i>
      case "info":
      default:
        return <i className="icon-info"></i>
    }
  }

  if (!visible) return null

  return (
    <div className={`alert alert-${variant} ${className}`} role="alert" {...props}>
      <div className="alert-icon">{getIcon()}</div>
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-description">{children}</div>
      </div>
      {dismissible && (
        <button className="alert-dismiss" onClick={handleDismiss} aria-label="닫기">
          <i className="icon-x"></i>
        </button>
      )}
    </div>
  )
}

export default Alert
