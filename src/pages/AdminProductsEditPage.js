"use client"

import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ChevronLeft, X } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Textarea } from "../components/ui/Textarea"
import { Select } from "../components/ui/Select"
import "../styles/AdminProductsNewPage.css"

const API_BASE_URL = process.env.REACT_APP_API_URL

function AdminProductsEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
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
    images: []
  })

  const featureOptions = [
    "경량 디자인", "접이식 구조", "방수 가능", "미끄럼 방지",
    "조절 가능한 높이", "인체공학적 설계", "쉬운 세척",
    "내구성 강화", "휴대성 우수", "안전 잠금 장치"
  ]

  // Load categories, origins, and product
  useEffect(() => {
    async function loadAll() {
      try {
        const token = localStorage.getItem("accessToken")
        const [catsRes, origsRes, prodRes] = await Promise.all([
          fetch(`${API_BASE_URL}/categories`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/origins`,   { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/products/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        ])
        if (!catsRes.ok) throw new Error("카테고리 로딩 실패")
        if (!origsRes.ok) throw new Error("원산지 로딩 실패")
        if (!prodRes.ok) throw new Error("상품 로딩 실패")

        const [cats, origs, p] = await Promise.all([catsRes.json(), origsRes.json(), prodRes.json()])
        console.log(p)
        setCategoryList(cats)
        setOriginList(origs)
        setFormData({
          name: p.name || "",
          category: p.category?.toString() || "",
          price: p.price?.toString() || "",
          discountPrice: p.discountPrice != null ? p.discountPrice.toString() : "",
          stock: p.stockQuantity?.toString() || "",
          description: p.description || "",
          shippingFee: p.shippingFee != null ? p.shippingFee.toString() : "",
          manufacturer: p.manufacturer || "",
          origin: p.origin?.toString() || "",
          specifications: p.specifications?.length ? p.specifications.map(s => ({ label: s.label, value: s.value })) : [{ label: "", value: "" }],
          features: p.features || [],
          images: p.images?.map(img => ({ url: img.imageUrl })) || []
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [id])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSpecChange = (idx, key, val) => {
    setFormData(prev => {
      const specs = [...prev.specifications]
      specs[idx][key] = val
      return { ...prev, specifications: specs }
    })
  }

  const handleAddSpec = () => {
    setFormData(prev => ({ ...prev, specifications: [...prev.specifications, { label: "", value: "" }] }))
  }

  const handleRemoveSpec = idx => {
    setFormData(prev => ({ ...prev, specifications: prev.specifications.filter((_, i) => i !== idx) }))
  }

  const toggleFeature = feat => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feat) ? prev.features.filter(f => f !== feat) : [...prev.features, feat]
    }))
  }

  const handleImageUpload = e => {
    const files = Array.from(e.target.files)
    const newImgs = files.map(file => ({ file, preview: URL.createObjectURL(file) }))
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newImgs] }))
  }

  const handleRemoveImage = idx => {
    setFormData(prev => {
      const imgs = [...prev.images]
      if (imgs[idx].preview) URL.revokeObjectURL(imgs[idx].preview)
      imgs.splice(idx, 1)
      return { ...prev, images: imgs }
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    // Validate selects
    if (!formData.category) return alert("카테고리를 선택하세요")
    if (!formData.origin)   return alert("원산지를 선택하세요")

    const token = localStorage.getItem("accessToken")
    const payload = {
      name: formData.name,
      category: formData.category,
      price: parseInt(formData.price, 10),
      discountPrice: formData.discountPrice ? parseInt(formData.discountPrice, 10) : null,
      stock: parseInt(formData.stock, 10),
      description: formData.description,
      shippingFee: formData.shippingFee ? parseInt(formData.shippingFee, 10) : null,
      manufacturer: formData.manufacturer,
      origin: formData.origin,
      specifications: formData.specifications.filter(s => s.label && s.value),
      features: formData.features
    }
    console.log("업데이트 payload:", payload)

    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const errText = await res.text()
      console.error("상품 수정 실패:", errText)
      return alert(`상품 수정 실패: ${errText}`)
    }
    alert("상품 수정 완료!")
    navigate("/admin/products")
  }

  if (loading) return <div>로딩 중...</div>

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
          {/* 상품명 & 카테고리 */}
          <div className="form-row">
            <div className="form-group">
              <label>상품명 *</label>
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="상품명을 입력하세요" />
            </div>
            <div className="form-group">
              <label>카테고리 *</label>
              <Select name="category" value={formData.category} onChange={handleChange}>
                <option value="" disabled>카테고리 선택</option>
                {categoryList.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </Select>
            </div>
          </div>
          {/* 가격, 재고 */}
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
          {/* 설명 */}
          <div className="form-group">
            <label>상품 설명</label>
            <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="상품 설명을 입력하세요" />
          </div>
          {/* 사양 */}
          <div className="form-group">
            <div className="flex justify-between items-center mb-2">
              <h2>상품 사양</h2>
              <Button type="button" onClick={handleAddSpec}>+ 사양 추가</Button>
            </div>
            {formData.specifications.map((spec, idx) => (
              <div key={idx} className="form-row" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', position: 'relative', marginBottom: '0.5rem' }}>
                <Input placeholder="항목 입력" value={spec.label} onChange={e => handleSpecChange(idx, 'label', e.target.value)} />
                <Input placeholder="값 입력" value={spec.value} onChange={e => handleSpecChange(idx, 'value', e.target.value)} className="pr-10" />
                {idx > 0 && <button type="button" onClick={() => handleRemoveSpec(idx)} style={{ position: 'absolute', top: 4, right: 4 }}><X className="w-4 h-4 text-gray-400 hover:text-red-500" /></button>}
              </div>
            ))}
          </div>
          {/* 특징 */}
          <div className="form-group mt-6">
            <label className="block text-sm font-medium mb-2">상품 특징</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {featureOptions.map(feat => (
                <label key={feat} className="feature-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feat)}
                    onChange={() => toggleFeature(feat)}
                  />
                  {feat}
                </label>
              ))}

            </div>
          </div>
          {/* 배송비, 제조사, 원산지 */}
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
                <option value="" disabled>원산지 선택</option>
                {originList.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </Select>
            </div>
          </div>
          {/* 이미지 */}
          <h2>상품 이미지</h2>
          <div className="image-upload-area" onClick={() => document.getElementById('image-upload-input').click()}>
            <img src="/icons/upload-photo.png" alt="사진 업로드" className="image-upload-icon-img" />
            <div className="image-upload-text">이미지를 업로드하세요 (최대 5MB)</div>
            <input id="image-upload-input" type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
          </div>
          {formData.images.length > 0 && <div className="image-preview-list" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>{formData.images.map((img, idx) => <div key={idx} style={{ position: 'relative' }}><img src={img.preview || img.url} alt="상품 이미지" className="uploaded-image" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} /><button type="button" onClick={() => handleRemoveImage(idx)} style={{ position: 'absolute', top: 4, right: 4 }}><X className="w-5 h-5 text-red-500" /></button></div>)}</div>}
          {/* 저장/취소 버튼 */}
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