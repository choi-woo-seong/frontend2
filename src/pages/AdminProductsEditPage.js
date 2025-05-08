"use client"

import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ChevronLeft, X } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Textarea } from "../components/ui/Textarea"
import { Select } from "../components/ui/Select"
import Checkbox from "../components/ui/Checkbox"
import "../styles/AdminProductsNewPage.css"

const API_BASE_URL = process.env.REACT_APP_API_URL

const AdminProductsEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const featureOptions = [
    "경량 디자인", "접이식 구조", "방수 가능", "미끄럼 방지",
    "조절 가능한 높이", "인체공학적 설계", "쉬운 세척",
    "내구성 강화", "휴대성 우수", "안전 잠금 장치",
  ]

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

  // 초기 데이터 로드
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await fetch(`${API_BASE_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error("상품 로딩 실패")
        const p = await res.json()
        setFormData({
          name: p.name || "",
          category: p.category?.id?.toString() || "",
          price: p.price?.toString() || "",
          discountPrice: p.discountPrice != null ? p.discountPrice.toString() : "",
          stock: p.stockQuantity?.toString() || "",
          description: p.description || "",
          shippingFee: p.shippingFee != null ? p.shippingFee.toString() : "",
          manufacturer: p.manufacturer || "",
          origin: p.origin?.id?.toString() || "",
          specifications: p.specifications?.map(s => ({ label: s.specName, value: s.specValue })) || [],
          features: p.features || [],
          images: p.images?.map(img => ({ url: img.imageUrl })) || []
        })
      } catch (err) {
        console.error(err)
      }
    }
    loadProduct()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSpecChange = (idx, field, val) => {
    setFormData(prev => {
      const specs = [...prev.specifications]
      specs[idx][field] = val
      return { ...prev, specifications: specs }
    })
  }

  const handleAddSpec = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }]
    }))
  }

  const handleRemoveSpec = (idx) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== idx)
    }))
  }

  const toggleFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImgs = files.map(file => ({ file, preview: URL.createObjectURL(file) }))
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newImgs] }))
  }

  const handleRemoveImage = (idx) => {
    setFormData(prev => {
      const imgs = [...prev.images]
      if (imgs[idx].preview) URL.revokeObjectURL(imgs[idx].preview)
      imgs.splice(idx, 1)
      return { ...prev, images: imgs }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("accessToken")
    const payload = {
      name: formData.name,
      category: Number(formData.category),
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
      stock: Number(formData.stock),
      description: formData.description,
      shippingFee: formData.shippingFee ? Number(formData.shippingFee) : null,
      manufacturer: formData.manufacturer,
      origin: Number(formData.origin),
      specifications: formData.specifications.filter(s => s.label && s.value),
      features: formData.features,
    }
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      alert("상품 수정 완료!")
      navigate("/admin/products")
    } else {
      alert("상품 수정 실패")
    }
  }

  return (
    <div className="admin-products-new-page">
      <div className="page-header-full">
        <div className="header-inner">
          <Link to="/admin/products" className="flex items-center gap-1">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
            <span className="page-title">상품 정보 수정</span>
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label>상품명 *</label>
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="상품명을 입력하세요" />
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
            <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="상품 설명을 입력하세요" />
          </div>
          <div className="form-group">
            <div className="flex justify-between items-center mb-2">
              <h2>상품 사양</h2>
              <Button type="button" onClick={handleAddSpec}>+ 사양 추가</Button>
            </div>
            {formData.specifications.map((spec, idx) => (
              <div key={idx} className="form-row" style={{ display: 'flex', gap: '0.5rem', position: 'relative', marginBottom: '0.5rem', alignItems: 'center' }}>
                <Input value={spec.label} onChange={e => handleSpecChange(idx, 'label', e.target.value)} placeholder="항목 입력" />
                <Input value={spec.value} onChange={e => handleSpecChange(idx, 'value', e.target.value)} placeholder="값 입력" className="pr-10" />
                {idx > 0 && <button type="button" onClick={() => handleRemoveSpec(idx)} style={{ position: 'absolute', top: 4, right: 4 }}><X className="w-4 h-4 text-gray-400 hover:text-red-500" /></button>}
              </div>
            ))}
          </div>
          <div className="form-group mt-6">
            <label className="block text-sm font-medium mb-2">상품 특징</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {featureOptions.map((feat, idx) => (
                <label key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <Checkbox checked={formData.features.includes(feat)} onCheckedChange={() => toggleFeature(feat)} />
                  <span>{feat}</span>
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
                {originList.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </Select>
            </div>
          </div>
          <h2>상품 이미지</h2>
          <div className="image-upload-area" onClick={() => document.getElementById('image-upload-input').click()}>
            <img src="/icons/upload-photo.png" alt="사진 업로드" className="image-upload-icon-img" />
            <div className="image-upload-text">이미지를 업로드하세요 (최대 5MB)</div>
            <input id="image-upload-input" type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
          </div>
          {formData.images.length > 0 && (
            <div className="image-preview-list" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {formData.images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={img.preview || img.url} alt="상품 이미지" className="uploaded-image" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} />
                  <button type="button" onClick={() => handleRemoveImage(idx)} style={{ position: 'absolute', top: 4, right: 4 }}><X className="w-5 h-5 text-red-500" /></button>
                </div>
              ))}
            </div>
          )}
          <div className="form-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
            <Button type="button" onClick={() => navigate('/admin/products')} className="product-action-button product-cancel-button">취소</Button>
            <Button type="submit" className="product-action-button product-submit-button">저장하기</Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AdminProductsEditPage;
