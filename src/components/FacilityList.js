"use client"
import { Link } from "react-router-dom"

/**
 * 시설 목록 컴포넌트
 *
 * @component
 * @description 검색 결과로 나온 시설 목록을 표시합니다.
 *
 * @prop {Array} facilities - 시설 목록 데이터
 * @prop {number} currentPage - 현재 페이지 번호
 * @prop {number} totalPages - 전체 페이지 수
 * @prop {Function} onPageChange - 페이지 변경 시 호출할 함수
 */
function FacilityList({ facilities, currentPage, totalPages, onPageChange }) {
  // 시설 목록이 비어있는 경우
  if (!facilities || facilities.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      </div>
    )
  }

  // 페이지네이션 렌더링
  const renderPagination = () => {
    const pages = []

    // 최대 5개의 페이지 버튼만 표시
    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, startPage + 4)

    // 이전 페이지 버튼
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 rounded-md border border-gray-300 mr-1 hover:bg-gray-100"
        >
          이전
        </button>,
      )
    }

    // 페이지 번호 버튼
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md mr-1 ${
            i === currentPage ? "bg-blue-500 text-white" : "border border-gray-300 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>,
      )
    }

    // 다음 페이지 버튼
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100"
        >
          다음
        </button>,
      )
    }

    return pages
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <Link to={`/facility/${facility.id}`}>
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={facility.imageUrl || "/placeholder.svg?height=200&width=300&query=care facility"}
                  alt={facility.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{facility.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{facility.type}</p>
                <p className="text-sm text-gray-500 mb-3">{facility.address}</p>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(facility.rating) ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-600">{facility.rating.toFixed(1)}</span>
                  </div>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-sm text-gray-600">리뷰 {facility.reviewCount}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && <div className="flex justify-center mt-8">{renderPagination()}</div>}
    </div>
  )
}

export default FacilityList
