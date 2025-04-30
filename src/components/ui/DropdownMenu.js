"use client"

import React, { useState, useRef, useEffect } from "react"
import "./DropdownMenu.css"

/**
 * 드롭다운 메뉴 트리거 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 트리거 내용
 * @param {Function} props.onClick - 클릭 핸들러
 * @param {string} [props.className] - 추가 클래스명
 * @returns {JSX.Element}
 */
export const DropdownMenuTrigger = ({ children, onClick, className = "" }) => {
  return (
    <button className={`dropdown-trigger ${className}`} onClick={onClick} type="button" aria-haspopup="true">
      {children}
    </button>
  )
}

/**
 * 드롭다운 메뉴 콘텐츠 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 메뉴 내용
 * @param {boolean} props.isOpen - 메뉴 열림 상태
 * @param {Function} props.onClose - 닫기 핸들러
 * @param {string} [props.className] - 추가 클래스명
 * @param {string} [props.align="start"] - 정렬 방향 (start, end, center)
 * @returns {JSX.Element | null}
 */
export const DropdownMenuContent = ({ children, isOpen, onClose, className = "", align = "start" }) => {
  const contentRef = useRef(null)

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={`dropdown-content dropdown-align-${align} ${className}`} ref={contentRef} role="menu">
      {children}
    </div>
  )
}

/**
 * 드롭다운 메뉴 아이템 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 아이템 내용
 * @param {Function} props.onClick - 클릭 핸들러
 * @param {string} [props.className] - 추가 클래스명
 * @returns {JSX.Element}
 */
export const DropdownMenuItem = ({ children, onClick, className = "" }) => {
  return (
    <button className={`dropdown-item ${className}`} onClick={onClick} role="menuitem">
      {children}
    </button>
  )
}

/**
 * 드롭다운 메뉴 구분선 컴포넌트
 *
 * @returns {JSX.Element}
 */
export const DropdownMenuSeparator = () => {
  return <div className="dropdown-separator" role="separator" />
}

/**
 * 드롭다운 메뉴 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 메뉴 내용
 * @param {string} [props.className] - 추가 클래스명
 * @returns {JSX.Element}
 */
const DropdownMenu = ({ children, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)

  // 자식 요소에 props 전달
  const childrenWithProps = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child

    if (child.type === DropdownMenuTrigger) {
      return React.cloneElement(child, {
        onClick: () => setIsOpen(!isOpen),
      })
    }

    if (child.type === DropdownMenuContent) {
      return React.cloneElement(child, {
        isOpen,
        onClose: () => setIsOpen(false),
      })
    }

    return child
  })

  return <div className={`dropdown ${className}`}>{childrenWithProps}</div>
}

export default DropdownMenu
