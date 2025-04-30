"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ChevronLeft, X } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Textarea } from "../components/ui/Textarea"
import { Select } from "../components/ui/Select"
import "../styles/AdminProductsNewPage.css"

const AdminProductsNewPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    discountPrice: "",
    stock: "",
    description: "",
    shippingFee: "",
    manufacturer: "",
    origin: "국내",
    specifications: [{ label: "", value: "" }],
    images: [],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAddSpec = () => {
    setFormData({ ...formData, specifications: [...formData.specifications, { label: "", value: "" }] })
  }

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specifications]
    newSpecs[index][field] = value
    setFormData({ ...formData, specifications: newSpecs })
  }

  const handleRemoveSpec = (index) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index)
    setFormData({ ...formData, specifications: newSpecs })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({ file, preview: URL.createObjectURL(file) }))
    setFormData({ ...formData, images: [...formData.images, ...newImages] })
  }

  const handleRemoveImage = (index) => {
    const newImages = [...formData.images]
    URL.revokeObjectURL(newImages[index].preview)
    newImages.splice(index, 1)
    setFormData({ ...formData, images: newImages })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    alert("상품 등록 완료!")
    navigate("/admin/products")
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
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="상품명을 입력하세요" />
            </div>
            <div className="form-group">
              <label>카테고리 *</label>
              <Select name="category" value={formData.category} onChange={handleChange}>
                <option value="">카테고리 선택</option>
                <option value="mobility">이동 보조</option>
                <option value="bathroom">욕실 용품</option>
                <option value="bedroom">침실 용품</option>
                <option value="daily">일상 생활용품</option>
                <option value="medical">의료 용품</option>
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
              <Button
                type="button"
                className="add-spec-button"  // ✅ 이걸 추가!
                onClick={handleAddSpec}
              >
                + 사양 추가
              </Button>

            </div>
            {formData.specifications.map((spec, index) => (
  <div
    key={index}
    className="form-row"
    style={{
      display: "flex",
      gap: "0.5rem",
      position: "relative",
      marginBottom: "0.5rem",
      alignItems: "center",
    }}
  >
    <Input
      placeholder="항목 (예: 크기, 무게)"
      value={spec.label}
      onChange={(e) => handleSpecChange(index, "label", e.target.value)}
    />
    <Input
      placeholder="값 (예: 10cm x 20cm, 500g)"
      value={spec.value}
      onChange={(e) => handleSpecChange(index, "value", e.target.value)}
      className="pr-10"
    />

    {/* index > 0일 때만 ✕ 버튼 표시 */}
    {index > 0 && (
      <button
        type="button"
        onClick={() => handleRemoveSpec(index)}
        style={{
          position: "absolute",
          top: "4px",
          right: "4px",
          background: "transparent",
          border: "none",
          padding: 0,
          lineHeight: 1,
          cursor: "pointer",
        }}
      >
        <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
      </button>
    )}
  </div>
))}


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
              <label>원산지</label>
              <Select name="origin" value={formData.origin} onChange={handleChange}>
                <option value="국내">국내</option>
                <option value="해외">해외</option>
              </Select>
            </div>
          </div>

          <h2>상품 이미지</h2>
          <div
            className="image-upload-area"
            onClick={() => document.getElementById("image-upload-input").click()}
          >
            <img src="/icons/upload-photo.png" alt="사진 업로드" className="image-upload-icon-img" />
            <div className="image-upload-text">이미지를 업로드하세요 (최대 5MB)</div>
            <input
              id="image-upload-input"
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </div>

          {formData.images.length > 0 && (
            <div className="image-preview-list" style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
              {formData.images.map((img, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img src={img.preview} alt="상품 이미지" className="uploaded-image" style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    style={{ position: "absolute", top: "4px", right: "4px", background: "transparent", border: "none" }}
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

            <div className="form-actions" style={{ display: "flex", gap: "0.5rem", marginTop: "2rem" }}>
              <Button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="product-action-button product-cancel-button"
              >
                취소
              </Button>
              <Button
                type="submit"
                className="product-action-button product-submit-button"
              >
                상품 등록
              </Button>
            </div>

        </div>
      </form>
    </div>
  )
}

export default AdminProductsNewPage