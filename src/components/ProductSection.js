"use client"

import React from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, ChevronRight } from "lucide-react"

// 제품 데이터 - 실제 구현에서는 API에서 가져올 수 있음
// 백엔드 개발자 참고: GET /api/products/featured API 필요
// 응답 형식: { products: [{ id, name, price, discount, image }] }
function ProductSection() {
  const [products, setProducts] = React.useState([
    {
      id: 1,
      name: "실버워커 (바퀴X) 노인용 보행기 경량 접이식 보행보조기",
      price: "220,000원",
      discount: "80%",
      image: "/images/supportive-stroll.png",
    },
    {
      id: 2,
      name: "의료용 실버워커(MASSAGE 722F) 노인용 보행기",
      price: "100,000원",
      discount: "50%",
      image: "/images/elderly-woman-using-walker.png",
    },
    {
      id: 3,
      name: "의료용 워커 노인 보행기 4발 지팡이 실버카 보행보조기",
      price: "54,000원",
      discount: "60%",
      image: "/images/elderly-woman-using-rollator.png",
    },
  ])

  // 장바구니에 추가하는 함수
  // 백엔드 개발자 참고: POST /api/cart/add API 필요
  // 요청 형식: { productId: number, quantity: number }
  // 응답 형식: { success: boolean, message: string }
  const addToCart = (product) => {
    // 실제 구현에서는 Axios를 사용하여 API 호출
    // axios.post('/api/cart/add', { productId: product.id, quantity: 1 })
    //   .then(response => {
    //     // 성공 처리
    //   })
    //   .catch(error => {
    //     // 오류 처리
    //   });

    // 임시 알림
    alert(`${product.name}이(가) 장바구니에 추가되었습니다.`)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium">인기 제품 추천 상품</h2>
          <Link to="/products" className="text-xs text-gray-500 flex items-center">
            더보기 <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="bg-blue-500 rounded-xl p-4 mb-4">
          <div className="text-white mb-2">요양원 입소 전 준비하세요.</div>
          <div className="flex items-center">
            <Link to="/products" className="bg-yellow-400 text-blue-800 rounded-full px-3 py-1 text-sm font-medium">
              스토어 바로가기 &gt;
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {products.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`} className="block">
              <div className="border rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={product.image || "/images/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-24 object-cover"
                  />
                  <button
                    className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-sm"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        discount: product.discount,
                      })
                    }}
                  >
                    <ShoppingCart className="h-3 w-3 text-gray-500" />
                  </button>
                </div>
                <div className="p-2">
                  <div className="text-xs line-clamp-2">{product.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-medium">{product.price}</span>
                    <span className="text-xs text-red-500">{product.discount}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg p-4">
        <h3 className="font-medium mb-2">시설찾기</h3>
        <p className="text-sm text-gray-500 mb-3">지역과 조건에 맞는 최적의 요양 시설을 찾아보세요.</p>
        <Link to="/search" className="text-sm text-blue-600 flex items-center">
          시설 검색하기 <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

export default ProductSection
