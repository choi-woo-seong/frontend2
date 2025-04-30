"use client"
import Layout from "../../components/Layout";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Link } from "react-router-dom"
import "../../../src/styles/AdminSalesManagementPage.css"
import { FaSearch } from "react-icons/fa";

const SalesManagementPage = () => {
    const navigate = useNavigate()
  // 주문 상태 옵션
  const orderStatusOptions = [
    { value: "all", label: "전체" },
    { value: "pending", label: "결제완료" },
    { value: "processing", label: "상품준비중" },
    { value: "shipping", label: "배송중" },
    { value: "delivered", label: "배송완료" },
    { value: "cancelled", label: "취소" },
    { value: "refunded", label: "환불" },
  ]

  // 결제 방법 옵션
  const paymentMethodOptions = [
    { value: "all", label: "전체" },
    { value: "card", label: "신용카드" },
    { value: "bank", label: "계좌이체" },
    { value: "vbank", label: "가상계좌" },
    { value: "phone", label: "휴대폰결제" },
    { value: "kakao", label: "카카오페이" },
    { value: "naver", label: "네이버페이" },
  ]

  // 기간 옵션
  const periodOptions = [
    { value: "today", label: "오늘" },
    { value: "week", label: "1주일" },
    { value: "month", label: "1개월" },
    { value: "3months", label: "3개월" },
    { value: "6months", label: "6개월" },
    { value: "year", label: "1년" },
    { value: "custom", label: "직접입력" },
  ]

  // 상태 관리
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("orderNumber")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [salesSummary, setSalesSummary] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    pendingShipments: 0,
    cancelledOrders: 0,
    refundedOrders: 0,
  })

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  

  // 더미 데이터 생성
  useEffect(() => {
    const generateDummyOrders = () => {
      const products = [
        { id: 1, name: "전동 침대", price: 1200000, image: "/modern-hospital-bed.png" },
        { id: 2, name: "목욕 의자", price: 150000, image: "/accessible-bathroom-chair.png" },
        { id: 3, name: "고급 지팡이", price: 85000, image: "/carved-wooden-cane.png" },
        { id: 4, name: "보행 보조기", price: 230000, image: "/weathered-walker-close-up.png" },
      ]

      const users = [
        {
          id: 1,
          name: "김영희",
          email: "kim@example.com",
          phone: "010-1234-5678",
          address: "서울시 강남구 테헤란로 123",
        },
        {
          id: 2,
          name: "이철수",
          email: "lee@example.com",
          phone: "010-2345-6789",
          address: "서울시 서초구 서초대로 456",
        },
        {
          id: 3,
          name: "박지민",
          email: "park@example.com",
          phone: "010-3456-7890",
          address: "서울시 송파구 올림픽로 789",
        },
        {
          id: 4,
          name: "최수진",
          email: "choi@example.com",
          phone: "010-4567-8901",
          address: "서울시 마포구 홍대로 101",
        },
        {
          id: 5,
          name: "정민수",
          email: "jung@example.com",
          phone: "010-5678-9012",
          address: "서울시 용산구 이태원로 202",
        },
      ]

      const statuses = ["pending", "processing", "shipping", "delivered", "cancelled", "refunded"]
      const paymentMethods = ["card", "bank", "vbank", "phone", "kakao", "naver"]

      const dummyOrders = []

      // 현재 날짜
      const now = new Date()

      // 100개의 더미 주문 생성
      for (let i = 1; i <= 100; i++) {
        // 랜덤 날짜 (최근 6개월 내)
        const orderDate = new Date(now)
        orderDate.setDate(now.getDate() - Math.floor(Math.random() * 180))

        // 랜덤 사용자
        const user = users[Math.floor(Math.random() * users.length)]

        // 랜덤 상품 (1~3개)
        const orderProducts = []
        const numProducts = Math.floor(Math.random() * 3) + 1
        const usedProductIds = new Set()

        for (let j = 0; j < numProducts; j++) {
          let randomProduct
          do {
            randomProduct = products[Math.floor(Math.random() * products.length)]
          } while (usedProductIds.has(randomProduct.id))

          usedProductIds.add(randomProduct.id)

          const quantity = Math.floor(Math.random() * 2) + 1
          orderProducts.push({
            ...randomProduct,
            quantity,
            subtotal: randomProduct.price * quantity,
          })
        }

        // 총 금액 계산
        const totalAmount = orderProducts.reduce((sum, product) => sum + product.subtotal, 0)

        // 랜덤 상태 및 결제 방법
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]

        // 주문번호 생성 (날짜 + 순번)
        const orderNumber = `ORD-${orderDate.getFullYear()}${String(orderDate.getMonth() + 1).padStart(2, "0")}${String(orderDate.getDate()).padStart(2, "0")}-${String(i).padStart(4, "0")}`

        dummyOrders.push({
          id: i,
          orderNumber,
          orderDate,
          user,
          products: orderProducts,
          totalAmount,
          status,
          paymentMethod,
          shippingInfo: {
            trackingNumber:
              status === "shipping" || status === "delivered" ? `TRK${Math.floor(Math.random() * 10000000)}` : null,
            carrier: "우체국택배",
            estimatedDelivery: status === "shipping" ? new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000) : null,
          },
        })
      }

      return dummyOrders
    }

    const dummyOrders = generateDummyOrders()
    setOrders(dummyOrders)
    setFilteredOrders(dummyOrders)

    // 판매 요약 정보 계산
    const totalSales = dummyOrders.reduce(
      (sum, order) => (order.status !== "cancelled" && order.status !== "refunded" ? sum + order.totalAmount : sum),
      0,
    )

    const validOrders = dummyOrders.filter((order) => order.status !== "cancelled" && order.status !== "refunded")

    const pendingShipments = dummyOrders.filter(
      (order) => order.status === "pending" || order.status === "processing",
    ).length

    const cancelledOrders = dummyOrders.filter((order) => order.status === "cancelled").length

    const refundedOrders = dummyOrders.filter((order) => order.status === "refunded").length

    setSalesSummary({
      totalSales,
      totalOrders: validOrders.length,
      averageOrderValue: validOrders.length > 0 ? totalSales / validOrders.length : 0,
      pendingShipments,
      cancelledOrders,
      refundedOrders,
    })
  }, [])

  // 필터링 함수
  useEffect(() => {
    let result = [...orders]

    // 상태 필터링
    if (selectedStatus !== "all") {
      result = result.filter((order) => order.status === selectedStatus)
    }

    // 결제 방법 필터링
    if (selectedPayment !== "all") {
      result = result.filter((order) => order.paymentMethod === selectedPayment)
    }

    // 기간 필터링
    const today = new Date()
    let periodStartDate

    switch (selectedPeriod) {
      case "today":
        periodStartDate = new Date(today)
        periodStartDate.setHours(0, 0, 0, 0)
        result = result.filter((order) => order.orderDate >= periodStartDate)
        break
      case "week":
        periodStartDate = new Date(today)
        periodStartDate.setDate(today.getDate() - 7)
        result = result.filter((order) => order.orderDate >= periodStartDate)
        break
      case "month":
        periodStartDate = new Date(today)
        periodStartDate.setMonth(today.getMonth() - 1)
        result = result.filter((order) => order.orderDate >= periodStartDate)
        break
      case "3months":
        periodStartDate = new Date(today)
        periodStartDate.setMonth(today.getMonth() - 3)
        result = result.filter((order) => order.orderDate >= periodStartDate)
        break
      case "6months":
        periodStartDate = new Date(today)
        periodStartDate.setMonth(today.getMonth() - 6)
        result = result.filter((order) => order.orderDate >= periodStartDate)
        break
      case "year":
        periodStartDate = new Date(today)
        periodStartDate.setFullYear(today.getFullYear() - 1)
        result = result.filter((order) => order.orderDate >= periodStartDate)
        break
      case "custom":
        if (startDate && endDate) {
          const start = new Date(startDate)
          const end = new Date(endDate)
          end.setHours(23, 59, 59, 999) // 종료일 끝까지 포함
          result = result.filter((order) => order.orderDate >= start && order.orderDate <= end)
        }
        break
      default:
        break
    }

    // 검색어 필터링
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      switch (searchType) {
        case "orderNumber":
          result = result.filter((order) => order.orderNumber.toLowerCase().includes(term))
          break
        case "userName":
          result = result.filter((order) => order.user.name.toLowerCase().includes(term))
          break
        case "userPhone":
          result = result.filter((order) => order.user.phone.toLowerCase().includes(term))
          break
        case "productName":
          result = result.filter((order) => order.products.some((product) => product.name.toLowerCase().includes(term)))
          break
        default:
          break
      }
    }

    setFilteredOrders(result)
    setCurrentPage(1) // 필터링 후 첫 페이지로 이동
  }, [orders, selectedStatus, selectedPayment, selectedPeriod, startDate, endDate, searchTerm, searchType])

  // 페이지네이션 계산
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // 주문 상태 변경 핸들러
  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
    )
  }

  // 배송 정보 업데이트 핸들러
  const handleShippingUpdate = (orderId, trackingNumber, carrier) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "shipping",
              shippingInfo: {
                ...order.shippingInfo,
                trackingNumber,
                carrier,
                estimatedDelivery: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
              },
            }
          : order,
      ),
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            결제완료
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
            상품준비중
          </span>
        );
      case "shipping":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
            배송중
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            배송완료
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            취소
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            환불
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            알 수 없음
          </span>
        );
    }
  };
  
  // 주문 상태 한글 변환
  const getStatusInKorean = (status) => {
    switch (status) {
      case "pending":
        return "결제완료"
      case "processing":
        return "상품준비중"
      case "shipping":
        return "배송중"
      case "delivered":
        return "배송완료"
      case "cancelled":
        return "취소"
      case "refunded":
        return "환불"
      default:
        return status
    }
  }

  // 결제 방법 한글 변환
  const getPaymentMethodInKorean = (method) => {
    switch (method) {
      case "card":
        return "신용카드"
      case "bank":
        return "계좌이체"
      case "vbank":
        return "가상계좌"
      case "phone":
        return "휴대폰결제"
      case "kakao":
        return "카카오페이"
      case "naver":
        return "네이버페이"
      default:
        return method
    }
  }

  // 날짜 포맷 함수
  const formatDate = (date) => {
    if (!date) return ""
    const d = new Date(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
  }

  // 금액 포맷 함수
  const formatCurrency = (amount) => {
    return amount.toLocaleString("ko-KR") + "원"
  }

  const handleAddNewProduct = () => {
    navigate("/admin/products/new")
  }

  

  return (
    <Layout>
    <div className="admin-sales-management max-w-6xl mx-auto px-4">

    <div className="admin-header ">
        <h1>상품 관리</h1>
        <Button variant="primary" onClick={handleAddNewProduct}>
          새 상품 등록
          </Button>
      </div>

      {/* ✅ 탭 네비게이션 추가 */}
<div className="mt-4 mb-6">
  <div className="bg-gray-50 rounded-md flex">
    <Link
      to="/admin/products"
      className="flex-1 py-2 px-4 text-sm font-medium text-center text-gray-800 hover:bg-gray-100 transition-colors rounded-md"
    >
      상품 목록
    </Link>
    <button
      className="flex-1 py-2 px-4 text-sm font-medium text-center rounded-md bg-white shadow-sm text-gray-900"
      disabled
    >
      구매 현황
    </button>
  </div>
</div>

      <h1>판매 현황 관리</h1>

      {/* 판매 요약 정보 */}
      <div className="sales-summary">
        <div className="summary-card">
          <h3>총 매출</h3>
          <p className="summary-value">{formatCurrency(salesSummary.totalSales)}</p>
        </div>
        <div className="summary-card">
          <h3>총 주문 수</h3>
          <p className="summary-value">{salesSummary.totalOrders}건</p>
        </div>
        <div className="summary-card">
          <h3>배송 대기</h3>
          <p className="summary-value">{salesSummary.pendingShipments}건</p>
        </div>
        <div className="summary-card">
          <h3>취소 주문</h3>
          <p className="summary-value">{salesSummary.cancelledOrders}건</p>
        </div>
        <div className="summary-card">
          <h3>환불 주문</h3>
          <p className="summary-value">{salesSummary.refundedOrders}건</p>
        </div>
      </div>

      {/* 필터링 옵션 */}
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

  {/* 검색 조건 필터 */}
  <div className="w-full sm:w-1/3">
    <select
      value={searchType}
      onChange={(e) => setSearchType(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-800 focus:outline-none"
    >
      <option value="all">전체</option>
      <option value="orderNumber">주문번호</option>
      <option value="userName">주문자명</option>
      <option value="userPhone">연락처</option>
      <option value="productName">상품명</option>
    </select>
  </div>
</div>


      {/* 주문 목록 테이블 */}
      <div className="admin-table-container">
  <table className="admin-table">
    <thead>
      <tr>
        <th className="px-6 py-4">주문번호</th>
        <th className="px-6 py-4">주문자</th>
        <th className="px-6 py-4">상품명</th>
        <th className="px-6 py-4">수량</th>
        <th className="px-6 py-4">금액</th>
        <th className="px-6 py-4">주문일자</th>
        <th className="px-6 py-4">상태</th>
        <th className="px-6 py-4">관리</th>
      </tr>
    </thead>
    <tbody>
      {currentItems.length > 0 ? (
        currentItems.map((order) => (
          <tr key={order.id} className="h-16">
            <td className="px-6 py-4">{order.orderNumber}</td>
            <td className="px-6 py-4 font-medium text-gray-900">{order.user.name}</td>
            <td className="px-6 py-4">
              {order.products.map((product, index) => (
                <div key={index}>{product.name}</div>
              ))}
            </td>
            <td className="px-6 py-4">
              {order.products.reduce((sum, p) => sum + p.quantity, 0)}
            </td>
            <td className="px-6 py-4">{formatCurrency(order.totalAmount)}</td>
            <td className="px-6 py-4">{formatDate(order.orderDate)}</td>
            <td className="px-6 py-4">
  {getStatusBadge(order.status)}
</td>

<td className="px-6 py-4">
  <div className="action-buttons flex flex-col gap-2">
    <Link
      to={`/admin/sales/order/${order.id}`}
      className="bg-gray-100 text-gray-800 text-xs font-medium rounded-md px-3 py-1 text-center"
    >
      상세보기
    </Link>

    {order.status === "pending" && (
      <button
        className="bg-blue-100 text-blue-700 text-xs font-medium rounded-md px-3 py-1"
        onClick={() => handleStatusChange(order.id, "processing")}
      >
        상품준비
      </button>
    )}

    {order.status === "processing" && (
      <button
        className="bg-orange-100 text-orange-700 text-xs font-medium rounded-md px-3 py-1"
        onClick={() => {
          const trackingNumber = prompt("운송장 번호를 입력하세요:");
          const carrier = prompt("택배사를 입력하세요:", "우체국택배");
          if (trackingNumber) {
            handleShippingUpdate(order.id, trackingNumber, carrier || "우체국택배");
          }
        }}
      >
        배송시작
      </button>
    )}

    {order.status === "shipping" && (
      <button
        className="bg-green-100 text-green-700 text-xs font-medium rounded-md px-3 py-1"
        onClick={() => handleStatusChange(order.id, "delivered")}
      >
        배송완료
      </button>
    )}

    {(order.status === "pending" || order.status === "processing") && (
      <button
        className="bg-red-100 text-red-600 text-xs font-medium rounded-md px-3 py-1"
        onClick={() => {
          if (window.confirm("이 주문을 취소하시겠습니까?")) {
            handleStatusChange(order.id, "cancelled");
          }
        }}
      >
        취소
      </button>
    )}
  </div>
</td>




          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8" className="px-6 py-6 text-center text-gray-500">
            주문 내역이 없습니다.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>



      {/* 페이지네이션 */}
      {filteredOrders.length > 0 && (
        <div className="pagination">
          <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="pagination-button">
            &laquo;
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            &lt;
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <button
                key={i}
                onClick={() => handlePageChange(pageNum)}
                className={`pagination-button ${currentPage === pageNum ? "active" : ""}`}
              >
                {pageNum}
              </button>
            )
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            &gt;
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
    </Layout>
  )
}

export default SalesManagementPage
