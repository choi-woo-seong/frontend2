"use client"

import { useState } from "react"

/**
 * 시설 유형 선택 컴포넌트
 *
 * @component
 * @description 사용자가 시설 유형을 선택할 수 있는 컴포넌트
 *
 * @prop {string} selectedType - 현재 선택된 시설 유형
 * @prop {Function} onTypeChange - 시설 유형 선택 변경 시 호출할 함수
 */
function FacilityTypeSelector({ selectedType, onTypeChange }) {
  const [isOpen, setIsOpen] = useState(false)

  // 시설 유형 목록
  const facilityTypes = [
    { id: "all", name: "전체" },
    { id: "nursing_home", name: "요양원" },
    { id: "silver_town", name: "실버타운" },
    { id: "nursing_hospital", name: "요양병원" },
    { id: "day_care", name: "주야간보호" },
    { id: "home_visit", name: "방문요양" },
    { id: "home_nursing", name: "방문간호" },
    { id: "home_bath", name: "방문목욕" },
    { id: "short_term_care", name: "단기보호" },
    { id: "elderly_home", name: "양로원" },
  ]

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleTypeSelect = (type) => {
    onTypeChange(type)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <div className="text-sm font-medium text-gray-700 mb-1">시설 유형</div>
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span>{selectedType || "전체"}</span>
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {facilityTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.name)}
                className={`w-full text-left px-4 py-2 text-sm ${
                  selectedType === type.name ? "bg-blue-100 text-blue-900" : "text-gray-700 hover:bg-gray-100"
                }`}
                role="menuitem"
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FacilityTypeSelector
