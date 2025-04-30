"use client"

import React, { useState } from "react"
import "./Accordion.css"

/**
 * 아코디언 컨테이너 컴포넌트
 *
 * @param {Object} props
 * @param {string} [props.type='single'] - 아코디언 타입 ('single' 또는 'multiple')
 * @param {string} [props.defaultValue] - 기본 열려있는 아이템(단일 타입)
 * @param {string[]} [props.defaultValues=[]] - 기본 열려있는 아이템들(다중 타입)
 * @param {Function} [props.onValueChange] - 값 변경 시 호출 함수
 * @param {boolean} [props.collapsible=false] - 모든 아이템을 닫을 수 있는지 여부(단일 타입)
 * @param {React.ReactNode} props.children - AccordionItem 컴포넌트들
 * @param {string} [props.className=''] - 추가 CSS 클래스
 */
const Accordion = ({
  type = "single",
  defaultValue,
  defaultValues = [],
  onValueChange,
  collapsible = false,
  children,
  className = "",
  ...props
}) => {
  const [openItems, setOpenItems] = useState(() => {
    if (type === "single") {
      return defaultValue ? [defaultValue] : []
    }
    return defaultValues || []
  })

  const toggleItem = (itemValue) => {
    if (type === "single") {
      if (openItems[0] === itemValue) {
        if (collapsible) {
          setOpenItems([])
          if (onValueChange) onValueChange(undefined)
        }
      } else {
        setOpenItems([itemValue])
        if (onValueChange) onValueChange(itemValue)
      }
    } else {
      if (openItems.includes(itemValue)) {
        const newOpenItems = openItems.filter((item) => item !== itemValue)
        setOpenItems(newOpenItems)
        if (onValueChange) onValueChange(newOpenItems)
      } else {
        const newOpenItems = [...openItems, itemValue]
        setOpenItems(newOpenItems)
        if (onValueChange) onValueChange(newOpenItems)
      }
    }
  }

  const clonedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        isOpen: openItems.includes(child.props.value),
        onToggle: () => toggleItem(child.props.value),
      })
    }
    return child
  })

  return (
    <div className={`accordion ${className}`} {...props}>
      {clonedChildren}
    </div>
  )
}

/**
 * 아코디언 아이템 컴포넌트
 *
 * @param {Object} props
 * @param {string} props.value - 아이템 식별 값
 * @param {boolean} props.isOpen - 아이템 열림 상태
 * @param {Function} props.onToggle - 상태 전환 함수
 * @param {React.ReactNode} props.children - AccordionTrigger와 AccordionContent 컴포넌트
 * @param {string} [props.className=''] - 추가 CSS 클래스
 */
const AccordionItem = ({ value, isOpen, onToggle, children, className = "", ...props }) => {
  // AccordionTrigger와 AccordionContent 분리
  const accordionTrigger = React.Children.toArray(children).find((child) => child.type === AccordionTrigger)

  const accordionContent = React.Children.toArray(children).find((child) => child.type === AccordionContent)

  // isOpen과 onToggle을 자식에게 전달
  const clonedTrigger = accordionTrigger ? React.cloneElement(accordionTrigger, { isOpen, onToggle }) : null

  const clonedContent = accordionContent ? React.cloneElement(accordionContent, { isOpen }) : null

  return (
    <div className={`accordion-item ${className}`} data-state={isOpen ? "open" : "closed"} {...props}>
      {clonedTrigger}
      {clonedContent}
    </div>
  )
}

/**
 * 아코디언 트리거 컴포넌트
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - 열림 상태
 * @param {Function} props.onToggle - 상태 전환 함수
 * @param {React.ReactNode} props.children - 트리거 내용
 * @param {string} [props.className=''] - 추가 CSS 클래스
 */
const AccordionTrigger = ({ isOpen, onToggle, children, className = "", ...props }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`accordion-trigger ${className}`}
      aria-expanded={isOpen}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`accordion-chevron ${isOpen ? "accordion-chevron-open" : ""}`}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  )
}

/**
 * 아코디언 컨텐츠 컴포넌트
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - 열림 상태
 * @param {React.ReactNode} props.children - 컨텐츠 내용
 * @param {string} [props.className=''] - 추가 CSS 클래스
 */
const AccordionContent = ({ isOpen, children, className = "", ...props }) => {
  if (!isOpen) return null

  return (
    <div className={`accordion-content ${className}`} {...props}>
      {children}
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

/**
 * 백엔드 개발자 참고사항:
 * - 이 컴포넌트는 순수 프론트엔드 컴포넌트로 백엔드 연동이 필요 없습니다.
 * - 아코디언 컨텐츠에서 동적 데이터를 로드할 경우, 해당 컴포넌트 내에서 데이터를 가져오는 로직이 필요합니다.
 */
