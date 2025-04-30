// src/pages/FacilityCostDetailPage.jsx
"use client"

import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs"
import { Button } from "../components/ui/Button"
import { RadioGroup, Radio } from "../components/ui/Radio"
import { Info } from "lucide-react"

export default function FacilityCostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // 입원 환자군(신체기능저하, 의료경증, 의료중등, 의료고도)
  const [patientGroup, setPatientGroup] = useState("low")
  // 병실 유형(일반/2인/3인)
  const [roomType, setRoomType] = useState("general")

  // 각 그룹·객실별 비용(예시)
  const costData = {
    low:     { general:   0, premium2: 1240000, premium3:  620000 },
    mid:     { general: 300000, premium2: 1540000, premium3:  820000 },
    high:    { general: 600000, premium2: 1840000, premium3: 1020000 },
    extreme: { general: 900000, premium2: 2140000, premium3: 1220000 },
  }

  const selected = costData[patientGroup][roomType]
  const covered  = Math.round(selected * 0.6)    // 급여 입원비
  const burden   = selected - covered            // 본인부담금

  return (
    <div className="container mx-auto p-4">
      {/* 뒤로가기 */}
      <Button variant="link" onClick={() => navigate(-1)}>
        &larr; 예상비용 살펴보기
      </Button>

      <h1 className="text-xl font-semibold my-4">예상비용 살펴보기</h1>
      <p className="text-sm text-gray-600 mb-4">
        아래 요양병원 비용은 보험형태 및 체급 적용여부에 따라 달라질 수 있으며, 비급여 항목은 제외된 예상비용입니다.
      </p>

      {/* 입원 환자군 선택 */}
      <RadioGroup value={patientGroup} onChange={setPatientGroup} className="flex space-x-2 mb-4">
        <Radio value="low">신체기능저하</Radio>
        <Radio value="mid">의료경증</Radio>
        <Radio value="high">의료중등</Radio>
        <Radio value="extreme">의료고도</Radio>
      </RadioGroup>

      {/* 병실 유형 선택 */}
      <div className="mb-4">
        <RadioGroup value={roomType} onChange={setRoomType} className="space-y-2">
          <Radio value="general">
            일반실 (급여 기준) <span className="float-right">{costData[patientGroup].general.toLocaleString()}원</span>
          </Radio>
          <Radio value="premium2">
            상급병실/2인실 <span className="float-right">{costData[patientGroup].premium2.toLocaleString()}원</span>
          </Radio>
          <Radio value="premium3">
            상급병실/3인실 <span className="float-right">{costData[patientGroup].premium3.toLocaleString()}원</span>
          </Radio>
        </RadioGroup>
      </div>

      {/* 비용 요약 */}
      <div className="border-t mt-4 pt-4 mb-6 space-y-2">
        <div className="flex justify-between">
          <span>급여 입원비</span>
          <span>{covered.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span>병실에 따른 본인부담금</span>
          <span>{burden.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>예상 입원비</span>
          <span>{selected.toLocaleString()}원</span>
        </div>
      </div>

      {/* 간병비 안내 */}
      <div className="flex items-center bg-gray-50 p-4 rounded mb-4">
        <Info className="mr-2 text-gray-500" />
        <p className="text-sm text-gray-600">
          자세한 간병비는 시설에 문의해주세요.<br />
          (해당 병원의 상황에 따라 달라질 수 있습니다.)
        </p>
      </div>

      {/* 안내사항 */}
      <div className="text-sm text-gray-500 mb-6 space-y-1">
        <p>예상비용은 실제 결제금액과 차이가 있을 수 있습니다.</p>
        <p>반드시 해당 병원과 상담 후 정확한 비용을 확인하시기 바랍니다.</p>
      </div>

      {/* 상담하기 버튼 */}
      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3">
        상담하기
      </Button>
    </div>
  )
}
