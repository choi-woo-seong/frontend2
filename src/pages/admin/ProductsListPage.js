"use client"
import Layout from "../../components/Layout";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import Skeleton from "../../components/ui/Skeleton"
import Badge from "../../components/ui/Badge"
import "../../styles/AdminProductsListPage.css"
import {FaSearch} from "react-icons/fa"
import {Eye, Pencil, Trash2} from "lucide-react";

/**
 * 상품 목록 페이지
 * 등록된 모든 상품을 관리할 수 있는 관리자 페이지입니다.
 */
const ProductsListPage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStock, setFilterStock] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // 상품 데이터 로드
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // TODO: 백엔드 API 연동 - 상품 목록 요청
        // 현재는 더미 데이터로 대체
        setTimeout(() => {
          const dummyProducts = [
            {
              id: 1,
              name: "전동 침대",
              category: "침실 용품",
              price: 1200000,
              discountRate: 10,
              stock: 15,
              salesCount: 28,
              createdAt: new Date("2023-01-10"),
            },
            {
              id: 2,
              name: "접이식 워커",
              category: "이동 보조",
              price: 85000,
              discountRate: 5,
              stock: 22,
              salesCount: 35,
              createdAt: new Date("2023-02-15"),
            },
            {
              id: 3,
              name: "목욕의자",
              category: "욕실 용품",
              price: 65000,
              discountRate: 0,
              stock: 18,
              salesCount: 42,
              createdAt: new Date("2023-03-20"),
            },
            {
              id: 4,
              name: "전동 휠체어",
              category: "이동 보조",
              price: 2500000,
              discountRate: 15,
              stock: 8,
              salesCount: 12,
              createdAt: new Date("2023-04-05"),
            },
            {
              id: 5,
              name: "욕창방지 매트리스",
              category: "침실 용품",
              price: 180000,
              discountRate: 0,
              stock: 20,
              salesCount: 25,
              createdAt: new Date("2023-05-12"),
            },
            {
              id: 6,
              name: "디지털 혈압계",
              category: "의료 용품",
              price: 75000,
              discountRate: 8,
              stock: 30,
              salesCount: 48,
              createdAt: new Date("2023-06-18"),
            },
            {
              id: 7,
              name: "안전 손잡이",
              category: "욕실 용품",
              price: 45000,
              discountRate: 0,
              stock: 0,
              salesCount: 60,
              createdAt: new Date("2023-07-22"),
            },
            {
              id: 8,
              name: "식사 보조 도구 세트",
              category: "일상 생활용품",
              price: 35000,
              discountRate: 10,
              stock: 25,
              salesCount: 32,
              createdAt: new Date("2023-08-30"),
            },
          ]

          setProducts(dummyProducts)
          setTotalPages(Math.ceil(dummyProducts.length / 10)) // 페이지당 10개 항목
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("상품 목록 로드 중 오류 발생:", error)
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // 상품 상세 페이지로 이동
  const handleViewDetail = (productId) => {
    navigate(`/admin/products/${productId}`)
  }

  // 상품 수정 페이지로 이동
  const handleEdit = (productId) => {
    navigate(`/admin/products/${productId}/edit`)
  }

  // 상품 삭제 처리
  const handleDelete = (productId) => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      // TODO: 백엔드 API 연동 - 상품 삭제 요청
      console.log(`상품 ID ${productId} 삭제 요청`)

      // 임시로 프론트엔드에서만 삭제 처리
      setProducts(products.filter((product) => product.id !== productId))
    }
  }

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // 검색 시 첫 페이지로 이동
  }

  // 카테고리 필터 변경 핸들러
  const handleCategoryFilterChange = (e) => {
    setFilterCategory(e.target.value)
    setCurrentPage(1) // 필터 변경 시 첫 페이지로 이동
  }

  // 재고 필터 변경 핸들러
  const handleStockFilterChange = (e) => {
    setFilterStock(e.target.value)
    setCurrentPage(1) // 필터 변경 시 첫 페이지로 이동
  }

  // 필터링된 상품 목록
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || product.category === filterCategory
    const matchesStock =
      filterStock === "all" ||
      (filterStock === "inStock" && product.stock > 0) ||
      (filterStock === "outOfStock" && product.stock === 0)

    return matchesSearch && matchesCategory && matchesStock
  })

  // 페이지네이션 처리
  const itemsPerPage = 10
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)
  const totalFilteredPages = Math.ceil(filteredProducts.length / itemsPerPage)

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // 재고 상태에 따른 배지
  const getStockBadge = (stock) => {
    if (stock === 0) {
      return <Badge variant="danger">품절</Badge>
    } else if (stock < 10) {
      return <Badge variant="warning">부족</Badge>
    } else {
      return <Badge variant="success">충분</Badge>
    }
  }

  // 가격 포맷팅
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // 날짜 포맷팅
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ko-KR")
  }

  // 할인가 계산
  const calculateDiscountedPrice = (price, discountRate) => {
    return price * (1 - discountRate / 100)
  }

  // 새 상품 등록 페이지로 이동
  const handleAddNewProduct = () => {
    navigate("/admin/products/new")
  }

  // 로딩 중 스켈레톤 UI 표시
  if (isLoading) {
    return (
      <Layout>
      <div className="admin-products-list max-w-6xl mx-auto px-4">
        <div className="admin-header">
          <h1>상품 관리</h1>
          <Skeleton className="admin-button-skeleton" />
        </div>

        <div className="admin-filters">
          <Skeleton className="admin-search-skeleton" />
          <div className="admin-filter-group">
            <Skeleton className="admin-filter-skeleton" />
            <Skeleton className="admin-filter-skeleton" />
          </div>
        </div>

        <div className="admin-table-container">
          <Skeleton className="admin-table-skeleton" height="400px" />
        </div>

        <div className="admin-pagination">
          <Skeleton className="admin-pagination-skeleton" />
        </div>
      </div>
      </Layout>
    )
  }

  return (
    <Layout>
    <div className="admin-products-list max-w-6xl mx-auto px-4">
      <div className="admin-header">
        <h1>상품 관리</h1>
        <Button variant="primary" onClick={handleAddNewProduct}>
          새 상품 등록
          </Button>
      </div>

       {/* ✅ 여기에 탭 추가 */}
  <div className="mt-4 mb-6">
    <div className="bg-gray-50 rounded-md flex">
      <button
      
        className="flex-1 py-2 px-4 text-sm font-medium text-center rounded-md bg-white shadow-sm text-gray-900"
        disabled
      >
        상품 목록
      </button>
      <button
        onClick={() => navigate("/admin/sales")}
        className="flex-1 py-2 px-4 text-sm font-medium text-center text-gray-800 hover:bg-gray-100 transition-colors"
      >
        구매 현황
      </button>
    </div>
  </div>

  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 mb-6">
  {/* 검색창 */}
  <div className="relative w-full">
    <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
    <input
      type="text"
      placeholder="상품명 검색"
      value={searchTerm}
      onChange={handleSearchChange}
      className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 bg-white outline-none"
    />
  </div>

  {/* 필터 셀렉트 */}
  <div className="w-full sm:w-1/3">
    <select
      value={filterCategory}
      onChange={handleCategoryFilterChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-800 focus:outline-none"
    >
      <option value="all">전체</option>
      <option value="이동 보조">이동 보조</option>
      <option value="욕실 용품">욕실 용품</option>
      <option value="침실 용품">침실 용품</option>
      <option value="일상 생활용품">일상 생활용품</option>
      <option value="의료 용품">의료 용품</option>
    </select>
  </div>
</div>

      {filteredProducts.length === 0 ? (
        <div className="admin-empty-state">
          <p>검색 조건에 맞는 상품이 없습니다.</p>
        </div>
      ) : (
        <>
        <div className="admin-table-container">
  <table className="admin-table">
    <thead>
      <tr>
        <th className="px-6 py-4">상품명</th>
        <th className="px-6 py-4">카테고리</th>
        <th className="px-6 py-4">가격</th>
        <th className="px-6 py-4">재고</th>
        <th className="px-6 py-4">관리</th>
      </tr>
    </thead>
    <tbody>
      {currentProducts.map((product) => (
        <tr key={product.id} className="h-16">
          <td>{product.name}</td>
          <td>{product.category}</td>
          <td>{formatPrice(product.price)}</td>
          <td className="px-6 py-4">
            <div className="text-sm text-gray-800">{product.stock}개</div>
          </td>
          <td className="px-6 py-4">
            <div className="flex justify-start items-center gap-5">
              <Button variant="ghost" size="icon" onClick={() => handleViewDetail(product.id)}>
                <Eye className="w-5 h-5 text-blue-500" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleEdit(product.id)}>
                <Pencil className="w-5 h-5 text-orange-500" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                <Trash2 className="w-5 h-5 text-red-500" />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>




          {totalFilteredPages > 1 && (
            <div className="admin-pagination">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </Button>

              {[...Array(totalFilteredPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalFilteredPages}
              >
                다음
              </Button>
            </div>
          )}
        </>
      )}
    </div>
    </Layout>
  )
}

export default ProductsListPage
