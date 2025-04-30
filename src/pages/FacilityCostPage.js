"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { Link } from "react-router-dom"

const FacilityCostPage = () => {
  const { id } = useParams()
  const [facility, setFacility] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFacilityCost = async () => {
      try {
        setLoading(true)

        // 백엔드 API가 준비되지 않았으므로 임시 데이터 사용
        setTimeout(() => {
          // 더미 데이터
          const dummyFacility = {
            id: id,
            name: "행복요양원",
            monthlyCost: 1500000,
            deposit: 5000000,
            additionalCosts: [
              { name: "간호 서비스", cost: 300000, note: "월 기준" },
              { name: "물리치료", cost: 200000, note: "월 기준" },
              { name: "식사 제공", cost: 450000, note: "월 기준, 하루 3식" },
              { name: "특별 활동", cost: 100000, note: "월 기준, 선택사항" },
            ],
            insuranceCoverage: [
              { grade: "1", personalCost: 520000, insuranceSupport: 1430000 },
              { grade: "2", personalCost: 480000, insuranceSupport: 1260000 },
              { grade: "3", personalCost: 450000, insuranceSupport: 1180000 },
              { grade: "4", personalCost: 430000, insuranceSupport: 1100000 },
              { grade: "5", personalCost: 400000, insuranceSupport: 1030000 },
            ],
            costNotes: [
              "위 비용은 참고용이며 실제 비용은 상담 후 결정됩니다.",
              "장기요양보험 적용 시 본인부담금은 소득 수준에 따라 달라질 수 있습니다.",
              "특별한 의료 서비스가 필요한 경우 추가 비용이 발생할 수 있습니다.",
              "입소 시 건강검진 비용은 별도입니다.",
            ],
          }

          setFacility(dummyFacility)
          setLoading(false)
          setError(null)
        }, 500)
      } catch (err) {
        console.error("비용 정보를 불러오는 중 오류가 발생했습니다:", err)
        setError("비용 정보를 불러오는 중 오류가 발생했습니다.")
        setLoading(false)
      }
    }

    fetchFacilityCost()
  }, [id])

  return (
    <div className="container mx-auto p-4">
      {/* 탭 메뉴 */}
      <Tabs defaultValue="cost" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="info">
            <Link to={`/facility/${id}`} className="w-full h-full flex items-center justify-center">
              기본 정보
            </Link>
          </TabsTrigger>
          <TabsTrigger value="cost">비용 안내</TabsTrigger>
          <TabsTrigger value="review">
            <Link to={`/facility/${id}/review`} className="w-full h-full flex items-center justify-center">
              리뷰
            </Link>
          </TabsTrigger>
          <TabsTrigger value="question">
            <Link to={`/facility/${id}/question`} className="w-full h-full flex items-center justify-center">
              문의
            </Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cost" className="p-4 bg-white rounded-lg shadow">
          {loading ? (
            <div className="text-center py-4">로딩 중...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : !facility ? (
            <div className="text-center py-4 text-gray-500">비용 정보를 찾을 수 없습니다.</div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">비용 안내</h2>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">기본 비용</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">월 이용료</p>
                      <p className="font-medium">{facility.monthlyCost.toLocaleString()}원</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">입소 보증금</p>
                      <p className="font-medium">{facility.deposit.toLocaleString()}원</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">추가 비용</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          항목
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          비용
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          비고
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {facility.additionalCosts.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.cost.toLocaleString()}원
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">장기요양보험 적용</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-2">장기요양등급에 따른 본인부담금</p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            등급
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            본인부담금
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            보험 지원금
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {facility.insuranceCoverage.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.grade}등급
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.personalCost.toLocaleString()}원
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.insuranceSupport.toLocaleString()}원
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">비용 관련 참고사항</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {facility.costNotes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FacilityCostPage
