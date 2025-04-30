"use client"

import { createContext, useContext, useState } from "react"
import "../ui/Tabs.css"

// 탭 컨텍스트 생성
const TabsContext = createContext(null)

export const Tabs = ({ defaultValue, value, onValueChange, children, className = "" }) => {
  // 내부 상태 또는 외부에서 제어되는 상태 사용
  const [selectedTab, setSelectedTab] = useState(defaultValue)

  // 현재 선택된 탭 값
  const currentValue = value !== undefined ? value : selectedTab

  // 탭 변경 핸들러
  const handleTabChange = (newValue) => {
    if (value === undefined) {
      setSelectedTab(newValue)
    }
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleTabChange }}>
      <div className={`tabs ${className}`}>{children}</div>
    </TabsContext.Provider>
  )
}

export const TabsList = ({ children, className = "" }) => {
  return <div className={`tabs-list ${className}`}>{children}</div>
}

export const TabsTrigger = ({ value, children, className = "" }) => {
  const { value: selectedValue, onValueChange } = useContext(TabsContext)
  const isActive = selectedValue === value

  return (
    <button
      className={`tabs-trigger ${isActive ? "active" : ""} ${className}`}
      onClick={() => onValueChange(value)}
      data-state={isActive ? "active" : "inactive"}
      type="button"
    >
      {children}
    </button>
  )
}

export const TabsContent = ({ value, children, className = "", style }) => {
  const { value: selectedValue } = useContext(TabsContext)
  const isActive = selectedValue === value

  if (!isActive) return null

  return (
    <div className={`tabs-content ${className}`} data-state={isActive ? "active" : "inactive"} style={style}>
      {children}
    </div>
  )
}
