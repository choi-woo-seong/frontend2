// SalesManagementPage.jsx - 수정된 판매 현황 페이지
"use client"

import Layout from "../../components/Layout"
import { useState, useEffect } from "react"
import { Button } from "../../components/ui/Button"
import { Link } from "react-router-dom"
import "../../../src/styles/AdminSalesManagementPage.css"
import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL;

const SalesManagementPage = () => {
  const [orders, setOrders] = useState([])
  const [salesSummary, setSalesSummary] = useState({
    totalSales: 0,
    totalOrders: 0
  })

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await axios.get(`${API_BASE_URL}/admin/orders/summary`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const { totalSales, orderCount, orders } = res.data
        setSalesSummary({ totalSales, totalOrders: orderCount })
        setOrders(orders)
      } catch (err) {
        console.error("판매 현황 데이터를 불러오는 데 실패했습니다.", err)
      }
    }
    fetchSalesData()
  }, [])

  const formatCurrency = (amount) => amount.toLocaleString("ko-KR") + "원"

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
  }

  return (
    <Layout>
      <div className="admin-sales-management max-w-6xl mx-auto px-4">
        <div className="admin-header ">
          <h1>상품 관리</h1>
          <Button variant="primary" onClick={() => {}}>
            새 상품 등록
          </Button>
        </div>

        {/* ✅ 탭 네비게이션 */}
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
              판매 현황
            </button>
          </div>
        </div>

        <h1>판매 현황 관리</h1>

        {/* ✅ 요약 카드 */}
        <div className="sales-summary">
          <div className="summary-card">
            <h3>총 매출</h3>
            <p className="summary-value">{formatCurrency(salesSummary.totalSales)}</p>
          </div>
          <div className="summary-card">
            <h3>총 주문 수</h3>
            <p className="summary-value">{salesSummary.totalOrders}건</p>
          </div>
        </div>

        {/* ✅ 주문 테이블 */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="px-6 py-4">주문 ID</th>
                <th className="px-6 py-4">주문자</th>
                <th className="px-6 py-4">상품명</th>
                <th className="px-6 py-4">수량</th>
                <th className="px-6 py-4">금액</th>
                <th className="px-6 py-4">주문일자</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.orderId} className="h-16">
                    <td className="px-6 py-4">{order.orderId}</td>
                    <td className="px-6 py-4">{order.userName}</td>
                    <td className="px-6 py-4">
                      {order.productName.split(",").map((name, idx) => (
                        <div key={idx}>{name}</div>
                      ))}
                    </td>
                    <td className="px-6 py-4">{order.quantity}</td>
                    <td className="px-6 py-4">{formatCurrency(order.totalPrice)}</td>
                    <td className="px-6 py-4">{formatDate(order.orderDate)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                    주문 내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}

export default SalesManagementPage
