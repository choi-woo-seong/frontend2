"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { Link } from "react-router-dom"

const FacilityQuestionPage = () => {
  const { id } = useParams()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    isPrivate: false,
  })

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)

        // 백엔드 API가 준비되지 않았으므로 임시 데이터 사용
        setTimeout(() => {
          // 더미 데이터
          const dummyQuestions = [
            {
              id: 1,
              title: "입소 절차에 대해 문의드립니다",
              content: "어머니(85세)를 모시고 싶은데 입소 절차와 필요한 서류에 대해 알고 싶습니다.",
              userName: "김철수",
              createdAt: "2023-05-20T10:15:00Z",
              isPrivate: false,
              isMine: true,
              answer:
                "안녕하세요. 입소를 위해서는 장기요양인정서, 건강진단서, 신분증 사본이 필요합니다. 자세한 상담은 전화로 문의주시면 안내해 드리겠습니다.",
              answeredAt: "2023-05-21T09:30:00Z",
            },
            {
              id: 2,
              title: "면회 시간이 어떻게 되나요?",
              content: "주말에 방문하려고 하는데 면회 가능한 시간을 알려주세요.",
              userName: "이영희",
              createdAt: "2023-05-18T14:20:00Z",
              isPrivate: false,
              isMine: false,
              answer: "안녕하세요. 면회 시간은 매일 오전 10시부터 오후 5시까지입니다. 주말에도 동일하게 운영됩니다.",
              answeredAt: "2023-05-19T11:45:00Z",
            },
            {
              id: 3,
              title: "개인 물품 반입 문의",
              content: "입소 시 개인 물품은 어느 정도까지 가져갈 수 있나요?",
              userName: "박지민",
              createdAt: "2023-05-15T16:30:00Z",
              isPrivate: false,
              isMine: false,
              answer: null,
              answeredAt: null,
            },
          ]

          setQuestions(dummyQuestions)
          setLoading(false)
          setError(null)
        }, 500)
      } catch (err) {
        console.error("문의를 불러오는 중 오류가 발생했습니다:", err)
        setError("문의를 불러오는 중 오류가 발생했습니다.")
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewQuestion({
      ...newQuestion,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmitQuestion = async (e) => {
    e.preventDefault()

    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.")
      return
    }

    try {
      // 백엔드 API가 준비되지 않았으므로 임시 처리
      const newQuestionData = {
        id: questions.length + 1,
        title: newQuestion.title,
        content: newQuestion.content,
        userName: "사용자",
        createdAt: new Date().toISOString(),
        isPrivate: newQuestion.isPrivate,
        isMine: true,
        answer: null,
        answeredAt: null,
      }

      // 새 문의를 목록에 추가
      setQuestions([newQuestionData, ...questions])

      // 입력 폼 초기화
      setNewQuestion({
        title: "",
        content: "",
        isPrivate: false,
      })

      alert("문의가 등록되었습니다.")
    } catch (err) {
      console.error("문의 등록 중 오류가 발생했습니다:", err)
      alert("문의 등록 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="container mx-auto p-4">
      {/* 탭 메뉴 */}
      <Tabs defaultValue="question" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="info">
            <Link to={`/facility/${id}`} className="w-full h-full flex items-center justify-center">
              기본 정보
            </Link>
          </TabsTrigger>
          <TabsTrigger value="cost">
            <Link to={`/facility/${id}/cost`} className="w-full h-full flex items-center justify-center">
              비용 안내
            </Link>
          </TabsTrigger>
          <TabsTrigger value="review">
            <Link to={`/facility/${id}/review`} className="w-full h-full flex items-center justify-center">
              리뷰
            </Link>
          </TabsTrigger>
          <TabsTrigger value="question">문의</TabsTrigger>
        </TabsList>

        <TabsContent value="question" className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">문의하기</h2>

          <form onSubmit={handleSubmitQuestion} className="mb-6">
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                제목
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newQuestion.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="문의 제목을 입력하세요"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium mb-2">
                내용
              </label>
              <textarea
                id="content"
                name="content"
                value={newQuestion.content}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="문의 내용을 자세히 작성해주세요."
              ></textarea>
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                name="isPrivate"
                checked={newQuestion.isPrivate}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="isPrivate" className="text-sm">
                비공개 문의
              </label>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              문의 등록
            </button>
          </form>

          <h2 className="text-xl font-semibold mb-4">문의 목록</h2>

          {loading ? (
            <div className="text-center py-4">로딩 중...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-4 text-gray-500">아직 문의가 없습니다.</div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">
                      {question.isPrivate && <span className="mr-2 text-xs bg-gray-200 px-2 py-1 rounded">비공개</span>}
                      {question.title}
                    </div>
                    <div className="text-sm text-gray-500">{new Date(question.createdAt).toLocaleDateString()}</div>
                  </div>
                  <p className="text-gray-700 mb-2">
                    {question.isPrivate && !question.isMine ? "비공개 문의입니다." : question.content}
                  </p>

                  {question.answer && (
                    <div className="bg-gray-50 p-3 rounded mt-2">
                      <div className="font-medium mb-1">답변</div>
                      <p className="text-gray-700">{question.answer}</p>
                      <div className="text-sm text-gray-500 mt-1">
                        {new Date(question.answeredAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FacilityQuestionPage
