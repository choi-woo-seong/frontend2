"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs"
import Badge from "../components/ui/Badge"
import { Button } from "../components/ui/Button"
import { Star, ChevronLeft, Heart, Phone } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import "../styles/FacilityDetailPage.css"

export default function FacilityDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [facility, setFacility] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState("info")

  const dummyCostImage = "/images/sample-cost-info.png"

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
          homepage: "https://foresthospital.co.kr",
          establishedYear: 2015,
          evaluation: "등급제외",
          description: `# 포레스트요양병원

## 소개글
행복은 병원다워야 합니다.  
한의학, 의학 융합형 관리, 통합연구소 기반 환자 중심의 통합의료!  
체계적 R&D로 가기 위한 스마트 헬스 통합 구축 포레스트 요양병원이 함께합니다.  
학과 시공의 집합으로 병원의 품격을 지키기 위해 노력하는 병원이 되겠습니다.  
나치성 질병 예방 및 질병 발생에 아낌없이 투자합니다.

---

## 홈페이지
[https://foresthospital.co.kr](https://foresthospital.co.kr)

---

## 전화번호
1899-5868

---

## 진료시간
- **평일**: 09:00 - 18:00 (점심시간 12:30 - 13:30)
- **토요일**: 09:00 - 13:00 (점심시간 없음)
- **일요일 및 공휴일**: 휴진

---

## 특장점
- 한의학·의학 융복합 협진진료
- 환자맞춤식 의료
- R&D 통합연구소 운영
- 맞춤형 면역 다학제 진료
- 스마트 병동 시스템 완비
- 스마트한 개인맞춤성 검진 및 예방검사, 환경평가 등
- 국가검진센터 운영
- 치매안심병동
- 입퇴원 코디네이터 운영

---

## 평가등급
**등급 제외**  
(건강보험심사평가원 1회도 평가 없음)

---

## 병상정보
- 일반입원실 96개 (일반 70개, 특실 26개)
- 격리병상 0개

---

## 의료진 정보
- 조희주 한방내과 원장
- 최원주 재활의학과 전문의
- 최은주 내과 전문의

---

## 의료장비
- 고주파온열암치료
- 고압 산소치료
- 입자진단(스트레스인지도)

---

## 운영정보
- **평일**: 09:00 - 18:00 (점심시간 12:30 - 13:30)
- **토요일**: 09:00 - 13:00
- **일요일 및 공휴일**: 휴진

### 주차정보
- 무료 주차 가능, 외래시 3시간 무료

`,
          weekdayHours: "09:00 ~ 18:00",
          weekendHours: "09:00 ~ 13:00",
          holidayHours: "휴무",
          visitingHours: "09:00 ~ 18:00",
          images: ["/images/프레스토요양병원.jpg"],
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

  if (loading) return <div className="p-4 text-center">로딩 중...</div>
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>
  if (!facility) return <div className="p-4 text-center">시설 정보를 찾을 수 없습니다.</div>

  return (
    <div className="facility-detail-container">
      {/* 뒤로가기 */}
      <div className="back-button justify-start">
        <Link to="/search" className="flex items-center  text-gray-500">
          <ChevronLeft className="h-5 w-5" />
          <span>시설 목록</span>
        </Link>
      </div>

      {/* 이미지 */}
      <div className="image-container">
        <img src={facility.images[0] || "/placeholder.svg"} alt={facility.name} />
        <button onClick={handleToggleFavorite} className="favorite-button">
          <Heart className={isFavorite ? "text-red-500" : "text-gray-400"} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* 시설 정보 테이블 */}
      <div className="basic-info-table">
        <h2>기본 정보</h2>
        <table>
          <tbody>
            <tr><th>시설명</th><td>{facility.name}</td></tr>
            <tr><th>설립년도</th><td>{facility.establishedYear}년</td></tr>
            <tr><th>주소</th><td>{facility.address}</td></tr>
            <tr><th>연락처</th><td>{facility.phone}</td></tr>
            <tr><th>홈페이지 주소</th><td><a href={facility.homepage} target="_blank">{facility.homepage}</a></td></tr>
            <tr><th>평가등급</th><td>{facility.evaluation}</td></tr>
          </tbody>
        </table>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="info">시설 설명</TabsTrigger>
          <TabsTrigger value="cost">비용 안내</TabsTrigger>
          <TabsTrigger value="review">리뷰</TabsTrigger>
          <TabsTrigger value="question">문의</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="markdown-body bg-white rounded-lg shadow p-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{facility.description}</ReactMarkdown>

          <h3 className="mt-6 mb-2 text-lg font-semibold">지도 보기</h3>
          <div className="w-full h-64 rounded-lg overflow-hidden border">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(facility.address)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </TabsContent>

        <TabsContent value="cost" className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">비용 안내</h2>
          <img src={dummyCostImage} alt="비용안내" className="rounded-lg inline-block" />
          <p className="mt-4 text-gray-500">※ 자세한 비용은 추후 백엔드 연동 예정입니다.</p>
        </TabsContent>

        <TabsContent value="review" className="bg-white rounded-lg shadow p-6">
          <p>리뷰 기능은 준비중입니다.</p>
        </TabsContent>

        <TabsContent value="question" className="bg-white rounded-lg shadow p-6">
          <p>문의 기능은 준비중입니다.</p>
        </TabsContent>
      </Tabs>

      {/* 고정 전화문의 버튼 */}
      <a
        href={`tel:${facility.phone}`}
        className="call-button fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-600"
      >
        <Phone className="inline-block mr-2" /> 전화문의
      </a>
    </div>
  )
}
