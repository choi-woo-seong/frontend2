import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

function PromotionSection() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-medium mb-4">맞춤 추천 서비스</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 시설 찾기 */}
          <div className="bg-blue-50 rounded-lg p-4 transition hover:bg-blue-100">
            <h3 className="font-medium text-sm mb-2">시설 찾기</h3>
            <p className="text-xs text-gray-600 mb-3">
              지역별 시설 찾기
            </p>
            <Link
              to="/search"
              className="text-xs text-blue-500 flex items-center"
            >
              시설찾기 <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </div>

          {/* 요양등급 테스트 */}
          <div className="bg-green-50 rounded-lg p-4 transition hover:bg-green-100">
            <h3 className="font-medium text-sm mb-2">요양등급 테스트</h3>
            <p className="text-xs text-gray-600 mb-3">
              간단한 테스트로 예상 요양등급을 확인해보세요.
            </p>
            <Link
              to="/care-grade-test"
              className="text-xs text-green-600 flex items-center"
            >
              테스트 시작하기 <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromotionSection
