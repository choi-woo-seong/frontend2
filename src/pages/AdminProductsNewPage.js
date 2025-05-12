"use client"

import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ChevronLeft, X } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Textarea } from "../components/ui/Textarea"
import { Select } from "../components/ui/Select"
import "../styles/AdminProductsNewPage.css"

const API_BASE_URL = process.env.REACT_APP_API_URL

const AdminProductsNewPage = () => {
  const navigate = useNavigate()

  const [categoryList, setCategoryList] = useState([])
  const [originList, setOriginList] = useState([])

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    discountPrice: "",
    stock: "",
    description: "",
    shippingFee: "",
    manufacturer: "",
    origin: "",
    specifications: [{ label: "", value: "" }],
    features: [],
    images: [],
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`)
        if (!res.ok) throw new Error("카테고리 로딩 실패")
        const data = await res.json()
        setCategoryList(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchCategories()
  }, [API_BASE_URL])

  useEffect(() => {
    const fetchOrigins = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/origins`)
        if (!res.ok) throw new Error("원산지 로딩 실패")
        const data = await res.json()
        setOriginList(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchOrigins()
  }, [API_BASE_URL])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddSpec = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }]
    }))
  }

  const handleSpecChange = (idx, field, val) => {
    setFormData(prev => {
      const specs = [...prev.specifications]
      specs[idx][field] = val
      return { ...prev, specifications: specs }
    })
  }

  const handleRemoveSpec = (idx) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== idx)
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({ file, preview: URL.createObjectURL(file) }))
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }))
  }

  const handleRemoveImage = (idx) => {
    setFormData(prev => {
      const imgs = [...prev.images]
      URL.revokeObjectURL(imgs[idx].preview)
      imgs.splice(idx, 1)
      return { ...prev, images: imgs }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // 1) CreateProductRequest 용 JSON blob
    const payload = {
      name: formData.name,
      category: Number(formData.category),
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
      stock: Number(formData.stock),
      description: formData.description,
      shippingFee: formData.shippingFee ? Number(formData.shippingFee) : undefined,
      manufacturer: formData.manufacturer,
      origin: Number(formData.origin),
      specifications: formData.specifications.filter(s => s.label && s.value),
      features: formData.features,
    }

    // 2) FormData 조립
    const fd = new FormData()
    fd.append(
      "product",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    )
    formData.images.forEach(({ file }) => {
      fd.append("images", file)
    })

    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type는 브라우저가 자동으로 multipart/form-data; boundary=… 를 넣어줍니다.
        },
        body: fd
      })
      if (!res.ok) throw new Error("상품 등록 실패")
      alert("상품 등록 완료!")
      navigate("/admin/products")
    } catch (err) {
      console.error(err)
      alert("상품 등록 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="admin-products-new-page">
      <div className="page-header-full">
        <div className="header-inner">
          <Link to="/admin/products" className="flex items-center gap-1">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
            <span className="page-title">새 상품 등록</span>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label>상품명 *</label>
              <Input name="name" autoComplete="off" value={formData.name} onChange={handleChange} placeholder="상품명을 입력하세요" />
            </div>
            <div className="form-group">
              <label>카테고리 *</label>
              <Select name="category" value={formData.category} onChange={handleChange}>
                <option value="">카테고리 선택</option>
                {categoryList.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>판매가격 (원) *</label>
              <Input name="price" value={formData.price} onChange={handleChange} placeholder="판매가격을 입력하세요" />
            </div>
            <div className="form-group">
              <label>할인가격 (원)</label>
              <Input name="discountPrice" value={formData.discountPrice} onChange={handleChange} placeholder="할인가격을 입력하세요" />
            </div>
            <div className="form-group">
              <label>재고수량 *</label>
              <Input name="stock" value={formData.stock} onChange={handleChange} placeholder="재고수량을 입력하세요" />
            </div>
          </div>

          <div className="form-group">
            <label>상품 설명</label>
            <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="상품에 대한 설명을 입력하세요" />
          </div>

          <div className="form-group">
            <div className="flex justify-between items-center mb-2">
              <h2>상품 사양</h2>
              <Button type="button" onClick={handleAddSpec}>+ 사양 추가</Button>
            </div>
            {formData.specifications.map((spec, idx) => (
              <div key={idx} className="form-row" style={{ display: "flex", gap: "0.5rem", position: "relative", marginBottom: "0.5rem", alignItems: "center" }}>
                <Input placeholder="항목 (예: 크기)" value={spec.label} onChange={e => handleSpecChange(idx, "label", e.target.value)} />
                <Input placeholder="값 (예: 10cm)" value={spec.value} onChange={e => handleSpecChange(idx, "value", e.target.value)} className="pr-10" />
                {idx > 0 && (
                  <button type="button" onClick={() => handleRemoveSpec(idx)} style={{ position: "absolute", top: "4px", right: "4px", background: "transparent", border: "none", padding: 0, cursor: "pointer" }}>
                    <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="form-group mt-6">
            <label className="block text-sm font-medium mb-2">상품 특징</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
             {["경량 디자인", "접이식 구조", "방수 가능", "미끄럼 방지", "조절 가능한 높이", "인체공학적 설계", "쉬운 세척", "내구성 강화", "휴대성 우수", "안전 잠금 장치"].map((feature, idx) => (
              <label key={idx} className="feature-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.features?.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                />
                {feature}
              </label>
            ))}

            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>배송비 (원)</label>
              <Input name="shippingFee" value={formData.shippingFee} onChange={handleChange} placeholder="배송비를 입력하세요" />
            </div>
            <div className="form-group">
              <label>제조사</label>
              <Input name="manufacturer" value={formData.manufacturer} onChange={handleChange} placeholder="제조사를 입력하세요" />
            </div>
            <div className="form-group">
              <label>원산지 *</label>
              <Select name="origin" value={formData.origin} onChange={handleChange}>
                <option value="">원산지 선택</option>
                {originList.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </Select>
            </div>
          </div>

          <h2>상품 이미지</h2>
          <div className="image-upload-area" onClick={() => document.getElementById("image-upload-input").click()}>
            <img src="/icons/upload-photo.png" alt="사진 업로드" className="image-upload-icon-img" />
            <div className="image-upload-text">이미지를 업로드하세요 (최대 5MB)</div>
            <input id="image-upload-input" type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleImageUpload} />
          </div>
          {formData.images.length > 0 && (
            <div className="image-preview-list" style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
              {formData.images.map((img, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={img.preview} alt="상품 이미지" className="uploaded-image" style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }} />
                  <button type="button" onClick={() => handleRemoveImage(i)} style={{ position: "absolute", top: "4px", right: "4px", background: "transparent", border: "none" }}>
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="form-actions" style={{ display: "flex", gap: "0.5rem", marginTop: "2rem" }}>
            <Button type="button" onClick={() => navigate("/admin/products")} className="product-action-button product-cancel-button">취소</Button>
            <Button type="submit" className="product-action-button product-submit-button">상품 등록</Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AdminProductsNewPage;
