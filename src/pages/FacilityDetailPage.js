// src/pages/FacilityDetailPage.jsx
"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs"
import Badge from "../components/ui/Badge"
import { Button } from "../components/ui/Button"
import { Star } from "lucide-react"

const FacilityDetailPage = () => {
  const { id } = useParams()
  const [facility, setFacility] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)

  // 탭 상태
  const [activeTab, setActiveTab] = useState("info")

  // 리뷰 작성 상태
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReviewRating, setNewReviewRating] = useState(5)
  const [newReviewContent, setNewReviewContent] = useState("")

  // 문의 작성 상태
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [newQuestionContent, setNewQuestionContent] = useState("")

  useEffect(() => {
    // 더미 데이터 로드
    setTimeout(() => {
      setFacility({
        id,
        name: "행복요양원",
        type: "요양원",
        address: "서울시 강남구 역삼동 123-45",
        phone: "02-1234-5678",
        description:
          "행복요양원은 어르신들의 건강과 행복한 노후를 위해 최선을 다하고 있습니다. 전문 의료진과 요양보호사들이 24시간 상주하며 어르신들을 돌봐드립니다.",
        capacity: 50,
        establishedYear: 2010,
        operatingHours: "24시간",
        tags: ["전문 의료진", "24시간 케어", "물리치료실"],
        services: ["기본 간호 서비스", "물리치료", "작업치료", "인지재활프로그램", "식사 제공"],
        amenities: ["물리치료실", "작업치료실", "공용 휴게실", "정원", "도서관"],
        reviews: [
          { id: 1, user: "김**", content: "친절하고 시설이 깨끗해요.", date: "2024-04-01", rating: 5 },
          { id: 2, user: "이**", content: "간호사 분들이 매우 전문적입니다.", date: "2024-03-20", rating: 4 }
        ],
        questions: [
          { id: 1, user: "박**", content: "입소 절차가 어떻게 되나요?", date: "2024-04-05" }
        ]
      })
      setLoading(false)
    }, 500)
  }, [id])

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) await axios.delete(`/api/users/favorites/${id}`)
      else await axios.post("/api/users/favorites", { facilityId: id })
      setIsFavorite(!isFavorite)
    } catch {
      alert("즐겨찾기 처리 중 오류가 발생했습니다.")
    }
  }

  const handleReviewSubmit = () => {
    const newReview = {
      id: facility.reviews.length + 1,
      user: "나**",
      content: newReviewContent,
      date: new Date().toISOString().split("T")[0],
      rating: newReviewRating
    }
    setFacility({
      ...facility,
      reviews: [...facility.reviews, newReview]
    })
    setShowReviewForm(false)
    setNewReviewContent("")
    setNewReviewRating(5)
  }

  const handleQuestionSubmit = () => {
    const newQuestion = {
      id: facility.questions.length + 1,
      user: "나**",
      content: newQuestionContent,
      date: new Date().toISOString().split("T")[0]
    }
    setFacility({
      ...facility,
      questions: [...facility.questions, newQuestion]
    })
    setShowQuestionForm(false)
    setNewQuestionContent("")
  }

  if (loading) return <div className="p-4 text-center">로딩 중...</div>
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>
  if (!facility) return <div className="p-4 text-center">시설 정보를 찾을 수 없습니다.</div>

  return (
    <div className="container mx-auto p-4">
      {/* 이미지 & 즐겨찾기 */}
      <div className="relative mb-6 rounded-lg overflow-hidden h-64 bg-gray-200">
        <img
          src={facility.images?.[0] || "/placeholder.svg"}
          alt={facility.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-4 right-4 p-2 rounded-full ${
            isFavorite ? "bg-red-500 text-white" : "bg-white text-gray-700"
          }`}
        >
          ♥
        </button>
      </div>

      {/* 기본 정보 */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold">{facility.name}</h1>
          <Badge variant="outline">{facility.type}</Badge>
        </div>
        <p className="text-gray-600 mb-2">{facility.address}</p>
        <p className="text-gray-600 mb-4">전화: {facility.phone}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {facility.tags.map((tag, idx) => (
            <Badge key={idx} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* 탭 */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="info">기본 정보</TabsTrigger>
          <TabsTrigger value="cost">비용 안내</TabsTrigger>
          <TabsTrigger value="review">리뷰</TabsTrigger>
          <TabsTrigger value="question">문의</TabsTrigger>
        </TabsList>

        {/* 기본 정보 */}
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
            {facility.services.map((svc, idx) => (
              <li key={idx}>{svc}</li>
            ))}
          </ul>
          <h3 className="text-lg font-semibold mb-2">편의시설</h3>
          <ul className="list-disc pl-5 mb-4">
            {facility.amenities.map((am, idx) => (
              <li key={idx}>{am}</li>
            ))}
          </ul>
        </TabsContent>

        {/* 비용 안내 */}
        <TabsContent value="cost" className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">비용 안내</h2>
          <p>방문 요양: 월 200만원 ~</p>
          <p>요양원: 일 10만원 ~</p>
        </TabsContent>

        {/* 리뷰 탭 */}
        <TabsContent value="review" className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">리뷰</h2>
          {/* 리뷰 리스트 */}
          <div className="space-y-4 mb-4">
            {facility.reviews.map(r => (
              <div key={r.id} className="border-b pb-2">
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm ml-2">{r.user}</span>
                  <span className="text-xs text-gray-500 ml-auto">{r.date}</span>
                </div>
                <p>{r.content}</p>
              </div>
            ))}
          </div>
          {/* 리뷰 폼 */}
          {showReviewForm ? (
            <div className="p-4 mb-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">리뷰 작성하기</h4>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`cursor-pointer h-6 w-6 ${
                      i < newReviewRating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => setNewReviewRating(i + 1)}
                  />
                ))}
              </div>
              <textarea
                className="w-full border p-2 mb-2 rounded"
                rows={3}
                placeholder="리뷰를 작성하세요"
                value={newReviewContent}
                onChange={e => setNewReviewContent(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                  onClick={handleReviewSubmit}
                >
                  등록
                </Button>
                <Button
                  className="border border-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowReviewForm(false)}
                >
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowReviewForm(true)}>
              리뷰 작성
            </Button>
          )}
        </TabsContent>

        {/* 문의 탭 */}
        <TabsContent value="question" className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">문의</h2>
          {/* 문의 리스트 */}
          <div className="space-y-4 mb-4">
            {facility.questions.map(q => (
              <div key={q.id} className="border-b pb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{q.user}</span>
                  <span>{q.date}</span>
                </div>
                <p>{q.content}</p>
              </div>
            ))}
            {facility.questions.length === 0 && <p>등록된 문의가 없습니다.</p>}
          </div>
          {/* 문의 폼 */}
          {showQuestionForm ? (
            <div className="p-4 mb-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">문의 작성하기</h4>
              <textarea
                className="w-full border p-2 mb-2 rounded"
                rows={3}
                placeholder="문의 내용을 입력하세요"
                value={newQuestionContent}
                onChange={e => setNewQuestionContent(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                  onClick={handleQuestionSubmit}
                >
                  등록
                </Button>
                <Button
                  className="border border-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowQuestionForm(false)}
                >
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowQuestionForm(true)}>
              문의 작성
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FacilityDetailPage
