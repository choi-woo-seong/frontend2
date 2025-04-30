"use client"

import { useState, useRef, useEffect } from "react"
import "./Tooltip.css"

/**
 * 툴팁 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 툴팁을 표시할 대상 요소
 * @param {string} props.content - 툴팁 내용
 * @param {string} props.position - 툴팁 위치 (top, right, bottom, left)
 * @param {string} props.delay - 툴팁 표시 지연 시간 (ms)
 * @param {boolean} props.arrow - 화살표 표시 여부
 */
const Tooltip = ({ children, content, position = "top", delay = 300, arrow = true }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const targetRef = useRef(null)
  const tooltipRef = useRef(null)
  const timerRef = useRef(null)

  // 툴팁 위치 계산
  const calculatePosition = () => {
    if (!targetRef.current || !tooltipRef.current) return

    const targetRect = targetRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

    let top = 0
    let left = 0

    switch (position) {
      case "top":
        top = targetRect.top + scrollTop - tooltipRect.height - 8
        left = targetRect.left + scrollLeft + targetRect.width / 2 - tooltipRect.width / 2
        break
      case "right":
        top = targetRect.top + scrollTop + targetRect.height / 2 - tooltipRect.height / 2
        left = targetRect.right + scrollLeft + 8
        break
      case "bottom":
        top = targetRect.bottom + scrollTop + 8
        left = targetRect.left + scrollLeft + targetRect.width / 2 - tooltipRect.width / 2
        break
      case "left":
        top = targetRect.top + scrollTop + targetRect.height / 2 - tooltipRect.height / 2
        left = targetRect.left + scrollLeft - tooltipRect.width - 8
        break
      default:
        top = targetRect.top + scrollTop - tooltipRect.height - 8
        left = targetRect.left + scrollLeft + targetRect.width / 2 - tooltipRect.width / 2
    }

    // 화면 경계 체크
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // 왼쪽 경계
    if (left < 0) left = 0
    // 오른쪽 경계
    if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width
    }
    // 상단 경계
    if (top < 0) top = 0
    // 하단 경계
    if (top + tooltipRect.height > viewportHeight + scrollTop) {
      top = viewportHeight + scrollTop - tooltipRect.height
    }

    setTooltipPosition({ top, left })
  }

  // 마우스 진입 시 툴팁 표시
  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true)
      // 다음 프레임에서 위치 계산 (DOM 업데이트 후)
      requestAnimationFrame(calculatePosition)
    }, delay)
  }

  // 마우스 이탈 시 툴팁 숨김
  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setIsVisible(false)
  }

  // 윈도우 리사이즈 시 위치 재계산
  useEffect(() => {
    if (isVisible) {
      window.addEventListener("resize", calculatePosition)
      window.addEventListener("scroll", calculatePosition)
    }

    return () => {
      window.removeEventListener("resize", calculatePosition)
      window.removeEventListener("scroll", calculatePosition)
    }
  }, [isVisible])

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return (
    <div
      className="tooltip-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      ref={targetRef}
    >
      {children}

      {isVisible && content && (
        <div
          className={`tooltip tooltip-${position} ${arrow ? "tooltip-arrow" : ""}`}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
          ref={tooltipRef}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  )
}

export default Tooltip
