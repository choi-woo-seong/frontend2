"use client"

import { useState } from "react"
import RegionSelectorModal from "./RegionSelectorModal"

/**
 * 지역 선택 컴포넌트
 *
 * @component
 * @description 사용자가 지역을 선택할 수 있는 컴포넌트
 *
 * @prop {string} selectedRegion - 현재 선택된 지역
 * @prop {Function} onRegionChange - 지역 선택 변경 시 호출할 함수
 */
function RegionSelector({ selectedRegion, onRegionChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleRegionSelect = (region) => {
    if (typeof onRegionChange === "function") {
      onRegionChange(region)
    }
    closeModal()
  }

  return (
    <div className="relative">
      <div className="text-sm font-medium text-gray-700 mb-1">지역 선택</div>
      <button
        type="button"
        onClick={openModal}
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span>{selectedRegion || "전국"}</span>
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

      <RegionSelectorModal isOpen={isModalOpen} onClose={closeModal} onSelect={handleRegionSelect} />
    </div>
  )
}

export default RegionSelector
