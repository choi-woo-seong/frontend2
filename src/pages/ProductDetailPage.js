// src/pages/ProductDetailPage.jsx
"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  ChevronLeft,
  Star,
  ShoppingCart,
  Share2
} from "lucide-react"
import { Button } from "../components/ui/Button"
import Layout from "../components/Layout"
import RecommendedSection from "../components/RecommendedSection"

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReviewContent, setNewReviewContent] = useState("")
  const [newReviewRating, setNewReviewRating] = useState(1)

  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [newQuestionContent, setNewQuestionContent] = useState("")

  useEffect(() => {
    setTimeout(() => {
      setProduct({
        id: Number(id),
        name: "실버워커 (바퀴X) 노인용 보행기 경량 접이식 보행보조기",
        price: "220,000원",
        originalPrice: "1,100,000원",
        discount: "80%",
        description:
          "가볍고 튼튼한 알루미늄 소재로 제작된 노인용 보행기입니다. 접이식 디자인으로 보관과 이동이 편리하며, 미끄럼 방지 고무 팁이 안전한 보행을 도와줍니다.",
        images: [
          "/images/supportive-stroll.png",
          "/images/elderly-woman-using-walker.png",
          "/images/elderly-woman-using-rollator.png"
        ],
        specifications: [
          { name: "재질", value: "알루미늄" },
          { name: "무게", value: "2.5kg" },
          { name: "최대 하중", value: "100kg" },
          { name: "높이 조절", value: "78-90cm" },
          { name: "접이식", value: "가능" },
          { name: "색상", value: "실버" }
        ],
        reviews: [],
        questions: [],
        rating: 0,
        reviewCount: 0
      })
      setLoading(false)
    }, 500)
  }, [id])

  const handleQuantityChange = amount => {
    const q = quantity + amount
    if (q >= 1) setQuantity(q)
  }

  const addToCart = () => {
    alert(`${product.name} ${quantity}개가 장바구니에 추가되었습니다.`)
  }

  const handleReviewSubmit = () => {
    const newReview = {
      id: product.reviews.length + 1,
      user: "나**",
      rating: newReviewRating,
      content: newReviewContent,
      date: new Date().toISOString().split("T")[0]
    }
    setProduct({
      ...product,
      reviews: [...product.reviews, newReview],
      reviewCount: product.reviewCount + 1,
      rating:
        (product.rating * product.reviewCount + newReviewRating) /
        (product.reviewCount + 1)
    })
    setShowReviewForm(false)
    setNewReviewContent("")
    setNewReviewRating(1)
  }

  const handleQuestionSubmit = () => {
    const newQuestion = {
      id: product.questions.length + 1,
      user: "나**",
      content: newQuestionContent,
      date: new Date().toISOString().split("T")[0]
    }
    setProduct({
      ...product,
      questions: [...product.questions, newQuestion]
    })
    setShowQuestionForm(false)
    setNewQuestionContent("")
  }

  if (loading) return (
    <div className="container mx-auto px-4 py-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-32 bg-gray-200 rounded mb-4"></div>
    </div>
  )

  if (!product) return (
    <div className="container mx-auto px-4 py-4">
      <p>제품을 찾을 수 없습니다.</p>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center mb-4">
        <Link to="/products" className="flex items-center text-gray-500">
          <ChevronLeft className="h-5 w-5" />
          <span>제품 목록</span>
        </Link>
      </div>

      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-64 object-contain bg-white rounded-lg mb-4"
      />

      <div className="bg-white rounded-lg p-4 mb-4">
        <h1 className="text-xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(product.rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm ml-1">{product.rating.toFixed(1)}</span>
          <span className="text-sm text-gray-500 ml-2">({product.reviewCount}개 리뷰)</span>
        </div>
        <div className="mb-4">
          <div className="flex items-center">
            <span className="text-2xl font-bold">{product.price}</span>
            <span className="text-red-500 ml-2">{product.discount}</span>
          </div>
          <div className="text-sm text-gray-500 line-through">{product.originalPrice}</div>
        </div>
        <div className="flex items-center mb-4">
          <span className="mr-2">수량:</span>
          <div className="flex items-center border rounded">
            <button
              className="px-3 py-1"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >-</button>
            <span className="px-3 py-1 border-x">{quantity}</span>
            <button className="px-3 py-1" onClick={() => handleQuantityChange(1)}>+</button>
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <Button
            className="flex flex-1 items-center justify-center bg-blue-500 hover:bg-blue-600 text-white gap-2 py-3"
            onClick={addToCart}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-base font-medium">장바구니</span>
          </Button>
          <Button variant="outline" className="p-3">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
        <div className="bg-gray-50 p-3 rounded text-sm">
          <p className="mb-1">· 무료배송</p>
          <p>· 3일 이내 출고</p>
        </div>
      </div>

      <div className="bg-white rounded-lg mb-4 overflow-hidden pb-4">
        <div className="flex border-b pb-3">
          <button
            className={`flex-1 py-3 text-center ${activeTab === "description" ? "border-b-2 border-blue-500 font-medium" : ""}`}
            onClick={() => setActiveTab("description")}
          >상세정보</button>
          <button
            className={`flex-1 py-3 text-center ${activeTab === "reviews" ? "border-b-2 border-blue-500 font-medium" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >리뷰</button>
          <button
            className={`flex-1 py-3 text-center ${activeTab === "qna" ? "border-b-2 border-blue-500 font-medium" : ""}`}
            onClick={() => setActiveTab("qna")}
          >문의</button>
        </div>
        <div className="p-4">
          {activeTab === "description" && (
            <div>
              <p className="mb-4">{product.description}</p>
              <h3 className="font-medium mb-2">제품 사양</h3>
              <table className="w-full text-sm">
                <tbody>
                  {product.specifications.map((spec, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2 font-medium w-1/3">{spec.name}</td>
                      <td className="py-2">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <>
              {product.reviews.length === 0 ? (
                <div className="text-gray-500 text-sm mb-4">등록된 리뷰가 없습니다.</div>
              ) : (
                <>
                  {(() => {
                    const total = product.reviews.reduce((sum, r) => sum + r.rating, 0)
                    const avg = total / product.reviews.length
                    return (
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 mr-1 ${
                              i < Math.round(avg)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-lg font-medium">{avg.toFixed(1)}</span>
                        <span className="ml-1 text-gray-500">({product.reviews.length}개)</span>
                      </div>
                    )
                  })()}

                  <div className="space-y-4 mb-4">
                    {product.reviews.map(r => (
                      <div key={r.id} className="border-b pb-4">
                        <div className="flex items-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm ml-2">{r.user}</span>
                          <span className="text-xs text-gray-500 ml-auto">{r.date}</span>
                        </div>
                        <p className="text-sm">{r.content}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {showReviewForm ? (
                <div className="p-4 mb-4 bg-gray-50 rounded">
                  <h4 className="font-medium mb-2">리뷰 작성하기</h4>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`cursor-pointer h-5 w-5 ${
                          i < newReviewRating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => setNewReviewRating(i + 1)}
                      />
                    ))}
                  </div>
                  <textarea
                    className="w-full border p-2 mb-2 rounded"
                    rows={3}
                    placeholder="리뷰를 작성하세요"
                    value={newReviewContent}
                    onChange={e => setNewReviewContent(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                      onClick={handleReviewSubmit}
                    >
                      등록
                    </Button>
                    <Button
                      className="border border-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-100"
                      onClick={() => setShowReviewForm(false)}
                    >
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-sm"
                  onClick={() => setShowReviewForm(true)}
                >
                  리뷰 작성
                </Button>
              )}
            </>
          )}
  {activeTab === "qna" && (
        <>
          {product.questions.length === 0 && (
            <div className="text-gray-500 text-sm mb-4">등록된 문의가 없습니다.</div>
          )}

          <div className="space-y-4 mb-4">
            {product.questions.map(q => (
              <div key={q.id} className="border-b pb-4">
                <div className="flex items-center mb-1">
                  <span>{q.user}</span>
                  <span className="text-xs text-gray-500 ml-auto">{q.date}</span>
                </div>
                <p className="text-sm">{q.content}</p>
              </div>
            ))}
          </div>

          {showQuestionForm ? (
            <div className="p-4 mb-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">문의 작성하기</h4>
              <textarea
                className="w-full border p-2 mb-2 rounded"
                rows={3}
                placeholder="문의 내용을 입력하세요"
                value={newQuestionContent}
                onChange={e => setNewQuestionContent(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                  onClick={handleQuestionSubmit}
                >
                  등록
                </Button>
                <Button
                  className="border border-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowQuestionForm(false)}
                >
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-sm"
              onClick={() => setShowQuestionForm(true)}
            >
              문의 작성
            </Button>
          )}
        </>
      )}

        </div>
      </div>

      <RecommendedSection />
    </div>
  )
}