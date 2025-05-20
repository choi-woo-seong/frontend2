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

const parsePrice = (str) => parseInt(str.replace(/[^0-9]/g, ""))

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
    sort: "popular",
    keyword: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState([{ id: "all", name: "전체" }])

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        const [productRes, categoryRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/products`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${process.env.REACT_APP_API_URL}/categories`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ])

        if (!productRes.ok || !categoryRes.ok) throw new Error("데이터 로드 실패");

        const productData = await productRes.json();
        const categoryData = await categoryRes.json();
        const mappedProducts = productData.map((p) => ({
          id: p.id,
          name: p.name,
          stockQuantity: p.stockQuantity,
          priceOriginal: p.price.toLocaleString("ko-KR") + "원", // 정가
          priceDiscounted: p.discountPrice
            ? p.discountPrice.toLocaleString("ko-KR") + "원"
            : p.price.toLocaleString("ko-KR") + "원", // 할인된 가격 (없으면 정가 사용)
          discount: p.discountPrice
            ? Math.round((1 - p.discountPrice / p.price) * 100) + "%"
            : null,
          images: p.images?.[0] || "/images/default-product.png",
          category: p.categoryName || "기타",
        }))

        setAllProducts(mappedProducts)
        setCategories([{ id: "all", name: "전체" }, ...categoryData.map(cat => ({ id: cat.name, name: cat.name }))])
      } catch (err) {
        console.error("데이터 로딩 오류:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProductsAndCategories()
  }, [])
  
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      let filtered = [...allProducts]

      if (filters.category !== "all") {
        filtered = filtered.filter((p) => p.category === filters.category)
      }
      if (filters.minPrice) {
        filtered = filtered.filter(
          (p) => parsePrice(p.price) >= parseInt(filters.minPrice)
        )
      }
      if (filters.maxPrice) {
        filtered = filtered.filter(
          (p) => parsePrice(p.price) <= parseInt(filters.maxPrice)
        )
      }
      if (filters.keyword) {
        filtered = filtered.filter((p) => p.name.includes(filters.keyword))
      }
      if (filters.sort === "priceAsc") {
        filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
      } else if (filters.sort === "priceDesc") {
        filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
      }

      setProducts(filtered)
      setLoading(false)
    }, 300)
  }, [filters, allProducts])

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

       {/* ─── 상품 리스트 ─── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg h-80"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => {
            console.log(p)
            const isSoldOut = p.stockQuantity <= 0   // ← 품절 여부 판단

            return (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className={`relative bg-white rounded-lg shadow overflow-hidden group
                  ${isSoldOut ? "opacity-50 pointer-events-none" : ""}`}
              >
                {/* 품절 뱃지 */}
                {isSoldOut && (
                  <span className="absolute top-2 right-2 z-20 bg-red-600 text-white text-sm font-bold uppercase px-3 py-1 rounded-full shadow-md ring-2 ring-white">
                    품절
                  </span>
                )}

                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={p.images}
                    alt={p.name}
                    className="w-full h-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="text-xs text-gray-500">{p.category}</div>
                  <div className="text-sm font-medium line-clamp-2">{p.name}</div>

                  {p.discount ? (
                    <>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-sm text-gray-400 line-through">
                          {p.priceOriginal}
                        </span>
                        <span className="text-sm text-blue-500 font-semibold">
                          {p.discount}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-black">
                        {p.priceDiscounted}
                      </div>
                    </>
                  ) : (
                    <div className="text-lg font-bold text-black">
                      {p.priceOriginal}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ProductsPage;
