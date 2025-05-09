"use client"
import Layout from "../../components/Layout";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import Skeleton from "../../components/ui/Skeleton"
import Badge from "../../components/ui/Badge"
import "../../styles/AdminProductsListPage.css"
import { FaSearch } from "react-icons/fa"
import { Pencil, Trash2 } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * 상품 목록 페이지
 * 등록된 모든 상품을 관리할 수 있는 관리자 페이지입니다.
 */
const ProductsListPage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStock, setFilterStock] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // 상품 데이터 로드
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const token = localStorage.getItem("accessToken");
  
        // 상품 + 카테고리 동시에 호출
        const [productRes, categoryRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }),
          fetch(`${API_BASE_URL}/categories`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          })
        ]);
  
        if (!productRes.ok || !categoryRes.ok) throw new Error("데이터 로드 실패");
  
        const productData = await productRes.json();
        const categoryData = await categoryRes.json();
  
        const mappedProducts = productData.map(p => ({
          id: p.id,
          name: p.name,
          category: p.categoryName,
          price: p.price,
          discountRate: p.discountPrice != null ? Math.round((1 - p.discountPrice / p.price) * 100) : 0,
          stock: p.stockQuantity,
          salesCount: p.salesCount || 0,
          createdAt: new Date(p.createdAt)
        }));
  
        setProducts(mappedProducts);
        setCategoryList(categoryData); // ✅ 여기에 저장
        setTotalPages(Math.ceil(mappedProducts.length / 10));
      } catch (error) {
        console.error("목록 로드 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProductsAndCategories();
  }, []);

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
      const token = localStorage.getItem("accessToken");
      fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error("삭제 실패");
          setProducts(prev => prev.filter(p => p.id !== productId));
        })
        .catch(err => {
          console.error(`상품 ID ${productId} 삭제 중 오류:`, err);
          alert("상품 삭제 중 오류가 발생했습니다.");
        });
    }
  }

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }

  // 카테고리 필터 변경 핸들러
  const handleCategoryFilterChange = (e) => {
    setFilterCategory(e.target.value);
    setCurrentPage(1);
  }

  // 재고 필터 변경 핸들러
  const handleStockFilterChange = (e) => {
    setFilterStock(e.target.value);
    setCurrentPage(1);
  }

  // 필터링된 상품 목록
  const filteredProducts = products.filter((product) => {
    
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    const matchesStock =
      filterStock === "all" ||
      (filterStock === "inStock" && product.stock > 0) ||
      (filterStock === "outOfStock" && product.stock === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // 페이지네이션 처리
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalFilteredPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  // 재고 상태에 따른 배지
  const getStockBadge = (stock) => {
    if (stock === 0) return <Badge variant="danger">품절</Badge>;
    if (stock < 10) return <Badge variant="warning">부족</Badge>;
    return <Badge variant="success">충분</Badge>;
  }

  // 가격 포맷팅
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(price);
  }

  // 새 상품 등록 페이지로 이동
  const handleAddNewProduct = () => {
    navigate("/admin/products/new");
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
    );
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

        <div className="mt-4 mb-6">
          <div className="bg-gray-50 rounded-md flex">
            <button
              className="flex-1 py-2 px-4 text-sm font-medium text-center rounded-md bg-white shadow-sm text-gray-900"
              disabled
            >상품 목록</button>
            <button
              onClick={() => navigate("/admin/sales")}
              className="flex-1 py-2 px-4 text-sm font-medium text-center text-gray-800 hover:bg-gray-100 transition-colors"
            >구매 현황</button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 mb-6">
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

          <div className="w-full sm:w-1/3">
            <select
              value={filterCategory}
              onChange={handleCategoryFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-800 focus:outline-none"
            >
              <option value="all">전체</option>
              {categoryList.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="admin-empty-state">
            <p>검색 조건에 맞는 상품이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="admin-table-container" style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
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
                >이전</Button>

                {[...Array(totalFilteredPages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(i + 1)}
                  >{i + 1}</Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalFilteredPages}
                >다음</Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export default ProductsListPage
