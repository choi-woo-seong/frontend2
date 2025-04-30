"use client"

import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Textarea } from "../components/ui/Textarea"
import Checkbox from "../components/ui/Checkbox"
import "../styles/AdminProductsEditPage.css"

const AdminProductsEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
    description: "",
    imageUrls: "",
    specifications: [
      { label: "재질", value: "" },
      { label: "무게", value: "" },
      { label: "최대 하중", value: "" },
      { label: "높이 조절 범위", value: "" },
    ],
    features: [],
    isPromoted: false,
    isRecommended: false,
  })

  const featureOptions = [
    "경량 디자인", "접이식 구조", "방수 가능", "미끄럼 방지",
    "조절 가능한 높이", "인체공학적 설계", "쉬운 세척",
    "내구성 강화", "휴대성 우수", "안전 잠금 장치",
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const handleSpecChange = (index, field, value) => {
    const specs = [...formData.specifications]
    specs[index][field] = value
    setFormData((prev) => ({ ...prev, specifications: specs }))
  }

  const handleAddSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }],
    }))
  }

  const handleRemoveSpec = (index) => {
    const specs = formData.specifications.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, specifications: specs }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("상품 수정 완료!")
    navigate("/admin/products")
  }

  return (
    <div className="bg-white px-6 py-10 max-w-5xl mx-auto text-sm">
      <div className="mb-6">
        <Link to="/admin/products" className="flex items-center gap-1 text-lg font-semibold text-gray-700">
          <ChevronLeft className="h-5 w-5" />
          <span>상품 정보 수정</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-sm font-medium">상품명</label>
            <Input name="name" value={formData.name} onChange={handleChange} placeholder="상품명을 입력하세요" />

            <label className="block text-sm font-medium">카테고리</label>
            <Input name="category" value={formData.category} onChange={handleChange} placeholder="카테고리를 입력하세요" />

            <label className="block text-sm font-medium">가격 (원)</label>
            <Input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="가격을 입력하세요" />

            <label className="block text-sm font-medium">할인 가격 (원, 선택사항)</label>
            <Input name="discountPrice" type="number" value={formData.discountPrice} onChange={handleChange} placeholder="할인가를 입력하세요" />

            <label className="block text-sm font-medium">재고 수량</label>
            <Input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="재고수량을 입력하세요" />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPromoted"
                checked={formData.isPromoted}
                onChange={handleChange}
              />
              <span className="text-sm">프로모션 상품</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isRecommended"
                checked={formData.isRecommended}
                onChange={handleChange}
              />
              <span className="text-sm">추천 상품</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">상품 설명</label>
            <Textarea name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="상품에 대한 설명을 입력하세요" />

            <label className="block text-sm font-medium">이미지 URL (쉼표 구분)</label>
            <Textarea name="imageUrls" value={formData.imageUrls} onChange={handleChange} rows={3} placeholder="/image1.png, /image2.png, ..." />

            <label className="block text-sm font-medium mt-4">상품 특징</label>
            <div className="grid grid-cols-2 gap-2">
              {featureOptions.map((feature) => (
                <label key={feature} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                  />
                  <span className="text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold">상품 사양</h2>
            <Button type="button" onClick={handleAddSpec}>
              + 사양 추가
            </Button>
          </div>

          <div className="space-y-2">
            {formData.specifications.map((spec, idx) => (
              <div key={idx} className="spec-item-row">
                <Input
                  value={spec.label}
                  readOnly={idx < 4 ? true : false}
                  onChange={(e) => handleSpecChange(idx, "label", e.target.value)}
                  placeholder="항목 입력"
                  className="spec-label-input"
                />
                <div className="spec-value-wrapper">
                  <Input
                    value={spec.value}
                    onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                    placeholder="값 입력"
                    className="spec-value-input"
                  />
                  {idx >= 4 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="remove-spec-btn"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <Button type="button" onClick={() => navigate("/admin/products")} className="facility-button cancel">
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

export default AdminProductsEditPage
