// src/pages/FacilityCostPage.js
"use client"

import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Info, ChevronLeft } from "lucide-react"
import { Button } from "../components/ui/Button"

export default function FacilityCostPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // 탭 상태 (입원 환자군)
  const patientGroups = ["신체기능저하", "의료경도", "의료중도", "의료고도"]
  const [activeGroup, setActiveGroup] = useState(patientGroups[0])

  // 병실 선택 상태
  const roomOptions = [
    { value: "general", label: "일반실 (4인실)", sub: "급여(31일 기준)", price: 0 },
    { value: "semi",    label: "상급병실/2인실", sub: "급여(2인실비)",    price: 1240000 },
    { value: "premium", label: "상급병실/3인실", sub: "급여(3인실비)",    price: 620000 },
  ]
  const [selectedRoom, setSelectedRoom] = useState(roomOptions[0].value)

  // 예시 고정값: 급여 입원비
  const salaryCost = 598393

  const formatWon = n =>
    n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  // 본인부담 + 급여비 합산
  const ownBurden = roomOptions.find(r => r.value === selectedRoom).price
  const totalCost = salaryCost + ownBurden

  return (
    <div className="pb-20 container mx-auto p-4">
    {/* 헤더: 뒤로가기 아이콘 */}
    <div className="flex items-center mb-2">
      <Link to={`/facility/${id}`} className="mr-2">
        <ChevronLeft className="h-6 w-6 text-gray-600" />
      </Link>
      <h1 className="text-2xl font-bold">예상비용 살펴보기</h1>
    </div>
      <p className="text-sm text-gray-600 mb-6">
        아래 요양병원 비용은 보험형태 및 체격 적용여부에 따라 달라질 수 있으며 비급여항목은 제외된 예상비용입니다.
      </p>

      {/* 탭: 입원 환자군 */}
      <div className="flex space-x-2 mb-6">
        {patientGroups.map(g => (
          <button
            key={g}
            className={`flex-1 py-2 border rounded-lg text-sm
              ${activeGroup === g
                ? "bg-blue-50 border-blue-500 text-blue-600"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            onClick={() => setActiveGroup(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* 병실 라디오 리스트 */}
      <div className="space-y-4 mb-6">
        {roomOptions.map(r => (
          <label
            key={r.value}
            className={`flex justify-between items-center p-4 border rounded-lg text-sm
              ${selectedRoom === r.value
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200"}`}
          >
            <div>
              <div className="flex items-center mb-1">
                <input
                  type="radio"
                  name="room"
                  value={r.value}
                  checked={selectedRoom === r.value}
                  onChange={() => setSelectedRoom(r.value)}
                  className="mr-2 text-blue-600"
                />
                <span className="font-medium">{r.label}</span>
              </div>
              <p className="text-xs text-gray-500 pl-7">{r.sub}</p>
            </div>
            <span className="font-medium">{formatWon(r.price)}원</span>
          </label>
        ))}
      </div>

      {/* 구분선 */}
      <div className="border-t-2 border-blue-500 mb-6"></div>

      {/* 급여 입원비 / 본인부담금 */}
      <div className="flex justify-between mb-1 text-sm">
        <span>급여 입원비</span>
        <span>{formatWon(salaryCost)}원</span>
      </div>
      <div className="flex justify-between mb-6 text-sm">
        <span>병실에 따른 본인부담금</span>
        <span>{formatWon(ownBurden)}원</span>
      </div>

      {/* 예상 입원비 */}
      <div className="flex justify-between items-baseline mb-6">
        <span className="font-medium">예상 입원비</span>
        <span className="text-xl font-bold text-blue-600">월 {formatWon(totalCost)}원</span>
      </div>

      {/* 간병비 안내 박스 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-start space-x-2">
        <Info className="h-5 w-5 text-gray-400 mt-1" />
        <div className="text-sm text-gray-600">
          자세한 간병비는 시설에 문의해주세요.
          <p className="mt-1 text-xs text-gray-400">해당 병원의 상황에 따라 달라질 수 있습니다.</p>
        </div>
      </div>

      {/* 안내사항 */}
      <div className="mb-6 text-sm text-gray-600 space-y-1">
        <p>예상비용은 실제 결제금액과 차이가 있을 수 있습니다.</p>
        <p>반드시 해당 병원과 상담 후 정확한 비용을 확인하시기 바랍니다.</p>
      </div>

      {/* 하단 고정 상담하기 버튼 */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded"
          onClick={() => navigate(`/facility/${id}/consult`)}
        >
          상담하기
        </Button>
      </div>
    </div>
  )
}
