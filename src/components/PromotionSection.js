import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function PromotionSection() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-medium mb-4">맞춤 추천 서비스</h2>

        {/* ✅ 두 개 카드를 한 줄에 정렬 (AI 추천시설이 먼저) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* ✅ AI 추천시설 */}
          <div className="bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition">
            <h3 className="font-medium text-sm mb-2">AI 추천시설</h3>
            <p className="text-xs text-gray-600 mb-3">
              요양등급 테스트 기반 AI추천시설
            </p>
            <Link
              to="/recommend"
              className="text-xs text-blue-500 flex items-center"
            >
              시설찾기 <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </div>

          {/* ✅ 요양등급 테스트 */}
          <div className="bg-green-50 rounded-lg p-4 hover:bg-green-100 transition">
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
  );
}

export default PromotionSection;
