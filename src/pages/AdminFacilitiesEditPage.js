"use client"

import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Textarea } from "../components/ui/Textarea"
import Checkbox from "../components/ui/Checkbox"
import "../styles/AdminFacilitiesEditPage.css"

const AdminFacilitiesEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    region: "",
    subregion: "",
    address: "",
    phone: "",
    capacity: "",
    rating: "",
    description: "",
    imageUrls: "",
    services: [],
    facilities: [],
    isPromoted: false,
    isCertified: false,
  })

  const servicesOptions = [
    "24시간 간호 서비스", "작업치료", "인지재활", "투약 관리", "이동 지원",
    "물리치료", "언어치료", "식사 제공", "목욕 서비스", "응급 의료 지원"
  ]

  const facilitiesOptions = [
    "개인 화장실", "공용 휴게실", "정원", "운동 시설", "카페테리아",
    "미용실", "도서관", "식당", "종교 시설", "세탁 서비스"
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleFeatureToggle = (item, category) => {
    setFormData((prev) => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter((i) => i !== item)
        : [...prev[category], item],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("시설 정보 수정 완료!")
    navigate("/admin/facilities")
  }

  return (
    <div className="bg-white px-6 py-10 max-w-5xl mx-auto text-sm">
      <div className="mb-6">
        <Link to="/admin/facilities" className="flex items-center gap-1 text-lg font-semibold text-gray-700">
          <ChevronLeft className="h-5 w-5" />
          <span>시설 정보 수정</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-sm font-medium">시설명</label>
            <Input name="name" value={formData.name} onChange={handleChange} placeholder="시설명을 입력하세요" />

            <label className="block text-sm font-medium">시설 유형</label>
            <Input name="type" value={formData.type} onChange={handleChange} placeholder="예: 요양원, 요양병원" />

            <label className="block text-sm font-medium">지역</label>
            <Input name="region" value={formData.region} onChange={handleChange} placeholder="예: 서울특별시" />

            <label className="block text-sm font-medium">세부 지역</label>
            <Input name="subregion" value={formData.subregion} onChange={handleChange} placeholder="예: 강남구" />

            <label className="block text-sm font-medium">주소</label>
            <Input name="address" value={formData.address} onChange={handleChange} placeholder="상세 주소 입력" />

            <label className="block text-sm font-medium">전화번호</label>
            <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="연락처 입력" />

            <label className="block text-sm font-medium">수용 인원</label>
            <Input name="capacity" value={formData.capacity} onChange={handleChange} placeholder="예: 50" />

            <label className="block text-sm font-medium">평점 (0~5)</label>
            <Input name="rating" value={formData.rating} onChange={handleChange} placeholder="예: 4.5" />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPromoted"
                checked={formData.isPromoted}
                onChange={handleChange}
              />
              <span className="text-sm">프로모션 시설</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isCertified"
                checked={formData.isCertified}
                onChange={handleChange}
              />
              <span className="text-sm">인증된 시설</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">시설 설명</label>
            <Textarea name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="시설에 대한 설명을 입력하세요" />

            <label className="block text-sm font-medium">이미지 URL (쉼표 구분)</label>
            <Textarea name="imageUrls" value={formData.imageUrls} onChange={handleChange} rows={3} placeholder="/image1.png, /image2.png, ..." />

            <label className="block text-sm font-medium mt-4">제공 서비스</label>
            <div className="grid grid-cols-2 gap-2">
              {servicesOptions.map((item) => (
                <label key={item} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(item)}
                    onChange={() => handleFeatureToggle(item, "services")}
                  />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>

            <label className="block text-sm font-medium mt-4">편의 시설</label>
            <div className="grid grid-cols-2 gap-2">
              {facilitiesOptions.map((item) => (
                <label key={item} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.facilities.includes(item)}
                    onChange={() => handleFeatureToggle(item, "facilities")}
                  />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <Button type="button" onClick={() => navigate("/admin/facilities")} className="facility-button cancel">
            취소
          </Button>
          <Button type="submit" className="facility-button submit">
            저장하기
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AdminFacilitiesEditPage