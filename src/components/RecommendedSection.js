"use client"

import React from "react"
import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

// 백엔드 개발자 참고: GET /api/products/recommended API 필요
// 응답 형식: { products: [{ id, name, price, image }] }
function RecommendedSection() {
  const [products, setProducts] = React.useState([
    {
      id: 4,
      name: "전동침대 의료용 병원침대 환자용 요양원 실버 가정용",
      price: "890,000원",
      image: "/images/modern-hospital-bed.png",
    },
    {
      id: 5,
      name: "목욕의자 샤워의자 접이식 목욕의자 실버용품",
      price: "45,000원",
      image: "/images/accessible-bathroom-chair.png",
    },
    {
      id: 6,
      name: "고급 원목 지팡이 어르신 선물 효도선물 실버용품",
      price: "38,000원",
      image: "/images/carved-wooden-cane.png",
    },
  ])

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium">함께 구매하면 좋은 제품</h2>
        <Link to="/products" className="text-xs text-gray-500 flex items-center">
          더보기 <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {products.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`} className="block">
            <div className="border rounded-lg overflow-hidden">
              <img
                src={product.image || "/images/placeholder.svg"}
                alt={product.name}
                className="w-full h-24 object-cover"
              />
              <div className="p-2">
                <div className="text-xs line-clamp-2">{product.name}</div>
                <div className="text-xs font-medium mt-1">{product.price}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RecommendedSection
