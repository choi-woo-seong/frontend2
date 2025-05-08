"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  ChevronLeft,
  Search,
  Filter,
  ShoppingCart,
  Heart,
} from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import Layout from "../components/Layout"

const allProducts = [
  { id: 1, name: "실버워커 (바퀴X) 노인용 보행기 경량 접이식 보행보조기", price: "220,000원", discount: "80%", image: "/images/supportive-stroll.png", category: "보행보조기" },
  { id: 2, name: "의료용 실버워커(MASSAGE 722F) 노인용 보행기", price: "100,000원", discount: "50%", image: "/images/elderly-woman-using-walker.png", category: "보행보조기" },
  { id: 3, name: "의료용 워커 노인 보행기 4발 지팡이 실버카 보행보조기", price: "54,000원", discount: "60%", image: "/images/elderly-woman-using-rollator.png", category: "보행보조기" },
  { id: 4, name: "전동침대 의료용 병원침대 환자용 요양원 실버 가정용", price: "890,000원", discount: "30%", image: "/images/modern-hospital-bed.png", category: "침대" },
  { id: 5, name: "목욕의자 샤워의자 접이식 목욕의자 실버용품", price: "45,000원", discount: "20%", image: "/images/accessible-bathroom-chair.png", category: "목욕용품" },
  { id: 6, name: "고급 원목 지팡이 어르신 선물 효도선물 실버용품", price: "38,000원", discount: "15%", image: "/images/carved-wooden-cane.png", category: "지팡이" },
]

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
    sort: "popular",
    keyword: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { id: "all", name: "전체" },
    { id: "보행보조기", name: "보행보조기" },
    { id: "침대", name: "침대" },
    { id: "목욕용품", name: "목욕용품" },
    { id: "지팡이", name: "지팡이" },
    { id: "휠체어", name: "휠체어" },
  ]

  const parsePrice = (str) => parseInt(str.replace(/[^0-9]/g, ""))

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      let filtered = [...allProducts]

      if (filters.category !== "all") {
        filtered = filtered.filter(p => p.category === filters.category)
      }
      if (filters.minPrice) {
        filtered = filtered.filter(p => parsePrice(p.price) >= parseInt(filters.minPrice))
      }
      if (filters.maxPrice) {
        filtered = filtered.filter(p => parsePrice(p.price) <= parseInt(filters.maxPrice))
      }
      if (filters.keyword) {
        filtered = filtered.filter(p => p.name.includes(filters.keyword))
      }
      if (filters.sort === "priceAsc") {
        filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
      } else if (filters.sort === "priceDesc") {
        filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
      }

      setProducts(filtered)
      setLoading(false)
    }, 300)
  }, [filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const addToCart = (product) => {
    alert(`${product.name}이(가) 장바구니에 추가되었습니다.`)
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6">
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex items-center">
          <Link to="/" className="mr-2">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <h1 className="text-xl">요양용품 스토어</h1>
        </div>

        <div className="relative">
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            name="keyword"
            value={filters.keyword}
            onChange={handleFilterChange}
            placeholder="제품명을 검색하세요"
            className="pl-10 pr-4 py-2 w-full rounded-md border"
          />
        </div>

        <hr />

        <div className="flex items-center justify-between w-full mt-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center text-xs px-4 py-2 rounded-full border border-gray-300 bg-white shadow-sm font-medium"
            onClick={() => setShowFilters((v) => !v)}
          >
            <Filter className="h-4 w-4 mr-1 text-gray-700" />
            필터
          </Button>

          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="text-xs border border-gray-300 rounded-md py-2 px-3 bg-white shadow-sm w-40"
          >
            <option value="popular">인기순</option>
            <option value="newest">최신순</option>
            <option value="priceAsc">가격 낮은순</option>
            <option value="priceDesc">가격 높은순</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-md mb-6 space-y-4">
          <div>
            <h3 className="font-medium text-sm mb-2">카테고리</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilters((prev) => ({ ...prev, category: c.id }))}
                  className={`text-xs px-3 py-1 rounded-full shadow-sm ${
                    filters.category === c.id ? "bg-blue-500 text-white" : "bg-white border shadow-lg"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-2">가격</h3>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                name="minPrice"
                placeholder="최소 가격"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="text-xs w-32"
              />
              <span className="text-sm">~</span>
              <Input
                type="number"
                name="maxPrice"
                placeholder="최대 가격"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="text-xs w-32"
              />
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg h-80"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="bg-white rounded-lg shadow overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition"
                />
                {p.discount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {p.discount} 할인
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                  <button className="bg-white p-1 rounded-full shadow">
                    <Heart className="h-4 w-4 text-gray-500 hover:text-red-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      addToCart(p)
                    }}
                    className="bg-white p-1 rounded-full shadow"
                  >
                    <ShoppingCart className="h-4 w-4 text-gray-500 hover:text-blue-500" />
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="text-xs text-gray-500">{p.category}</div>
                <div className="text-sm font-medium line-clamp-2">{p.name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-500 font-semibold">{p.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductsPage;
