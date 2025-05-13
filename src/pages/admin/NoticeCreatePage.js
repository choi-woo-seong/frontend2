"use client"

import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"

import Layout from "../../components/Layout"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Textarea } from "../../components/ui/Textarea"
import { Label } from "../../components/ui/Label"
import "../../styles/AdminNoticeCreatePage.css"




const NoticeCreatePage = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isImportant: false,
    isVisible: true,
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = "제목을 입력해주세요"
    if (!formData.content.trim()) newErrors.content = "내용을 입력해주세요"
    return newErrors
  }
const handleSubmit = async (e) => {
  e.preventDefault()

  const validationErrors = validateForm()
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors)
    return
  }

  setIsSubmitting(true)

  try {
    const token = localStorage.getItem("accessToken")

    const response = await fetch(`${process.env.REACT_APP_API_URL}/notices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: formData.title,
        content: formData.content,
        isImportant: formData.isImportant,
        isVisible: formData.isVisible,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`서버 응답 오류: ${errorText}`)
    }

    alert("공지사항이 성공적으로 등록되었습니다.")
    navigate("/notices")
  } catch (error) {
    console.error("공지사항 등록 오류:", error)
    alert("공지사항 등록 중 오류가 발생했습니다. 다시 시도해주세요.")
  } finally {
    setIsSubmitting(false)
  }
}


  const handleCancel = () => {
    if (window.confirm("작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?")) {
      navigate("/admin/notices")
    }
  }

  return (
    <Layout>
      <div className="admin-notice-create max-w-6xl mx-auto px-4">
     <div className="admin-header flex items-center justify-between mb-6">
         <div className="flex items-center">
           <Link
             to="/notices"
             className="flex items-center text-gray-600 hover:text-gray-800"
           >
             <ChevronLeft className="h-5 w-5" />
          
           </Link>
           <h1 className="ml-4 text-2xl font-semibold">공지사항 작성</h1>
         </div>
        
       </div>

        <form onSubmit={handleSubmit} className="notice-form">
          <div className="form-group">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="공지사항 제목을 입력하세요"
            />
            {errors.title && <p className="error-text">{errors.title}</p>}
          </div>

          <div className="form-group">
            <Label htmlFor="content">내용 *</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              error={errors.content}
              rows={15}
              placeholder="공지사항 내용을 입력하세요"
            />
            {errors.content && <p className="error-text">{errors.content}</p>}
          </div>

         

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="notice-button notice-cancel-button"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="notice-button notice-submit-button"
            >
              {isSubmitting ? "등록 중..." : "공지사항 등록"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default NoticeCreatePage