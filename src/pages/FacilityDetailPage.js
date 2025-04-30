"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs"
import Badge from "../components/ui/Badge"

const FacilityDetailPage = () => {
  const { id } = useParams()
  const [facility, setFacility] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        setLoading(true)

        // 백엔드 API가 준비되지 않았으므로 임시 데이터 사용
        setTimeout(() => {
          // 더미 데이터
          const dummyFacility = {
            id: id,
            name: "행복요양원",
            type: "요양원",
            address: "서울시 강남구 역삼동 123-45",
            phone: "02-1234-5678",
            description:
              "행복요양원은 어르신들의 건강과 행복한 노후를 위해 최선을 다하고 있습니다. 전문 의료진과 요양보호사들이 24시간 상주하며 어르신들을 돌봐드립니다.",
            capacity: 50,
            establishedYear: 2010,
            operatingHours: "24시간",
            images: ["/modern-hospital-exterior.png"],
            tags: ["전문 의료진", "24시간 케어", "물리치료실"],
            services: ["기본 간호 서비스", "물리치료", "작업치료", "인지재활프로그램", "식사 제공"],
            amenities: ["물리치료실", "작업치료실", "공용 휴게실", "정원", "도서관"],
          }

          setFacility(dummyFacility)
          setIsFavorite(false) // 기본값은 즐겨찾기 안됨
          setLoading(false)
          setError(null)
        }, 500)
      } catch (err) {
        console.error("시설 정보를 불러오는 중 오류가 발생했습니다:", err)
        setError("시설 정보를 불러오는 중 오류가 발생했습니다.")
        setLoading(false)
      }
    }

    fetchFacility()
  }, [id])

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        // TODO: 백엔드 개발자는 아래 엔드포인트를 구현해야 합니다.
        // DELETE /api/users/favorites/{facilityId} - 즐겨찾기 삭제
        await axios.delete(`/api/users/favorites/${id}`)
      } else {
        // TODO: 백엔드 개발자는 아래 엔드포인트를 구현해야 합니다.
        // POST /api/users/favorites - 즐겨찾기 추가
        await axios.post("/api/users/favorites", { facilityId: id })
      }
      setIsFavorite(!isFavorite)
    } catch (err) {
      console.error("즐겨찾기 처리 중 오류가 발생했습니다:", err)
      alert("즐겨찾기 처리 중 오류가 발생했습니다.")
    }
  }

  if (loading) return <div className="p-4 text-center">로딩 중...</div>
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>
  if (!facility) return <div className="p-4 text-center">시설 정보를 찾을 수 없습니다.</div>

  return (
    <div className="container mx-auto p-4">
      {/* 시설 이미지 슬라이더 */}
      <div className="relative mb-6 rounded-lg overflow-hidden h-64 bg-gray-200">
        {facility.images && facility.images.length > 0 ? (
          <img
            src={facility.images[0] || "/placeholder.svg"}
            alt={facility.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">이미지가 없습니다</div>
        )}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-4 right-4 p-2 rounded-full ${isFavorite ? "bg-red-500 text-white" : "bg-white text-gray-700"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      {/* 시설 기본 정보 */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold">{facility.name}</h1>
          <Badge variant="outline">{facility.type}</Badge>
        </div>
        <p className="text-gray-600 mb-2">{facility.address}</p>
        <p className="text-gray-600 mb-4">전화: {facility.phone}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {facility.tags &&
            facility.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
        </div>
      </div>

      {/* 탭 메뉴 */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="info">기본 정보</TabsTrigger>
          <TabsTrigger value="cost">
            <Link to={`/facility/${id}/cost`} className="w-full h-full flex items-center justify-center">
              비용 안내
            </Link>
          </TabsTrigger>
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

        <TabsContent value="info" className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">시설 소개</h2>
          <p className="mb-4">{facility.description}</p>

          <h3 className="text-lg font-semibold mb-2">시설 정보</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>입소 정원: {facility.capacity}명</li>
            <li>설립 연도: {facility.establishedYear}년</li>
            <li>운영 시간: {facility.operatingHours}</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">제공 서비스</h3>
          <ul className="list-disc pl-5 mb-4">
            {facility.services && facility.services.map((service, index) => <li key={index}>{service}</li>)}
          </ul>

          <h3 className="text-lg font-semibold mb-2">시설 및 편의시설</h3>
          <ul className="list-disc pl-5 mb-4">
            {facility.amenities && facility.amenities.map((amenity, index) => <li key={index}>{amenity}</li>)}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FacilityDetailPage
