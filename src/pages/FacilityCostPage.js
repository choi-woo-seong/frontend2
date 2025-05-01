// src/pages/FacilityCostPage.jsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Info, ChevronLeft } from "lucide-react"
import { Button } from "../components/ui/Button"

export default function FacilityCostPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // id 가 "2" 면 요양원, 아니면 요양병원
  const facilityType = id === "2" ? "요양원" : "요양병원"

  // --- 요양병원용 state & 데이터 ---
  // 병실 선택 상태
  const roomOptions = [
    { value: "general", label: "일반실 (4인실)", sub: "급여(31일 기준)", price: 0 },
    { value: "semi",    label: "상급병실/2인실", sub: "급여(2인실비)",    price: 1240000 },
    { value: "premium", label: "상급병실/3인실", sub: "급여(3인실비)",    price: 620000 },
  ]
  const [selectedRoom, setSelectedRoom] = useState(roomOptions[0].value)
  const salaryCost = 598393
  const formatWon = n =>
    n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  const ownBurden = roomOptions.find(r => r.value === selectedRoom).price
  const totalCost = salaryCost + ownBurden

  // --- 요양원용 state & 데이터 ---
  // 식재료비, 간식비, 상급침실 선택
  const snackOptions = [
    { id: "meal",  label: "3,700원 * 3식",   amount: 3700 * 3 * 31 },
  ]
  const snackDefault = snackOptions[0].id
  const [selectedSnack, setSelectedSnack] = useState(snackDefault)

  const snackCost = snackOptions.find(o => o.id === selectedSnack).amount

  const treatOptions = [
    { id: "snack", label: "1000원 * 1회",     amount: 1000 * 1 * 31 },
  ]
  const [selectedTreat, setSelectedTreat] = useState(treatOptions[0].id)
  const treatCost = treatOptions.find(o => o.id === selectedTreat).amount

  const bedOptions = [
    { id: "generalBed",  label: "일반실",           amount: 0 },
    { id: "doubleBed",   label: "2인실 5,000원",   amount: 5000 * 31 },
    { id: "singleBed",   label: "1인실 8,000원",   amount: 8000 * 31 },
  ]
  const [selectedBed, setSelectedBed] = useState(bedOptions[0].id)
  const bedCost = bedOptions.find(o => o.id === selectedBed).amount

  // 요양원 요금 요약
  const nonInsuredTotal = snackCost + treatCost + bedCost
  const insuredTotal = 491288   // 스크린샷 예시값
  const grandTotal   = insuredTotal + nonInsuredTotal

  // -----------------------------------------------------

  if (facilityType === "요양원") {
    return (
      <div className="pb-20 container mx-auto p-4">
        {/* 헤더 */}
        <div className="flex items-center mb-2">
          <Link to={`/facility/${id}`} className="mr-2">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold">예상비용 상세보기</h1>
        </div>

        {/* 비급여 항목 */}
        <h2 className="text-lg font-semibold mb-2">비급여 항목</h2>

         {/* 식재료비 */}
         <div className="mb-4">
          <p className="text-sm font-medium mb-1">식재료비</p>
          {snackOptions.map(opt => (
            <label
              key={opt.id}
              className="flex justify-between items-center p-4 border-2 rounded-lg mb-2 hover:border-blue-500"
            >
              <div>
                <input
                  type="radio"
                  name="meal"
                  value={opt.id}
                  checked={selectedSnack === opt.id}
                  onChange={() => setSelectedSnack(opt.id)}
                  className="mr-2 text-blue-600"
                />
                <span className="font-medium">{opt.label}</span>
               <p className="text-xs text-gray-500 mt-1">위탁업체 계약</p>
               <p className="text-xs text-gray-500">금액 (31일 기준)</p>
              </div>
              <span className="font-medium text-blue-600">{formatWon(opt.amount)}원</span>
            </label>
          ))}
        </div>

        {/* 간식비 */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-1">간식비</p>
          {treatOptions.map(opt => (
            <label
              key={opt.id}
              className="flex justify-between items-center p-4 border-2 rounded-lg mb-2 hover:border-blue-500"
            >
              <div>
                <input
                  type="radio"
                  name="treat"
                  value={opt.id}
                  checked={selectedTreat === opt.id}
                  onChange={() => setSelectedTreat(opt.id)}
                  className="mr-2 text-blue-600"
                />
                <span className="font-medium">{opt.label}</span>
               <p className="text-xs text-gray-500 mt-1">오후 제공 (위탁업체 계약)</p>
               <p className="text-xs text-gray-500">금액 (31일 기준)</p>
              </div>
              <span className="font-medium text-blue-600">{formatWon(opt.amount)}원</span>
            </label>
          ))}
        </div>

        {/* 상급침실 사용료 */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-1">상급침실 사용료</p>
          {bedOptions.map(opt => (
            <label key={opt.id} className="flex justify-between items-center p-4 border-2 rounded-lg mb-2 hover:border-blue-500">
              <div>
                <input
                  type="radio"
                  name="bed"
                  value={opt.id}
                  checked={selectedBed === opt.id}
                  onChange={() => setSelectedBed(opt.id)}
                  className="mr-2 text-blue-600"
                />
                <span className="font-medium">{opt.label}</span>
                <p className="text-xs text-gray-500 mt-1">금액 (31일 기준)</p>
              </div>
              <span className="font-medium text-blue-600">{formatWon(opt.amount)}원</span>
            </label>
          ))}
        </div>

        {/* 안내사항 */}
        <div className="mb-4 text-sm text-gray-600">
          예상비용은 실제 금액과 차이가 있을 수 있으니 반드시 해당 시설과 상담해 보세요.
        </div>

        {/* 요약 박스 */}
        <div className="p-4 bg-gray-100 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span>급여 요양비 (3~5등급/20% 부담)</span>
            <span className="font-medium">{formatWon(insuredTotal)}원</span>
          </div>
          <div className="flex justify-between">
            <span>비급여 항목 (식재료비 + 간식비 + 상급침실)</span>
            <span className="font-medium">{formatWon(nonInsuredTotal)}원</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="font-semibold">예상 입소비용 (31일 기준)</span>
            <span className="text-xl font-bold text-blue-600">월 {formatWon(grandTotal)}원</span>
          </div>
        </div>
      </div>
    )
  }

  // --- 이하 기존 요양병원 UI (수정 없이 그대로) ---
  return (
    <div className="pb-20 container mx-auto p-4">
      {/* 헤더 */}
      <div className="flex items-center mb-2">
        <Link to={`/facility/${id}`} className="mr-2">
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold">예상비용 살펴보기</h1>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        아래 요양병원 비용은 보험형태 및 체격 적용여부에 따라 달라질 수 있으며 비급여항목은 제외된 예상비용입니다.
      </p>

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

      {/* 간병비 안내 */}
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

      {/* 하단 상담하기 */}
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
