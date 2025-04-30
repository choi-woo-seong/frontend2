"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { Link } from "react-router-dom"

const FacilityReviewPage = () => {
  const { id } = useParams()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newReview, setNewReview] = useState({
    rating: 5,
    content: "",
  })

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)

        // 백엔드 API가 준비되지 않았으므로 임시 데이터 사용
        setTimeout(() => {
          // 더미 데이터
          const dummyReviews = [
            {
              id: 1,
              userName: "김철수",
              rating: 5,
              content:
                "어머니를 모시고 있는데 시설이 깨끗하고 직원분들이 친절해서 만족합니다. 특히 식사가 영양가 있고 맛있어서 좋아요.",
              createdAt: "2023-05-15T09:30:00Z",
            },
            {
              id: 2,
              userName: "이영희",
              rating: 4,
              content:
                "전반적으로 만족스럽습니다. 프로그램도 다양하고 어르신들이 지루하지 않게 잘 돌봐주십니다. 다만 주차 공간이 조금 부족한 점이 아쉽습니다.",
              createdAt: "2023-04-22T14:15:00Z",
            },
            {
              id: 3,
              userName: "박지민",
              rating: 5,
              content:
                "아버지께서 3개월째 이용 중인데 건강 상태가 많이 좋아지셨어요. 물리치료사 선생님이 특히 잘 봐주셔서 감사합니다.",
              createdAt: "2023-03-10T11:45:00Z",
            },
          ]

          setReviews(dummyReviews)
          setLoading(false)
          setError(null)
        }, 500)
      } catch (err) {
        console.error("리뷰를 불러오는 중 오류가 발생했습니다:", err)
        setError("리뷰를 불러오는 중 오류가 발생했습니다.")
        setLoading(false)
      }
    }

    fetchReviews()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewReview({
      ...newReview,
      [name]: value,
    })
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    if (!newReview.content.trim()) {
      alert("리뷰 내용을 입력해주세요.")
      return
    }

    try {
      // 백엔드 API가 준비되지 않았으므로 임시 처리
      const newReviewData = {
        id: reviews.length + 1,
        userName: "사용자",
        rating: newReview.rating,
        content: newReview.content,
        createdAt: new Date().toISOString(),
      }

      // 새 리뷰를 목록에 추가
      setReviews([newReviewData, ...reviews])

      // 입력 폼 초기화
      setNewReview({
        rating: 5,
        content: "",
      })

      alert("리뷰가 등록되었습니다.")
    } catch (err) {
      console.error("리뷰 등록 중 오류가 발생했습니다:", err)
      alert("리뷰 등록 중 오류가 발생했습니다.")
    }
  }

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < rating ? "gold" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="inline-block"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      ))
  }

  return (
    <div className="container mx-auto p-4">
      {/* 탭 메뉴 */}
      <Tabs defaultValue="review" className="w-full">
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
          <TabsTrigger value="review">리뷰</TabsTrigger>
          <TabsTrigger value="question">
            <Link to={`/facility/${id}/question`} className="w-full h-full flex items-center justify-center">
              문의
            </Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="review" className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">리뷰 작성</h2>

          <form onSubmit={handleSubmitReview} className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">평점</label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="mr-1 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={star <= newReview.rating ? "gold" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium mb-2">
                리뷰 내용
              </label>
              <textarea
                id="content"
                name="content"
                value={newReview.content}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이용 경험을 자세히 작성해주세요."
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              리뷰 등록
            </button>
          </form>

          <h2 className="text-xl font-semibold mb-4">리뷰 목록</h2>

          {loading ? (
            <div className="text-center py-4">로딩 중...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-4 text-gray-500">아직 리뷰가 없습니다.</div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{review.userName}</div>
                    <div className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="mb-2">{renderStars(review.rating)}</div>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FacilityReviewPage
