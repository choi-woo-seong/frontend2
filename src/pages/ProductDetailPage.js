// src/pages/ProductDetailPage.jsx
"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  ChevronLeft,
  Star,
  ShoppingCart
} from "lucide-react"
import { Button } from "../components/ui/Button"
import Layout from "../components/Layout"
import RecommendedSection from "../components/RecommendedSection"
import { useAuth } from "../hooks/use-auth" // ✅ 로그인 사용자 정보 사용




export default function ProductDetailPage() {
  const formatDate = isoString =>
    new Date(isoString).toLocaleString("ko-KR", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit"
    })
    
    const { user } = useAuth() // ✅ 현재 로그인 사용자 정보
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
    const hasToken = !!localStorage.getItem("accessToken");

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("accessToken")

      // 상품 정보
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/products/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (!res.ok) throw new Error("상품 정보 로드 실패")
      const data = await res.json()
setProduct(prev => ({
  ...prev,
  id: data.id,
  name: data.name,
  price: data.discountPrice
    ? data.discountPrice.toLocaleString("ko-KR") + "원"
    : data.price.toLocaleString("ko-KR") + "원",
  originalPrice: data.price.toLocaleString("ko-KR") + "원",
  discount: data.discountPrice
    ? Math.round((1 - data.discountPrice / data.price) * 100) + "%"
    : null,
  description: data.description,
  images: data.images && data.images.length > 0
    ? data.images
    : ["/images/default-product.png"],
  specifications: data.specifications || [],
  rating: data.rating || 0,
  reviewCount: data.reviewCount || 0,
  category: data.categoryName || "",
  features: data.features || [],
  manufacturer: data.manufacturer || "",
  originName: data.originName || "",
  stockQuantity: data.stockQuantity || 0,
  reviews: [],     // ✅ 초기화
  questions: [],   // ✅ 초기화
}))


      // 리뷰 불러오기
      const reviewRes = await fetch(
        `${process.env.REACT_APP_API_URL}/reviews/product/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const rawReviews = reviewRes.ok ? await reviewRes.json() : []
      const reviews = rawReviews.map(r => ({
        id:        r.id,
        productId: r.productId,
        userName:  r.userName,
        rating:    r.rating,
        content:   r.content,
        createdAt: r.createdAt
      }))
      setProduct(prev => ({ ...prev, reviews }))

      // 내 문의 불러오기
      const listRes = await fetch(
        `${process.env.REACT_APP_API_URL}/questions/my`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!listRes.ok) throw new Error("문의 목록 로드 실패")
      const list = await listRes.json()
      const questions = list.filter(q => String(q.productId) === String(id))
      setProduct(prev => ({ ...prev, questions }))
    } catch (err) {
      console.error("상품 로딩 실패:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  // 리뷰 기반 평균 평점, 개수 계산
  const reviews = product?.reviews || []
  const reviewCount = reviews.length
  const avgRating =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0

  const handleQuantityChange = amount => {
    const q = quantity + amount
    if (q >= 1) setQuantity(q)
  }

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      if(!token){
        alert("장바구니는 로그인 후 이용 가능합니다.");
        return;
      }

      if(product.stockQuantity === 0){
        alert("재고가 없습니다. 관리자에게 문의하세요.");
        return;
      }
      
      const res = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id, quantity })
      })
      if (!res.ok) throw new Error(await res.text())
      alert(`${product.name} ${quantity}개가 장바구니에 추가되었습니다.`)
    } catch (error) {
      console.error("장바구니 추가 실패:", error)
      alert("장바구니 추가 중 오류가 발생했습니다.")
    }
  }

  const handleReviewSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.id,
             userId: user?.userId || "익명", // ✅ 수정된 부분
            rating:    newReviewRating,
            content:   newReviewContent,
          })
        }
      )
      if (!response.ok) throw new Error("리뷰 등록 실패")
      await fetchProduct()
      setShowReviewForm(false)
      setNewReviewContent("")
      setNewReviewRating(1)
    } catch (e) {
      console.error("리뷰 등록 오류:", e)
      alert("리뷰 등록에 실패했습니다.")
    }
  }

  const handleQuestionSubmit = () => {
    (async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/questions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title:     `${product.name} 문의`,
              content:   newQuestionContent,
              productId: product.id
            }),
          }
        )
        if (!res.ok) throw new Error(await res.text())

        // 문의 목록 다시 로드
        const listRes = await fetch(
          `${process.env.REACT_APP_API_URL}/questions/my`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const list = await listRes.json()
        const filtered = list.filter(q => String(q.productId) === String(product.id))
        setProduct(prev => ({ ...prev, questions: filtered }))
        setShowQuestionForm(false)
        setNewQuestionContent("")
      } catch (err) {
        console.error("문의 등록 실패:", err)
        alert("문의 등록 중 오류가 발생했습니다.")
      }
    })()
  }

  if (loading) return <div className="container mx-auto px-4 py-4 animate-pulse">Loading...</div>
  if (!product) return <div className="container mx-auto px-4 py-4">제품을 찾을 수 없습니다.</div>

  return (
    <div className="container mx-auto px-4 py-4">
      {/* 뒤로가기 */}
      <div className="flex items-center mt-4 mb-4">
        <Link to="/products" className="flex items-center text-gray-500">
          <ChevronLeft className="h-5 w-5" />
          <span className="text-lg font-semibold ml-1">제품 목록</span>
        </Link>
      </div>

      {/* 대표 이미지 */}
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-64 object-contain bg-white rounded-lg mb-4"
      />

      {/* 상품 기본 정보 + 평점 */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <h1 className="text-xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.round(avgRating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm ml-1">{avgRating.toFixed(1)}</span>
          <span className="text-sm text-gray-500 ml-2">({reviewCount}개 리뷰)</span>
        </div>

        {/* 가격, 수량, 장바구니 등 */}
        <div className="mb-4">
          <div className="flex items-center">
            <span className="text-2xl font-bold">{product.price}</span>
            {product.discount && <span className="text-red-500 ml-2">{product.discount}</span>}
          </div>
          {product.discount && (
            <div className="text-sm text-gray-500 line-through">{product.originalPrice}</div>
          )}
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
            className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white gap-2 py-3"
            onClick={addToCart}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-base font-medium">장바구니</span>
          </Button>
        </div>

        {/* 재고 */}
        <h3 className="font-medium mb-2">남은 재고</h3>
        <table className="w-full text-sm mb-4">
          <tbody>
            <tr className="border-b">
              <td className="py-2">수량 : {product.stockQuantity} </td>
            </tr>
          </tbody>
        </table>
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
                {(product.specifications || []).map((spec, idx) => (
  <tr key={idx} className="border-b">
    <td className="py-2 font-medium w-1/5">{spec.label}</td>
    <td className="py-2">{spec.value}</td>
  </tr>
))}

                </tbody>
              </table>
              <h3 className="font-medium mb-2">카테고리</h3>
              <table className="w-full text-sm">
                <tbody>
                    <tr className="border-b">
                      <td className="py-2">{product.category}</td>
                    </tr>
                </tbody>
              </table>
              <h3 className="font-medium mb-2">원산지</h3>
              <table className="w-full text-sm">
                <tbody>
                    <tr className="border-b">
                      <td className="py-2">{product.originName}</td>
                    </tr>
                </tbody>
              </table>
              <h3 className="font-medium mb-2">제조사</h3>
              <table className="w-full text-sm">
                <tbody>
                    <tr className="border-b">
                      <td className="py-2">{product.manufacturer}</td>
                    </tr>
                </tbody>
              </table>
              <h3 className="font-medium mb-2">제품 특징</h3>
              <table className="w-full text-sm">
                <tbody>
                 {(product.features || []).map((features, idx) => (
  <tr key={idx} className="border-b">
    <td className="py-2">{features}</td>
  </tr>
))}

                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <>
            {(product.reviews || []).length === 0 ? (

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
            className={`h-4 w-4 ${
              i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
     <span className="text-sm font-medium ml-2">{r.userName}</span>


        <span className="text-xs text-gray-500 ml-auto">
          {formatDate(r.createdAt)}
        </span>
      </div>
      <p className="text-sm whitespace-pre-wrap">{r.content}</p>
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
  onClick={() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("리뷰 작성은 로그인 후 이용 가능합니다.");
      return;
    }
    setShowReviewForm(true);
  }}
