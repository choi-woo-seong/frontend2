// src/pages/FacilityDetailPage.jsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs"
import Badge from "../components/ui/Badge"
import { Button } from "../components/ui/Button"
import { Star, ChevronLeft, Heart } from "lucide-react"

export default function FacilityDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [facility, setFacility] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)

  const [activeTab, setActiveTab] = useState("info")

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReviewRating, setNewReviewRating] = useState(0)
  const [newReviewContent, setNewReviewContent] = useState("")

  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [newQuestionContent, setNewQuestionContent] = useState("")

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const dummyMap = {
        "1": {
          id: "1",
          name: "프레스토요양병원",
          type: "요양병원",
          address: "서울특별시 강남구 도산대로 209",
          phone: "02-1111-2222",
          description: "프레스토요양병원은 어르신들을 위한 전문 요양병원입니다.",
          capacity: 60,
          establishedYear: 2015,
          operatingHours: "24시간",
          tags: ["등급제외", "소형", "재활", "치매"],
          services: ["간호 서비스", "물리치료"],
          amenities: ["물리치료실", "정원"],
          images: ["/images/프레스토요양병원.jpg"],
          reviews: [],
          questions: []
        },
        "2": {
          id: "2",
          name: "행복요양원",
          type: "요양원",
          address: "서울특별시 송파구 올림픽로 300",
          phone: "02-2222-3333",
          description: "행복요양원은 어르신들의 편안한 생활을 지원합니다.",
          capacity: 50,
          establishedYear: 2010,
          operatingHours: "24시간",
          tags: ["2등급", "중형", "호스피스"],
          services: ["간호 서비스", "작업치료"],
          amenities: ["도서관", "휴게실"],
          images: ["/images/행복요양원.jpg"],
          reviews: [],
          questions: []
        },
        "3": {
          id: "3",
          name: "골든실버타운",
          type: "실버타운",
          address: "경기도 성남시 수정구 성남대로 400",
          phone: "031-333-4444",
          description: "골든실버타운은 품격 있는 실버타운 시설입니다.",
          capacity: 80,
          establishedYear: 2018,
          operatingHours: "24시간",
          tags: ["1등급", "대형", "레저", "커뮤니티"],
          services: ["문화프로그램", "간호 서비스"],
          amenities: ["수영장", "카페"],
          images: ["/images/골든실버타운.jpg"],
          reviews: [],
          questions: []
        }
      }
      setFacility(dummyMap[id] || null)
      setLoading(false)
    }, 500)
  }, [id])

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`/api/users/favorites/${id}`)
      } else {
        await axios.post("/api/users/favorites", { facilityId: id })
      }
      setIsFavorite(!isFavorite)
    } catch {
      alert("즐겨찾기 처리 중 오류가 발생했습니다.")
    }
  }

  const handleReviewSubmit = () => {
    const newReview = {
      id: facility.reviews.length + 1,
      user: "나**",
      rating: newReviewRating,
      content: newReviewContent,
      date: new Date().toISOString().split("T")[0]
    }
    setFacility({
      ...facility,
      reviews: [...facility.reviews, newReview]
    })
    setShowReviewForm(false)
    setNewReviewRating(0)
    setNewReviewContent("")
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
  if (error)   return <div className="p-4 text-center text-red-500">{error}</div>
  if (!facility) return <div className="p-4 text-center">시설 정보를 찾을 수 없습니다.</div>

  return (
    <div className="container mx-auto p-4">
      {/* 뒤로가기 */}
      <div className="flex items-center mt-3 mb-3">
        <Link to="/search" className="flex items-center text-gray-500">
          <ChevronLeft className="h-5 w-5" />
          <span className="ml-1 font-medium">시설 목록</span>
        </Link>
      </div>

      {/* 이미지 & 즐겨찾기 */}
      <div className="relative mb-6 rounded-lg overflow-hidden h-64 bg-gray-200">
        <img
          src={facility.images[0] || "/placeholder.svg"}
          alt={facility.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={handleToggleFavorite}
          className="absolute top-4 right-4 p-2"
        >
          <Heart
            className={`h-6 w-6 ${isFavorite ? "text-red-500" : "text-gray-400"}`}
            stroke="currentColor"
            fill={isFavorite ? "currentColor" : "none"}
          />
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
            <Badge key={idx} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </div>

      {/* 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            {facility.services.map((svc, i) => (
              <li key={i}>{svc}</li>
            ))}
          </ul>
          <h3 className="text-lg font-semibold mb-2">편의시설</h3>
          <ul className="list-disc pl-5 mb-4">
            {facility.amenities.map((am, i) => (
              <li key={i}>{am}</li>
            ))}
          </ul>
          <div className="mb-6">
         <h3 className="text-lg font-semibold mb-2">위치 보기</h3>
         <div className="w-full h-64 rounded-lg overflow-hidden border">
           <iframe
             src={`https://www.google.com/maps?q=${encodeURIComponent(
               facility.address
             )}&output=embed`}
             width="100%"
             height="100%"
             style={{ border: 0 }}
             allowFullScreen=""
             loading="lazy"
           />
         </div>
         <div className="mt-4">
         <a
    href={`https://map.naver.com/v5/directions?destination=${encodeURIComponent(
      facility.address
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
  >
    네이버 길찾기
  </a>
  </div>
       </div>
        </TabsContent>

        {/* 비용 안내 */}
        <TabsContent value="cost" className="p-4 bg-white rounded-lg shadow">
          {facility.type === "실버타운" ? (
            <>
              <h2 className="text-xl font-semibold mb-4">입주비용</h2>
              <table className="w-full text-sm mb-6 border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">구분</th>
                    <th className="px-4 py-2 text-left">가격</th>
                    <th className="px-4 py-2 text-left">상세내역</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-semibold">정액</td>
                    <td className="px-4 py-2">
                      <ul className="list-disc pl-5">
                        <li>보증금 5천만원 (퇴소시 전액 반환)</li>
                        <li>
                          월 입소비<br/>
                          1인실: 700만원<br/>
                          2인실: 520만원
                        </li>
                        <li>개인간병 이용시 비용 별도 (간병인 식사 무상제공)</li>
                      </ul>
                    </td>
                    <td className="px-4 py-2">
                      <ul className="list-disc pl-5">
                        <li>병실 및 시설 이용비</li>
                        <li>간호치료</li>
                        <li>프로그램비</li>
                        <li>물리치료비</li>
                        <li>생필품비</li>
                        <li>의료소모품비</li>
                        <li>종합검진비</li>
                        <li>이미용비</li>
                        <li>목욕지원비</li>
                        <li>차량지원비</li>
                        <li>요양서비스비</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-semibold">실비</td>
                    <td className="px-4 py-2">
                      <ul className="list-disc pl-5">
                        <li>경관식이</li>
                        <li>기저귀 사용료</li>
                        <li>진료비·치료비 및 전문재활치료</li>
                        <li>케어등급에 따른 추가비용</li>
                        <li>개인간병비 별도</li>
                      </ul>
                    </td>
                    <td className="px-4 py-2"></td>
                  </tr>
                </tbody>
              </table>

              <h3 className="text-lg font-semibold mb-2">입주절차</h3>
              <p className="mb-4">입소상담 &gt; 입소평가 &gt; 입소준비 &gt; 입소</p>
              <ul className="list-disc pl-5 mb-6">
                <li>입소상담: 전화, 방문, 홈페이지</li>
                <li>입소평가: 건강상태, 전염성 질환 유무</li>
                <li>입소준비: 구비서류 안내, 보증금 납부 안내, 입소일시 확정</li>
                <li>입소: 계약서 작성, 보증금 납부, 월입소비 후납</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">입주준비서류</h3>
              <ul className="list-disc pl-5">
                <li>의사진단서 또는 소견서</li>
                <li>전염성 질환 관련 진단서</li>
                <li>주민등록등본</li>
              </ul>
            </>
          ) : facility.type === "요양원" ? (
            <>
              <h2 className="text-xl font-semibold mb-4">입소안내</h2>

              <h3 className="font-medium mb-2">입소대상</h3>
              <p className="mb-4">
                65세 이상의 치매 또는 중증질환을 앓고 계신 어르신으로
                장기요양 1~4등급(시설급여) 받으신 분
              </p>

              <h3 className="font-medium mb-2">입소절차</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>어르신 기초상담 및 시설 투어</li>
                <li>입소상담 후 입소 예약</li>
                <li>
                  입소전 전염성질환 건강검진 및 코로나 검사
                  (병원 신속항원검사) 등
                </li>
                <li>
                  입소 관련 서류
                  (주민등록등본, 가족관계증명서 등) 제출
                </li>
                <li>입소 예정일에 입소</li>
              </ul>

              <h3 className="font-medium mb-2">입소준비서류</h3>
              <ul className="list-decimal pl-5 mb-6">
                <li>전염성질환 건강검진 – 엑스레이, 피검사</li>
                <li>코로나 신속항원 검사 음성결과지</li>
                <li>코로나19 접종확인서</li>
                <li>질환소견서, 처방전, 처방약</li>
                <li>주민등록등본, 가족관계증명서</li>
                <li>어르신 사용 보조기구 (휠체어 등)</li>
                <li>기타 개인 안전 물품</li>
              </ul>

              <div className="mt-4">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                  onClick={() => navigate(`/facility/${id}/cost`)}
                >
                  상세 비용 정보 보기
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">이용 요금</h2>

              <h3 className="text-lg font-medium mb-2">객실 유형별 요금</h3>
              <table className="w-full text-sm mb-4 border border-gray-200 rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">객실 유형</th>
                    <th className="px-4 py-2 text-right">비용</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2">일반실 (4인실)</td>
                    <td className="px-4 py-2 text-right">월 180만원</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">준특실 (2인실)</td>
                    <td className="px-4 py-2 text-right">월 250만원</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">특실 (1인실)</td>
                    <td className="px-4 py-2 text-right">월 350만원</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="text-lg font-medium mb-2">추가 비용</h3>
              <table className="w-full text-sm mb-4 border border-gray-200 rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">항목</th>
                    <th className="px-4 py-2 text-right">비용</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2">간병비</td>
                    <td className="px-4 py-2 text-right">월 150만원</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">식대</td>
                    <td className="px-4 py-2 text-right">월 30만원</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">프로그램 참여비</td>
                    <td className="px-4 py-2 text-right">월 20만원</td>
                  </tr>
                </tbody>
              </table>

              <p className="text-sm text-gray-600 mb-4">
                보험 적용: 장기요양보험 적용 가능 (등급에 따라 차등 지원)
              </p>

              <div className="mt-4">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                  onClick={() => navigate(`/facility/${id}/cost`)}
                >
                  상세 비용 정보 보기
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        {/* 리뷰 탭 */}
        <TabsContent value="review" className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">리뷰</h2>
          {facility.reviews.length === 0 && (
   <p className="text-gray-400">등록된 리뷰가 없습니다.</p>
       )}
          {facility.reviews.length > 0 && (() => {
            const total = facility.reviews.reduce((sum, r) => sum + r.rating, 0)
            const avg = total / facility.reviews.length
            return (
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 mr-1 ${
                      i < Math.round(avg)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-lg font-medium">{avg.toFixed(1)}</span>
                <span className="ml-1 text-gray-500">
                  ({facility.reviews.length}개)
                </span>
              </div>
            )
          })()}

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
            <Button
             className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
             onClick={() => {
               setShowReviewForm(true)
               setNewReviewRating(0)
               setNewReviewContent("")
             }}
           >
             리뷰 작성
           </Button>
          )}
        </TabsContent>

        {/* 문의 탭 */}
        <TabsContent value="question" className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">문의</h2>
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
            <p className="text-gray-400">등록된 문의가 없습니다.</p>
          </div>
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
            <Button
                         className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                         onClick={() => setShowQuestionForm(true)}
                       >
                         문의 작성
                       </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
