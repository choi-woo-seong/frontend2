// src/pages/AdminQuestionsDetailPage.jsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Textarea } from "../components/ui/Textarea"
import { ChevronLeft } from "lucide-react"
import Badge from "../components/ui/Badge"
import "../styles/AdminQuestionsDetailPage.css"

const AdminQuestionsDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true)
      try {
        // TODO: 백엔드 API 연동 - 질문 상세 정보 가져오기
        const mockQuestion = {
          id,
          title: "요양원 입소 절차에 대해 문의드립니다.",
          content:
            "안녕하세요, 어머니(78세)의 요양원 입소를 고려하고 있습니다. 요양등급은 3등급이며, 입소 절차와 필요한 서류에 대해 알고 싶습니다. 또한 대략적인 비용도 알려주시면 감사하겠습니다.",
          createdAt: "2023-05-15T09:30:00",
          status: "pending", // pending, answered
          user: {
            id: "user123",
            name: "김철수",
            email: "user@example.com",
            phone: "010-1234-5678",
          },
          facility: {
            id: "facility456",
            name: "행복한 요양원",
          },
          answer: null,
        }
        setQuestion(mockQuestion)
      } catch (error) {
        console.error("질문 정보 로딩 오류:", error)
        alert("질문 정보를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestion()
  }, [id])

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value)
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      alert("답변 내용을 입력해주세요.")
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: 백엔드 API 연동 - 답변 등록 API 호출
      console.log("답변 등록:", { questionId: id, answer })
      setQuestion({
        ...question,
        status: "answered",
        answer: {
          content: answer,
          createdAt: new Date().toISOString(),
        },
      })
      alert("답변이 성공적으로 등록되었습니다.")
    } catch (error) {
      console.error("답변 등록 오류:", error)
      alert("답변 등록 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const [isEditing, setIsEditing] = useState(false) // ✨ 추가

const handleStartEditing = () => {
  setIsEditing(true)
  setAnswer(question.answer?.content || "")
}

const handleFinishEditing = async () => {
  if (!answer.trim()) {
    alert("수정할 답변 내용을 입력해주세요.")
    return
  }

  setIsSubmitting(true)
  try {
    // TODO: 실제 API 연동
    console.log("답변 수정 완료:", { questionId: id, updatedAnswer: answer })

    setQuestion({
      ...question,
      answer: {
        ...question.answer,
        content: answer,
        createdAt: new Date().toISOString(),
      },
    })

    setIsEditing(false) // ✨ 수정 완료 후 종료
    alert("답변이 성공적으로 수정되었습니다.")
  } catch (error) {
    console.error("답변 수정 오류:", error)
    alert("답변 수정 중 오류가 발생했습니다.")
  } finally {
    setIsSubmitting(false)
  }
}


  const handleUpdateAnswer = async () => {
    if (!answer.trim()) {
      alert("수정할 답변 내용을 입력해주세요.");
      return;
    }
  
    setIsSubmitting(true);
    try {
      // TODO: 백엔드 연동 시 실제 PUT 또는 PATCH 요청 필요
      console.log("답변 수정 요청:", { questionId: id, updatedAnswer: answer });
  
      setQuestion({
        ...question,
        answer: {
          ...question.answer,
          content: answer,
          createdAt: new Date().toISOString(), // 수정 시 시간 갱신
        },
      });
  
      alert("답변이 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("답변 수정 오류:", error);
      alert("답변 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (isLoading) {
    return <div className="admin-loading">질문 정보를 불러오는 중...</div>
  }

  if (!question) {
    return <div className="admin-error">질문 정보를 찾을 수 없습니다.</div>
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일 ${date.getHours()}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`
  }

  return (
    <div className="admin-questions-detail-page">
      <div className="admin-header flex items-center gap-2 mb-6">
  <button onClick={() => navigate("/admin/questions")} className="flex items-center text-gray-800 hover:text-black">
    <ChevronLeft className="h-5 w-5 mr-1" />
    <h1 className="text-xl font-semibold">문의 상세</h1>
  </button>
</div>

      <div className="question-detail-container">
        {/* 질문 정보 */}
        <div className="question-header">
          <div className="question-title-row">
            <h2>{question.title}</h2>
            <Badge
            variant={
              isEditing
                ? "warning"         // 수정 중이면 주의(warning) 색
                : question.status === "answered"
                ? "success"
                : "warning"
            }
          >
            {isEditing
              ? "수정 중"
              : question.status === "answered"
              ? "답변 완료"
              : "답변 대기"}
          </Badge>

          </div>
          <div className="question-meta">
            <span>작성자: {question.user.name}</span>
            <span>작성일: {formatDate(question.createdAt)}</span>
            {question.facility && (
              <span>관련 시설: {question.facility.name}</span>
            )}
          </div>
        </div>

        {/* 문의 내용 */}
        <div className="question-content">
          <h3>문의 내용</h3>
          <div className="content-box">{question.content}</div>
        </div>

        {/* 문의자 정보 */}
        <div className="user-info">
          <h3>문의자 정보</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">이름</span>
              <span className="info-value">{question.user.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">이메일</span>
              <span className="info-value">{question.user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">연락처</span>
              <span className="info-value">{question.user.phone}</span>
            </div>
          </div>
        </div>

        {question.status === "answered" && question.answer && !isEditing ? (
  // 답변 보기 모드
  <div className="answer-section">
    <h3>답변 내용</h3>
    <div className="answer-meta">
      <span>답변일: {formatDate(question.answer.createdAt)}</span>
    </div>
    <div className="content-box">{question.answer.content}</div>
    <div className="form-actions text-right mt-6">
    <div className="form-actions mt-10 flex">
  <Button
    className="ml-auto bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-2.5"
    onClick={handleStartEditing}
  >
    답변 수정
  </Button>
</div>

    </div>
  </div>
) : isEditing ? (
  // 수정 모드
  <div className="answer-form">
    <h3>답변 수정</h3>
    <div className="mb-9">
      <Textarea
        value={answer}
        onChange={handleAnswerChange}
        rows={6}
        placeholder="답변 내용을 수정하세요."
      />
    </div>
    <div className="form-actions">
    <Button
  className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2"
  onClick={handleFinishEditing}
  disabled={isSubmitting}
>
  {isSubmitting ? "수정 중..." : "수정 완료"}
</Button>

    </div>
  </div>
) : (
  // 답변 작성 폼 (초기)
  <div className="answer-form">
    <h3>답변 작성</h3>
    <div className="mb-9">
      <Textarea
        value={answer}
        onChange={handleAnswerChange}
        placeholder="문의에 대한 답변을 작성해주세요."
        rows={6}
      />
    </div>
    <div className="form-actions">
      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2"
        onClick={handleSubmitAnswer}
        disabled={isSubmitting}
      >
        {isSubmitting ? "등록 중..." : "답변 등록"}
      </Button>
    </div>
  </div>
)}

      </div>
    </div>
  )
}

export default AdminQuestionsDetailPage
