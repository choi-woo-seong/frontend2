"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Layout from "../components/Layout"
import { Button } from "../components/ui/Button"
import Skeleton from "../components/ui/Skeleton"
import Badge from "../components/ui/Badge"
import "../styles/AdminInquiriesPage.css"
import { ChevronLeft } from "lucide-react"
import { Textarea } from "../components/ui/Textarea"

const API_BASE_URL = process.env.REACT_APP_API_URL;


const AdminQuestionsDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [question, setQuestion] = useState(null)
  const [answerContent, setAnswerContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchDetail = async () => {
      const token = localStorage.getItem("accessToken")
      if (!token) return navigate("/login")
      try {
        const res = await fetch(`${API_BASE_URL}/questions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error("불러오기 실패")
        const data = await res.json()
        setQuestion(data)
        setAnswerContent(data.answer?.content || "")
      } catch (err) {
        console.error("질문 상세 불러오기 오류:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetail()
  }, [id, navigate])

  const handleAnswerSubmit = async () => {
  if (!answerContent.trim()) return alert("답변을 입력해주세요")
  const token = localStorage.getItem("accessToken")
  if (!token) return navigate("/login")
  setIsSubmitting(true)

  try {
    const method = question.answer ? "PUT" : "POST"  // ✅ 등록 vs 수정 구분

    const res = await fetch(`${API_BASE_URL}/questions/${id}/answer`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: answerContent }),
    })

    if (!res.ok) throw new Error("등록 실패")

    const data = await res.json()
    setQuestion({ ...question, answer: data, status: "answered" })
    alert(question.answer ? "답변이 수정되었습니다." : "답변이 등록되었습니다.")
    navigate("/admin/questions")
  } catch (err) {
    console.error("답변 등록/수정 실패:", err)
  } finally {
    setIsSubmitting(false)
  }
}

  if (isLoading) {
    return <Layout><div className="admin-loading">로딩 중...</div></Layout>
  }

  if (!question) {
    return <Layout><div className="admin-error">질문을 찾을 수 없습니다.</div></Layout>
  }

  const formatDate = (date) => new Date(date).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Layout>
      <div className="admin-inquiries max-w-4xl mx-auto px-4">
        <div className="admin-header flex items-center gap-2 mb-6">
          <button onClick={() => navigate("/admin/questions")} className="flex items-center text-gray-800 hover:text-black">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <h1 className="text-xl font-semibold">문의 상세</h1>
          </button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{question.title}</h2>
            <div className="text-sm text-gray-600">{formatDate(question.createdAt)}</div>
            <Badge variant={question.answer ? "success" : "warning"} className="mt-2">
              {question.answer ? "답변 완료" : "미답변"}
            </Badge>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-1">질문 내용</h3>
            <p className="p-3 border rounded bg-gray-50 whitespace-pre-wrap">{question.content}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-1">문의자</h3>
            <p>이름: {question.userName || "-"}</p>
            <p>이메일: {question.userEmail || "-"}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-1">답변 작성</h3>
            <Textarea
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="답변 내용을 입력해주세요"
              rows={6}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleAnswerSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "등록 중..." : question.answer ? "답변 수정" : "답변 등록"}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminQuestionsDetailPage;