>
  리뷰 작성
</Button>
              )}
            </>
          )}
  {activeTab === "qna" && (
        <>
        {(product.questions || []).length === 0 && (

            <div className="text-gray-500 text-sm mb-4">등록된 문의가 없습니다.</div>
          )}

          <div className="space-y-4 mb-4">
            {product.questions.map(q => (
              <div key={q.id} className="border-b pb-4">
                <div className="flex items-center mb-1">
                   <span className="font-medium">{q.userId}</span>
                  <span className="text-xs text-gray-500 ml-auto">{formatDate(q.createdAt)}</span>
                </div>
                <p className="text-sm">{q.content}</p>
                 {/* — 답변이 있을 때만 보여주는 블록 추가 */}

         {q.answer && (
           <div className="mt-2 p-3 bg-gray-50 rounded">
    <div className="flex items-center justify-between mb-1">
      <h4 className="font-medium text-sm">답변</h4>
      <span className="text-xs text-gray-500">
        {formatDate(q.answer.createdAt)}
      </span>
    </div>
    <p className="text-sm whitespace-pre-wrap">{q.answer.content}</p>
  </div>
         )}
         {/* — 여기까지 */}

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
            onClick={() => {
              const token = localStorage.getItem("accessToken");
              if (!token) {
                alert("문의 작성은 로그인 후 이용 가능합니다.");
                return;
              }
              setShowQuestionForm(true);
            }}
          >
            문의 작성
          </Button>
          )}
        </>
      )}

        </div>
      </div>

    </div>
  )
}